# E-commerce Platform

Plataforma de e-commerce desenvolvida com Angular e Node.js, com funcionalidades de autenticação, catálogo de produtos, carrinho de compras e gerenciamento de pedidos.

## Funcionalidades

- Catálogo de produtos e visualização de detalhes.
- Carrinho de compras com cálculo automático do total.
- Cadastro, autenticação e gerenciamento de sessões.
- Perfil de usuário com upload de avatar.
- Checkout e histórico de pedidos.
- Interface responsiva.

## Tecnologias

| Componente | Tecnologia |
|---|---|
| Frontend | [Angular 22](https://angular.dev/) |
| Backend | [Node.js 24](https://nodejs.org/) e [Express 5](https://expressjs.com/) |
| Banco de dados | [PostgreSQL 18](https://www.postgresql.org/) |
| Armazenamento de arquivos | [RustFS](https://rustfs.com/) — compatível com S3 |
| Servidor web | [Nginx](https://nginx.org/) |
| Contêineres | [Docker Compose](https://docs.docker.com/compose/) |

## Execução

### Pré-requisitos

- Docker e Docker Compose.
- Serviço RustFS configurado e conectado à rede Docker do projeto.

### Configuração

Crie o arquivo de variáveis de ambiente do backend:

```powershell
Copy-Item backend/.env.example backend/.env
```

Configure as variáveis necessárias para o banco de dados, o RustFS e a aplicação.

O backend usa buckets separados no RustFS:

```text
RUSTFS_PROFILE_BUCKET=profile-images
RUSTFS_PRODUCT_BUCKET=product-images
```

O bucket `profile-images` armazena avatares e o bucket `product-images` armazena
imagens do catálogo. Crie os dois buckets no RustFS antes de usar os uploads.

### Desenvolvimento

Na raiz do projeto, execute:

```bash
docker compose -f docker-compose.yml -f compose.dev.yml up --build
```

### Produção

Configure as variáveis de ambiente para produção e execute:

```bash
docker compose up --build -d
```

### Gerenciamento dos containers

Consultar o estado dos serviços:

```bash
docker compose ps
```

Acompanhar os logs:

```bash
docker compose logs -f backend frontend
```

Parar os serviços:

```bash
docker compose down
```

## Endpoints da API

As rotas principais estão documentadas na [documentação técnica](DOCUMENTATION.md).

## Estrutura do projeto

```text
ecommerce-platform/
├── frontend/
│   ├── src/                 # Código-fonte da aplicação Angular
│   ├── Dockerfile           # Build de produção com Nginx
│   ├── Dockerfile.dev       # Ambiente de desenvolvimento
│   └── nginx.conf           # Configuração do servidor web e proxy
│
├── backend/
│   ├── src/                 # Módulos da API e regras de negócio
│   ├── scripts/             # Scripts auxiliares e migrações
│   ├── Dockerfile           # Imagem de produção da API
│   └── Dockerfile.dev       # Ambiente de desenvolvimento
│
├── docker-compose.yml       # Definição dos serviços principais
├── compose.dev.yml          # Sobrescritas para desenvolvimento
├── DOCUMENTATION.md         # Documentação técnica complementar
└── README.md                # Apresentação e instruções do projeto
```

## Documentação complementar

- [Frontend](frontend/README.md)
- [Backend](backend/README.md)
- [Documentação técnica](DOCUMENTATION.md)

## Licença

Projeto educacional.