# 🛍️ E-commerce Application - Angular 22 + Node 24

Uma aplicacao de e-commerce dividida em frontend Angular e API Node.js, com catalogo de produtos, carrinho, autenticacao de usuarios, perfil com avatar e criacao de pedidos.

## 📋 Caracteristicas

### Arquitetura
- **Frontend Angular 22** com componentes standalone, Signals e novo control flow.
- **Backend Node.js 24 + Express 5** organizado em rotas, controllers, services e repositories.
- **PostgreSQL** para usuarios e sessoes persistentes.
- **RustFS** compativel com S3 para armazenamento de avatares.
- **Sessoes por cookie HttpOnly**, sem expor tokens ao JavaScript do navegador.

### Interface e funcionalidades
- Catalogo responsivo de produtos.
- Detalhes do produto com quantidade, avaliacao, preco e estoque.
- Carrinho com alteracao de quantidades e calculo do total.
- Cadastro, login, logout e restauracao de sessao.
- Perfil protegido com upload de avatar.
- Checkout protegido e criacao de pedidos.
- Paginas de pedidos e perfil acessiveis somente a usuarios autenticados.

### Acessibilidade e responsividade
- Navegacao por teclado, labels e roles semanticos.
- Layout mobile-first para celulares, tablets e desktops.
- Feedback visual para estados de hover, foco, carregamento e erro.

## 🚀 Comecando

### Pre-requisitos
- Node.js 24 ou superior.
- PostgreSQL 18 ou superior.
- RustFS em execucao para os uploads de avatar.
- Docker Desktop, caso use o ambiente conteinerizado.

### Desenvolvimento local

O backend espera PostgreSQL e RustFS disponiveis. Crie `backend/.env` a partir do exemplo e ajuste as conexoes:

```powershell
Copy-Item backend/.env.example backend/.env
```

Para executar a API:

```powershell
cd backend
npm install
npm run dev
```

Para executar o frontend em outro terminal:

```powershell
cd frontend
npm install
npm start
```

Acesse `http://localhost:4200`. A API fica em `http://localhost:3000` e o health check em `http://localhost:3000/api/health`.

O comando abaixo importa, uma unica vez, usuarios do arquivo legado `backend/data/users.json` para o PostgreSQL:

```powershell
cd backend
npm run migrate:users
```

## 🐳 Rodando com Docker

O `docker-compose.yml` inicia os containers do PostgreSQL, backend e frontend. O RustFS e um servico externo e precisa estar conectado a rede Docker `ecommerce-net`.

1. Crie a rede e conecte o container existente do RustFS:

```powershell
docker network create ecommerce-net
docker network connect ecommerce-net rustfs
```

Se a rede ou a conexao ja existirem, os avisos podem ser ignorados. O nome do container deve ser `rustfs` para que `RUSTFS_ENDPOINT=http://rustfs:9000` funcione.

2. Configure o ambiente do backend:

```powershell
Copy-Item backend/.env.example backend/.env
```

No arquivo `backend/.env`, mantenha `POSTGRES_HOST=postgres` e `RUSTFS_ENDPOINT=http://rustfs:9000`.

3. Construa e inicie os servicos:

```powershell
docker compose up --build -d
```

Abra `http://localhost:4200` no navegador. Para acompanhar os logs:

```powershell
docker compose logs -f backend frontend
```

Para parar os servicos:

```powershell
docker compose down
```

O volume `postgres-data-v18` preserva os dados do PostgreSQL quando os containers sao recriados.

## 🚀 Deploy

O deploy conteinerizado usa as mesmas imagens do desenvolvimento, mas executa o frontend compilado com Nginx e o backend em modo `production`.

### Preparar o servidor

Instale Docker com Compose e crie a rede externa usada pelos servicos:

```powershell
docker network create ecommerce-net
docker network connect ecommerce-net rustfs
```

O container do RustFS precisa estar em execucao e acessivel pelo nome `rustfs` na porta `9000`. Crie o arquivo de ambiente do backend sem versiona-lo:

```powershell
Copy-Item backend/.env.example backend/.env
```

Em producao, altere pelo menos `NODE_ENV`, `FRONTEND_ORIGIN`, `RUSTFS_ACCESS_KEY`, `RUSTFS_SECRET_KEY` e `POSTGRES_PASSWORD`. Use senhas e chaves reais fornecidas pelo ambiente ou por um secret manager.

### Publicar a versao

Dentro da raiz do projeto:

```powershell
docker compose up --build -d
docker compose ps
```

