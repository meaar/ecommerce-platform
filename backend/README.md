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
    repositories/           # acesso aos dados de usuarios, sessoes e produtos
    routes/                 # mapeamento dos endpoints
    services/               # regras de negocio e integracao com RustFS
    utils/                  # funcoes reutilizaveis sem estado
```

## Responsabilidades

- `routes` conhece os caminhos HTTP e conecta middleware aos controllers.
- `controllers` valida a entrada HTTP e monta respostas.
- `services` concentra regras de negocio.
- `repositories` abstrai a persistencia.
- `StorageService` encapsula o SDK S3 usado para falar com RustFS e pode trabalhar com
  mais de um bucket.
- `container.js` cria uma instancia compartilhada das dependencias.
- `UserRepository` usa PostgreSQL com queries parametrizadas.
- `ProductRepository` persiste o catalogo e a chave da imagem opcional do produto.

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
RUSTFS_PROFILE_BUCKET=profile-images
RUSTFS_PRODUCT_BUCKET=product-images
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=ecommerce
POSTGRES_USER=ecommerce
POSTGRES_PASSWORD=...
```

O backend cria as tabelas `users`, `sessions` e `products` na inicializacao. O bucket
`profile-images` recebe avatares e `product-images` recebe imagens de produtos. As
chaves usam `<id>/<uuid>.<extensao>` dentro do bucket correspondente.

A sessao fica em cookie `HttpOnly`, `SameSite=Lax`, com validade de sete dias; o
navegador nao recebe nem armazena o token em JavaScript. O volume `postgres-data-v18`
preserva os dados quando os containers sao recriados. As credenciais do PostgreSQL e
do RustFS devem ser fornecidas pelo ambiente ou por um secret manager, nunca pelo
frontend ou pelo repositorio.

Uploads:

- `POST /api/profile/avatar`: envia o campo multipart `avatar` para `profile-images`.
- `POST /api/products/:id/image`: envia o campo multipart `image` para `product-images`.

Para enviar imagens em lote, coloque os arquivos em uma pasta usando o ID do produto
no nome do arquivo (`2.jpg`, `5.png`, `10.webp`).

Com Node.js, a partir da raiz do projeto:

```bash
node backend/scripts/upload-product-images.js \
  --email "admin@example.com" \
  --password "sua-senha" \
  --images "./product-images"
```

Ou, a partir do diretório `backend`:

```bash
npm run upload:product-images -- \
  --email "admin@example.com" \
  --password "sua-senha" \
  --images "../product-images"
```

O script faz login na API, mantém o cookie da sessão e envia cada imagem para
`POST /api/products/:id/image`. Para outra URL de API, use `--api-url`.

Com Docker, mantenha a API em execução e execute na raiz do projeto:

```powershell
docker run --rm `
  -v "${PWD}\backend\scripts:/app/scripts:ro" `
  -v "${PWD}\product-images:/app/product-images:ro" `
  node:24-slim `
  node /app/scripts/upload-product-images.js `
  --email "admin@example.com" `
  --password "sua-senha" `
  --images "/app/product-images" `
  --api-url "http://host.docker.internal:3000/api"
```

O `host.docker.internal` permite que o container temporario acesse a API publicada
na porta `3000` pelo Docker Compose. O script usa a API, e o backend envia os
arquivos para o bucket `product-images` usando as credenciais do RustFS.

`npm run migrate:users` e um comando de uso unico para importar o antigo `data/users.json`. A API normal nao le nem grava esse arquivo.
