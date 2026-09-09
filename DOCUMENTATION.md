# Documentacao tecnica da aplicacao

Este arquivo registra as decisoes tecnicas e os limites atuais da plataforma. Para instalar, executar ou publicar o projeto, consulte o [README principal](README.md).

## Arquitetura

O projeto e dividido em dois aplicativos independentes:

- `frontend/`: aplicacao Angular 22 executada no navegador.
- `backend/`: API REST Node.js 24 com Express 5.

A infraestrutura conteinerizada usa:

- PostgreSQL 18 para usuarios e sessoes.
- RustFS para armazenamento de avatares via SDK S3.
- Nginx para servir o build estatico do frontend.
- Docker Compose para orquestrar PostgreSQL, backend e frontend.

O RustFS nao e criado pelo `docker-compose.yml`. Ele deve existir previamente e ser conectado a rede externa `ecommerce-net`.

## Backend

O ponto de entrada e `backend/index.js`. A composicao da aplicacao fica em `backend/src/app.js` e as dependencias compartilhadas sao criadas por `backend/src/container.js`.

Responsabilidades das camadas:

- `routes`: define os caminhos HTTP e associa middlewares aos controllers.
- `controllers`: interpreta requisicoes e monta respostas HTTP.
- `services`: concentra regras de negocio e integracoes externas.
- `repositories`: encapsula o acesso ao PostgreSQL.
- `middlewares`: autenticacao, upload, rate limit e tratamento de erros.
- `utils`: funcoes reutilizaveis sem estado.

Na inicializacao, o backend cria as tabelas `users` e `sessions` caso elas ainda nao existam. O `UserRepository` usa queries parametrizadas.

## Autenticacao e sessoes

O cadastro e o login criam uma sessao persistida no PostgreSQL. O identificador da sessao e enviado em cookie `HttpOnly`, com `SameSite=Lax` e validade de sete dias. O token nao fica disponivel para o JavaScript do frontend.

As rotas protegidas usam o middleware de autenticacao para validar o cookie e carregar o usuario atual. O frontend restaura a sessao com `GET /api/auth/me`.

## Upload de avatar

O fluxo de upload e:

```text
frontend -> POST /api/profile/avatar -> backend -> RustFS
```

O backend valida o arquivo recebido, grava o objeto no bucket configurado em `RUSTFS_BUCKET` e atualiza a referencia do avatar do usuario. As credenciais do RustFS ficam somente no ambiente do backend.

O endpoint `GET /api/profile/avatar/:userId` faz o streaming do objeto para o navegador. O arquivo original `backend/data/users.json` nao e lido pela aplicacao normal.

## Pedidos

A rota `POST /api/orders` exige autenticacao, valida se existem itens no carrinho e retorna um identificador de pedido e a quantidade de itens recebida. No estado atual, pedidos ainda nao possuem repository ou tabela propria no PostgreSQL; o `orderId` e gerado em memoria.

## Frontend

O frontend usa componentes standalone, Signals e o control flow nativo do Angular. O `ProductService` mantem o catalogo mockado e o carrinho em memoria. O `AuthService` concentra cadastro, login, logout, restauracao de sessao e upload de avatar.

As rotas protegidas sao `/cart`, `/profile` e `/orders`. Usuarios nao autenticados sao redirecionados para `/login`.

A URL da API e definida em `frontend/src/environments/environment.ts`. Para um ambiente publicado em outro dominio, essa URL precisa ser alterada antes do build do frontend.

## Variaveis de ambiente

O exemplo completo fica em `backend/.env.example`:

```text
PORT=3000
FRONTEND_ORIGIN=http://localhost:4200
NODE_ENV=development
RUSTFS_ENDPOINT=http://rustfs:9000
RUSTFS_REGION=sa-east-1
RUSTFS_ACCESS_KEY=...
RUSTFS_SECRET_KEY=...
RUSTFS_BUCKET=profile-images
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=ecommerce
POSTGRES_USER=ecommerce
POSTGRES_PASSWORD=...
```

Em desenvolvimento local, `POSTGRES_HOST` e `RUSTFS_ENDPOINT` normalmente apontam para `localhost`. Dentro do Compose, eles devem apontar para os nomes dos servicos e containers da rede Docker.

## Deploy

O deploy recomendado e feito pela raiz do projeto:

```powershell
docker network create ecommerce-net
docker network connect ecommerce-net rustfs
Copy-Item backend/.env.example backend/.env
docker compose up --build -d
```

O frontend e compilado na imagem `frontend` e servido por Nginx na porta `80`, publicada pelo Compose como `http://localhost:4200`. O backend roda em modo `production` na porta `3000`. O volume `postgres-data-v18` preserva o banco entre recriacoes dos containers.

Antes de publicar, altere as credenciais, configure `NODE_ENV=production`, ajuste `FRONTEND_ORIGIN` e mantenha `backend/.env` fora do Git. Dominio, HTTPS, firewall, monitoramento e backups automaticos nao sao configurados pelo Compose e pertencem a infraestrutura de producao.

## Migracao do JSON legado

O comando abaixo deve ser executado uma vez, com o PostgreSQL disponivel:

```powershell
cd backend
npm run migrate:users
```

A migracao importa `backend/data/users.json`. Depois da migracao, a API utiliza o PostgreSQL normalmente e nao altera o arquivo JSON.