O frontend fica disponivel na porta `4200` e a API na porta `3000`. Em um servidor publico, coloque um proxy reverso com HTTPS na frente desses servicos e restrinja o acesso direto a porta da API quando possivel.

### Atualizar a aplicacao

Depois de enviar uma nova versao do codigo para o servidor:

```powershell
docker compose up --build -d
docker compose ps
```

O volume `postgres-data-v18` nao e removido por `docker compose down`, portanto os dados do PostgreSQL permanecem entre atualizacoes. Nao use `docker compose down -v` sem um backup, pois isso remove o volume do banco.

### Operacao e diagnostico

```powershell
docker compose logs -f backend
docker compose logs -f frontend
docker compose restart backend
curl http://localhost:3000/api/health
```

Antes de uma atualizacao importante, faça backup do PostgreSQL e mantenha as credenciais fora do repositorio. O RustFS tambem deve possuir sua propria estrategia de backup dos objetos armazenados.

O deploy atual nao configura dominio, HTTPS, firewall, monitoramento ou backup automatico. Esses itens devem ser fornecidos pela infraestrutura do ambiente de producao.

## 📁 Estrutura do projeto

```text
frontend/
  src/app/
    components/       # product-card e cart-item
    pages/             # catalogo, produto, carrinho, auth, perfil e pedidos
    services/          # produtos e autenticacao
backend/
  index.js             # inicializacao HTTP
  src/
    config/            # configuracao por variaveis de ambiente
    controllers/       # entrada e respostas HTTP
    middlewares/       # autenticacao, upload, rate limit e erros
    repositories/      # persistencia PostgreSQL
    routes/            # endpoints da API
    services/          # regras de negocio e RustFS
```

## 🎯 Componentes principais

### ProductService
Mantem o catalogo e o carrinho usando Signals:
- `allProducts`: produtos disponiveis.
- `cartItems`: itens do carrinho.
- `cartTotal`: total calculado do carrinho.
- `cartItemCount`: quantidade total de itens.

### AuthService
Gerencia cadastro, login, logout, restauracao da sessao e upload do avatar. A sessao e mantida pelo cookie seguro da API.

### Backend
O backend usa controllers para a camada HTTP, services para regras de negocio e repositories para o PostgreSQL. O `StorageService` encapsula a comunicacao S3 com o RustFS.

## 📊 Rotas

| Rota | Descricao |
|------|-----------|
| `/` | Catalogo de produtos |
| `/product/:id` | Detalhes do produto |
| `/cart` | Carrinho e checkout |
| `/login` | Login |
| `/register` | Cadastro |
| `/profile` | Perfil e avatar |
| `/orders` | Pedidos do usuario |

### Endpoints da API

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/api/health` | Verifica se a API esta funcionando |
| `POST` | `/api/auth/register` | Cria uma conta |
| `POST` | `/api/auth/login` | Inicia uma sessao |
| `GET` | `/api/auth/me` | Retorna o usuario autenticado |
| `POST` | `/api/auth/logout` | Encerra a sessao |
| `POST` | `/api/profile/avatar` | Envia o avatar do usuario autenticado |
| `GET` | `/api/profile/avatar/:userId` | Exibe um avatar |
| `POST` | `/api/orders` | Cria um pedido autenticado |

## 🔄 Fluxo de dados

```text
Usuario interage com o Angular
        ↓
Signals atualizam catalogo e carrinho
        ↓
AuthService envia requisicoes para a API
        ↓
Express valida autenticacao e executa services
        ↓
PostgreSQL persiste usuarios e sessoes; a API recebe pedidos e retorna um identificador
RustFS armazena os avatares
```

## 📦 Scripts

Frontend:

```powershell
npm start       # servidor de desenvolvimento
npm run build   # build de producao
npm test        # testes Angular
npm run lint    # verificacao de lint
```

Backend:

```powershell
npm start             # inicia a API
npm run dev           # inicia a API com Node watch
npm run migrate:users # importa usuarios do JSON legado
```

## 📚 Documentacao complementar

- [Documentacao geral](DOCUMENTATION.md)
- [Documentacao do backend](backend/README.md)
- [Documentacao do frontend](frontend/README.md)

## 📝 Licenca

Este projeto e fornecido como exemplo educacional.

## 👨‍💻 Desenvolvido com

- [Angular 22](https://angular.dev)
- [Node.js 24](https://nodejs.org)
- [Express 5](https://expressjs.com)
- [PostgreSQL](https://www.postgresql.org)
- [RustFS](https://rustfs.com)
- [Docker](https://www.docker.com)
