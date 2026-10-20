# Frontend

Frontend da aplicação de e-commerce desenvolvido com Angular 22 e Nginx.

## Características

- Componentes standalone e Signals.
- Catálogo de produtos e detalhes.
- Carrinho com cálculo do total.
- Autenticação e gerenciamento de sessão.
- Perfil com upload de avatar armazenado no bucket `profile-images`.
- Catálogo com imagens do bucket `product-images` e fallback para a URL original.
- Checkout e visualização de pedidos.
- Layout responsivo e navegação acessível.
- Modo claro/escuro com preferência persistida no navegador.

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

- **Desenvolvimento:** `src/environments/environment.ts` usa o mesmo hostname da
  página e a porta `3000`, permitindo acesso por outro dispositivo na rede local.
  Por exemplo, ao abrir `http://192.168.0.15:4200`, a API será acessada em
  `http://192.168.0.15:3000/api`.
- **Produção:** o Angular utiliza `/api` como endereço da API, e o Nginx encaminha as requisições para o backend, conforme configurado em `nginx.conf`.

## Tema e identidade visual

As cores da aplicação ficam centralizadas nos tokens CSS de
`src/styles.css`, dentro do seletor `:root`. Para personalizar a identidade
visual, altere os valores `--color-*` desse bloco. O bloco
`body.dark-mode` define os valores equivalentes para o modo escuro.

O tema pode ser alternado pelo botão no cabeçalho. A escolha é salva em
`localStorage` com a chave `ecommerce-theme`; na primeira visita, a preferência
de tema do sistema operacional é usada como padrão.

## Scripts

```bash
npm start       # Inicia o servidor de desenvolvimento
npm run build   # Gera o build de produção
npm test        # Executa os testes
npm run lint    # Verifica o código
```

## Documentação

Consulte o [README geral](../README.md) para os pré-requisitos e as instruções de execução do projeto com Docker.