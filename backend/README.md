# Backend

API REST executada com Node.js 24 e Express 5.

## Estrutura

```text
backend/
  index.js                 # ponto de entrada e inicializacao HTTP
  src/
    app.js                 # composicao do Express e middlewares globais
    container.js            # injecao das dependencias da aplicacao
    config/                 # configuracao derivada de process.env
    controllers/            # camada HTTP: request, response e status codes
    middlewares/            # autenticacao, upload e erros
    repositories/           # acesso aos dados de usuarios
    routes/                 # mapeamento dos endpoints
    services/               # regras de negocio e integracao com RustFS
    utils/                  # funcoes reutilizaveis sem estado
```

## Responsabilidades

- `routes` conhece os caminhos HTTP e conecta middleware aos controllers.
- `controllers` valida a entrada HTTP e monta respostas.
- `services` concentra regras de negocio.
- `repositories` abstrai a persistencia.
- `StorageService` encapsula o SDK S3 usado para falar com RustFS.
- `container.js` cria uma instancia compartilhada das dependencias.
- `UserRepository` usa PostgreSQL com queries parametrizadas.

## Desenvolvimento

```powershell
npm start
npm run dev
npm run migrate:users
```

Variaveis necessarias quando RustFS roda em outro container:

```text
PORT=3000
FRONTEND_ORIGIN=http://localhost:4200
NODE_ENV=development
RUSTFS_ENDPOINT=http://rustfs:9000
RUSTFS_REGION=us-east-1
RUSTFS_ACCESS_KEY=...
RUSTFS_SECRET_KEY=...
RUSTFS_BUCKET=profile-images
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=ecommerce
POSTGRES_USER=ecommerce
POSTGRES_PASSWORD=...
```

O backend cria as tabelas `users` e `sessions` na inicializacao. A sessao fica em cookie `HttpOnly`, `SameSite=Lax`, com validade de sete dias; o navegador nao recebe nem armazena o token em JavaScript. O volume `postgres-data-v18` preserva os dados quando os containers sao recriados. As credenciais do PostgreSQL e do RustFS devem ser fornecidas pelo ambiente ou por um secret manager, nunca pelo frontend ou pelo repositorio.

`npm run migrate:users` e um comando de uso unico para importar o antigo `data/users.json`. A API normal nao le nem grava esse arquivo.
