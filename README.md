# CRM — Frontend

Interface web do CRM: carteira de clientes, funil de vendas, distribuição de leads entre
vendedores e central de conversas. Construída em **Angular 19** com **MDB Angular** e
**SweetAlert2**, espelhando o contrato da API do projeto.

O frontend **não depende do backend estar no ar**: as services usam `HttpClient` normalmente e um
interceptor responde às mesmas rotas com dados em memória. Trocar para a API real é uma linha de
configuração.

## Stack

| Recurso | Versão |
|---|---|
| Angular | 19.2 |
| MDB Angular UI Kit | 8.0 |
| SweetAlert2 | 11 |
| TypeScript | 5.7 (modo estrito) |

## Como executar

```bash
npm install
```

```bash
npm start
```

A aplicação sobe em <http://localhost:4200>.

## Acessos de demonstração

Todos usam a senha **`123456`**. A tela de login traz atalhos para preencher cada perfil.

| Perfil | E-mail | O que enxerga |
|---|---|---|
| Administrador | `admin@crm.com` | Tudo, incluindo gestão de equipe |
| Gerente | `marcos.teixeira@crm.com` | Tudo, incluindo distribuição de carteira |
| Vendedora | `ana.moraes@crm.com` | Apenas a própria carteira e as próprias conversas |

## Telas

- **Login** — autenticação com validação e feedback de erro.
- **Clientes** — listagem paginada com busca por nome ou e-mail, filtro por etapa do funil, por
  vendedor e opção de incluir inativos. Ações por linha: ficha completa, mover no funil,
  reatribuir, editar e excluir.
- **Cadastro / edição de cliente** — formulário com todos os campos da entidade.
- **Conversas** — fila de atendimento com não lidas, status e responsável. O vendedor vê apenas a
  própria fila; a gestão vê a operação inteira e pode filtrar por vendedor.
- **Atendimento (chat)** — histórico de mensagens com direção, tipo, status de entrega e autor,
  além do envio de novas mensagens.
- **Equipe** — gestão de usuários com perfis de acesso, ativação/desativação e exclusão.

## Arquitetura

```
src/app/
├── core/
│   ├── guards/          proteção de rota por autenticação e por papel
│   ├── interceptors/    mock da API e tratamento global de erros HTTP
│   ├── mock/            banco em memória que reproduz o comportamento do backend
│   ├── models/          interfaces e enums espelhando as entidades e DTOs da API
│   ├── services/        uma service por controller do backend
│   └── utils/           normalização de erro HTTP
├── shared/components/   cabeçalho, paginação, estado vazio e carregamento
├── layout/              navbar, menu lateral e a casca da área interna
└── pages/               login, clientes, conversas e equipe
```

### Services

Cada service conversa com **um único controller**, sem acoplamento cruzado:

| Service | Endpoint | Operações |
|---|---|---|
| `ClienteService` | `/api/clientes` | GET, POST, PUT, PATCH (funil e reatribuição), DELETE |
| `UsuarioService` | `/api/usuarios` | GET, POST, PUT, PATCH (status), DELETE |
| `ConversaService` | `/api/conversas` | GET (lista paginada e por id) |
| `MensagemService` | `/api/mensagens` | GET por conversa, POST de envio |

`AuthService` cuida apenas da sessão, e `NotificacaoService` concentra o feedback visual com
SweetAlert2.

### Tratamento de erros

Todas as chamadas passam por `tratarErro`, que converte qualquer falha para o mesmo formato do
`GlobalExceptionHandler` da API (`status`, `erro`, `mensagem`, `caminho`, `detalhes`). O
`errorInterceptor` registra a falha e avisa o usuário quando o problema é de rede ou interno; erros
de validação (400) e de regra de negócio (409) chegam às telas, que os exibem no contexto certo.

### Roteamento

Rotas filhas em dois níveis: a rota raiz carrega o layout sob o `authGuard` e declara um bloco
`children`; dentro dele, `clientes`, `conversas` e `equipe` trazem seus próprios arquivos de rotas
via `loadChildren`. A área de equipe ainda passa pelo `distribuicaoGuard`, restrito a administrador
e gerente.

## Sobre o modo mockado

O `mockApiInterceptor` intercepta as chamadas para `/api` e as responde com o
`BancoEmMemoriaService`, que reproduz filtros, paginação, validações, regras de negócio e os
códigos de status da API — inclusive a abertura automática de conversa ao cadastrar um cliente e o
registro do histórico de atribuições.

Como o estado vive em memória, ele volta aos dados iniciais a cada recarga da página.

Para apontar para o backend real, basta editar `src/environments/environment.ts`:

```ts
usarApiMockada: false
```

Nenhuma service, componente ou rota precisa ser alterada.
