# Frontend

Frontend da aplicação de e-commerce desenvolvido com Angular 22 e Nginx.

## Execução

**Desenvolvimento local**
```bash
npm install
npm start
```

**Docker — Desenvolvimento**

Na raiz do projeto:
```bash
docker compose -f docker-compose.yml -f compose.dev.yml up --build
```

**Docker — Produção**

Na raiz do projeto:
```bash
docker compose up --build -d
```

## Configuração

- `src/environments/environment.ts`: configurações de desenvolvimento.
- `src/environments/environment.prod.ts`: configurações de produção.
- `Dockerfile`: build de produção com Nginx.
- `Dockerfile.dev`: execução em desenvolvimento.
- `compose.dev.yaml`: configuração Docker de desenvolvimento.

Em produção, o Nginx serve o frontend e encaminha as requisições `/api` para o backend.
