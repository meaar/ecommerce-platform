# Frontend

Frontend da aplicação de e-commerce desenvolvido com Angular 22 e Nginx.

## Execução

**Desenvolvimento local:**
```bash
npm install
npm start
```

**Docker — Desenvolvimento:**
```bash
docker compose up --build
```

**Docker — Produção:**
```bash
docker compose up --build -d
```

## Configuração

- `src/environments/environment.ts`: ambiente de desenvolvimento.
- `src/environments/environment.prod.ts`: ambiente de produção.

Em produção, o Nginx serve o frontend e encaminha as requisições `/api` para o backend.
