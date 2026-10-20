# Documentacao tecnica

Este documento descreve a arquitetura, o banco de dados e os fluxos principais da
aplicacao. As instrucoes de instalacao e execucao ficam no [README principal](README.md).

## Arquitetura

O projeto possui dois aplicativos:

- `frontend/`: aplicacao Angular 22.
- `backend/`: API REST com Node.js 24 e Express 5.

Servicos utilizados:

- PostgreSQL 18: usuarios, sessoes e produtos.
- RustFS: armazenamento dos avatares, compativel com S3.
- Nginx: servidor do frontend em producao e proxy da API.
- Docker Compose: orquestracao dos servicos.

O RustFS precisa existir previamente e estar conectado a rede externa
`ecommerce-net`. Ele nao e criado pelos arquivos Compose deste projeto.

## Backend

O backend inicia em `backend/index.js`. A aplicacao e montada em
`backend/src/app.js` e as dependencias sao registradas em
`backend/src/container.js`.

Camadas:

- `routes`: caminhos HTTP e middlewares.
- `controllers`: entrada e saida das requisicoes.
- `services`: regras de negocio.
- `repositories`: acesso ao PostgreSQL.
- `middlewares`: autenticacao, upload, limite de requisicoes e erros.

As tabelas necessarias sao criadas automaticamente na inicializacao. As consultas ao
banco usam parametros para evitar concatenacao de dados recebidos pela API.

## Banco de dados

O PostgreSQL e executado pelo servico `postgres`. O volume `postgres-data-v18`
preserva os dados quando os containers sao recriados.

### Tabela `users`

Armazena as contas:

- `id`: UUID do usuario.
- `name`: nome.
- `email`: email unico.
- `password_hash`: hash da senha; a senha original nao e armazenada.
- `avatar_key`: referencia do avatar no RustFS.
- `created_at`: data de cadastro.

### Tabela `sessions`

Armazena as sessoes de autenticacao:

- `id`: identificador da sessao.
- `user_id`: referencia para `users.id`.
- `token_hash`: hash do token do cookie.
- `expires_at`: validade da sessao.
- `created_at`: data de criacao.

O token original fica em um cookie `HttpOnly`; apenas seu hash e salvo no banco.
As sessoes sao removidas quando o usuario relacionado e excluido.

### Tabela `products`

Armazena o catalogo:

- `id`: identificador.
- `name`: nome.
- `price`: preco.
- `description`: descricao.
- `image`: URL da imagem.
- `category`: categoria.
- `rating`: avaliacao entre 0 e 5.
- `stock`: quantidade disponivel.

Na primeira inicializacao, o `ProductRepository` insere os produtos de exemplo que ainda
nao existem. Registros ja existentes nao sao sobrescritos.

### Dados que ainda nao sao persistidos

O carrinho fica em memoria no frontend e e perdido ao atualizar ou fechar a pagina.

Pedidos ainda nao possuem as tabelas `orders` e `order_items`. Atualmente
`POST /api/orders` valida o carrinho e gera um identificador em memoria, mas nao grava
historico, nao baixa estoque e nao salva o valor final da compra.

## API

Principais endpoints:

| Metodo | Rota | Autenticacao | Funcao |
|---|---|---|---|
| `GET` | `/api/health` | Nao | Verifica a API |
| `POST` | `/api/auth/register` | Nao | Cria uma conta |
| `POST` | `/api/auth/login` | Nao | Inicia uma sessao |
| `GET` | `/api/auth/me` | Sim | Retorna o usuario atual |
| `POST` | `/api/auth/logout` | Nao | Encerra a sessao |
| `GET` | `/api/products` | Nao | Lista os produtos |
| `GET` | `/api/products/:id` | Nao | Retorna um produto |
| `POST` | `/api/profile/avatar` | Sim | Envia um avatar |
| `GET` | `/api/profile/avatar/:userId` | Nao | Exibe um avatar |
| `POST` | `/api/orders` | Sim | Recebe o carrinho atual |

O catalogo segue este fluxo:

```text
Angular ProductService
        |
        v
GET /api/products
        |
        v
ProductController
        |
        v
ProductRepository
        |
        v
PostgreSQL
```

## Autenticacao

Cadastro e login criam uma sessao no PostgreSQL. O identificador da sessao e enviado
em cookie `HttpOnly`, com `SameSite=Lax` e validade de sete dias.

As rotas protegidas validam o cookie antes de executar a operacao. O frontend restaura
a sessao usando `GET /api/auth/me`.

## Frontend

O frontend usa componentes standalone, Signals e o control flow do Angular.

Responsabilidades principais:

- `ProductService`: catalogo pela API e carrinho em memoria.
- `AuthService`: cadastro, login, logout, sessao e avatar.
- `ProductListComponent`: pagina inicial, banners, departamentos e produtos.
- `ProductDetailComponent`: detalhes e adicao ao carrinho.

As rotas protegidas sao `/cart`, `/profile` e `/orders`. Usuarios nao autenticados
sao encaminhados para `/login`.

Em desenvolvimento, o frontend usa o mesmo hostname pelo qual foi acessado e a porta
`3000` para encontrar a API. Assim, o acesso pela rede local funciona, por exemplo:

```text
Frontend: http://192.168.0.15:4200
API:      http://192.168.0.15:3000/api
```

Em producao, o frontend usa `/api` e o Nginx encaminha as requisicoes para o backend.

## Variaveis de ambiente

Copie o arquivo de exemplo antes de iniciar o projeto:

```powershell
Copy-Item backend/.env.example backend/.env
```

Variaveis principais:

```text
PORT=3000
FRONTEND_ORIGIN=http://localhost:4200
NODE_ENV=development
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=ecommerce
POSTGRES_USER=ecommerce
POSTGRES_PASSWORD=...
RUSTFS_ENDPOINT=http://rustfs:9000
RUSTFS_REGION=sa-east-1
RUSTFS_ACCESS_KEY=...
RUSTFS_SECRET_KEY=...
RUSTFS_BUCKET=profile-images
```

Dentro do Docker, use os nomes dos servicos, como `postgres` e `rustfs`. Fora do Docker,
normalmente use `localhost`.

Nunca versione `backend/.env` nem credenciais reais.

## Avatar e RustFS

O upload segue o fluxo:

```text
Frontend -> POST /api/profile/avatar -> Backend -> RustFS
```

O backend valida o arquivo, envia o objeto ao bucket configurado e salva apenas sua
referencia em `users.avatar_key`.

## Migracao de usuarios antigos

Para importar os usuarios de `backend/data/users.json`, com o PostgreSQL disponivel,
execute uma vez:

```powershell
cd backend
npm run migrate:users
```

Depois da migracao, a aplicacao utiliza o PostgreSQL normalmente e nao le o arquivo JSON.
