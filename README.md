# CRM — Frontend

Interface web do CRM: carteira de clientes, funil de vendas, distribuição de leads entre
vendedores e central de conversas. Construída em **Angular 19** com **MDB Angular** e
**SweetAlert2**, consumindo a API do projeto
[CRM-BackEnd](https://github.com/camilaarodriguez/CRM-BackEnd).

## Stack

| Recurso | Versão |
|---|---|
| Angular | 19.2 |
| MDB Angular UI Kit | 8.0 |
| SweetAlert2 | 11 |
| TypeScript | 5.7 (modo estrito) |
| Node | 20 ou 22 |

## Deploy em produção (EC2)

O deploy é feito pelo script [`deploy/setup.sh`](https://github.com/camilaarodriguez/CRM-BackEnd/blob/main/deploy/setup.sh)
do repositório da API, que clona este repositório, gera o build de produção e publica o
resultado no Nginx. O passo a passo está no
[README da API](https://github.com/camilaarodriguez/CRM-BackEnd#deploy-na-aws-com-o-script-sh).

O que o script faz com este projeto:

```bash
npm ci
npx ng build --configuration production   # gera dist/crm-frontend/browser
cp -r dist/crm-frontend/browser/. /var/www/crm/
```

O Nginx entrega os arquivos de `/var/www/crm` com **fallback para o `index.html`**
(`try_files $uri $uri/ /index.html`). Assim, um F5 em `/clientes` ou `/conversas/5` funciona,
porque quem resolve a rota é o Angular. O mesmo Nginx repassa `/api` para a API Spring Boot.

### Endereço da API

Não há endereço fixo no código. Os dois ambientes usam a URL relativa `/api`:

| Ambiente | Arquivo | Quem atende `/api` |
|---|---|---|
| Desenvolvimento | `src/environments/environment.ts` | o proxy do `ng serve` ([proxy.conf.json](proxy.conf.json)) → `localhost:8080` |
| Produção | `src/environments/environment.production.ts` | o Nginx da EC2 → `127.0.0.1:8080` |

O mesmo build funciona em qualquer IP ou domínio, nas duas contas AWS.

## Rodar localmente

Com a API rodando em `localhost:8080` (veja o README da API):

```bash
npm install
npm start
```

A aplicação sobe em <http://localhost:4200>, e as chamadas para `/api` são repassadas para a API.
Na primeira vez, use **Criar conta** na tela de login ou o administrador definido por
`ADMIN_EMAIL`/`ADMIN_PASSWORD` na API.

Para gerar o build de produção localmente:

```bash
npm run build
```

## Autenticação

- **Login** (`/login`) e **Criar conta** (`/cadastro`) chamam `POST /api/auth/login` e
  `POST /api/auth/registro`. A API devolve um **JWT** com data de expiração, guardado pelo
  `AuthService` no `localStorage`.
- **`authInterceptor`**: anexa `Authorization: Bearer <token>` em toda chamada à API, exceto
  login e cadastro.
- **`errorInterceptor`**: quando a API responde **401** (token vencido ou inválido), encerra a
  sessão, avisa "Sessão expirada" e volta ao login. Falhas de rede e erros 5xx também são avisados.
  Os erros 400, 403 e 409 são mostrados pela própria tela.
- **Route Guards**:
  - `authGuard` protege toda a área interna e confere a expiração do token a cada navegação;
  - `distribuicaoGuard` libera a tela **Equipe** só para administrador e gerente;
  - `visitanteGuard` leva quem já está logado direto para a área interna.

## Telas

- **Login** e **Criar conta**: validação no formulário e mensagens da API (senha errada, usuário
  inativo, e-mail já cadastrado).
- **Clientes**: listagem paginada com busca por nome ou e-mail, filtro por etapa do funil e por
  vendedor, e opção de incluir inativos. Ações por linha: ficha completa, mover no funil,
  reatribuir (gestão), editar e excluir.
- **Cadastro / edição de cliente**: formulário com todos os campos da entidade.
- **Conversas**: fila de atendimento com não lidas, status e responsável. O vendedor vê apenas a
  própria fila; a gestão vê a operação inteira e pode filtrar por vendedor.
- **Atendimento (chat)**: histórico de mensagens com direção, tipo, status de entrega e autor,
  além do envio de novas mensagens.
- **Equipe**: gestão de usuários com perfis de acesso, ativação/desativação e exclusão.

## Arquitetura

```
src/app/
├── core/
│   ├── guards/          autenticacao (token valido), perfil de gestao e visitante
│   ├── interceptors/    envio do JWT e tratamento global de erros HTTP
│   ├── models/          interfaces e enums espelhando os DTOs da API
│   ├── services/        uma service por controller do backend + AuthService
│   └── utils/           normalizacao de erro HTTP
├── shared/components/   cabecalho, paginacao, estado vazio e carregamento
├── layout/              navbar, menu lateral e a casca da area interna
└── pages/               login, cadastro, clientes, conversas e equipe
```

### Services

Cada service conversa com **um único controller**:

| Service | Endpoint | Operações |
|---|---|---|
| `AuthService` | `/api/auth` | login, cadastro e sessão (token + expiração) |
| `ClienteService` | `/api/clientes` | GET, POST, PUT, PATCH (funil e reatribuição), DELETE |
| `UsuarioService` | `/api/usuarios` | GET, POST, PUT, PATCH (status), DELETE |
| `ConversaService` | `/api/conversas` | GET (lista paginada e por id) |
| `MensagemService` | `/api/mensagens` | GET por conversa, POST de envio |

`NotificacaoService` concentra o feedback visual com SweetAlert2.

### Tratamento de erros

Todas as chamadas passam por `tratarErro`, que converte qualquer falha para o mesmo formato do
`GlobalExceptionHandler` da API (`status`, `erro`, `mensagem`, `caminho`, `detalhes`). Assim, cada
tela mostra a mensagem certa no contexto certo.

### Roteamento

A rota raiz carrega o layout sob o `authGuard` e declara um bloco `children`. Dentro dele,
`clientes`, `conversas` e `equipe` trazem seus próprios arquivos de rotas via `loadChildren`, e a
área de equipe ainda passa pelo `distribuicaoGuard`. Login e cadastro ficam fora do layout.
