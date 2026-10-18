# Frontend

Frontend da aplicação de e-commerce desenvolvido com Angular 22 e Nginx.

## Características

- Componentes standalone e Signals.
- Catálogo de produtos e detalhes.
- Carrinho com cálculo do total.
- Autenticação e gerenciamento de sessão.
- Perfil com upload de avatar.
- Checkout e visualização de pedidos.
- Layout responsivo e navegação acessível.

## Estrutura

```text
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── environments/
├── Dockerfile
├── Dockerfile.dev
├── nginx.conf
├── angular.json
└── package.json
```

## Configuração

- `src/environments/environment.ts`: configurações de desenvolvimento.
- `src/environments/environment.prod.ts`: configurações de produção.
- `Dockerfile`: build de produção com Nginx.
- `Dockerfile.dev`: execução com Angular CLI.
- `nginx.conf`: configuração do Nginx e proxy das requisições `/api`.

## Configuração da API

- **Desenvolvimento:** configure o endereço da API em `src/environments/environment.ts`. Por padrão, utiliza `http://localhost:3000/api`. Para acessar o backend em outra máquina, substitua `localhost` pelo IP correspondente.
- **Produção:** o Angular utiliza `/api` como endereço da API, e o Nginx encaminha as requisições para o backend, conforme configurado em `nginx.conf`.

## Scripts

```bash
npm start       # Inicia o servidor de desenvolvimento
npm run build   # Gera o build de produção
npm test        # Executa os testes
npm run lint    # Verifica o código
```

## Documentação

Consulte o [README geral](../README.md) para os pré-requisitos e as instruções de execução do projeto com Docker.