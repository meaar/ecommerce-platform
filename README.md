# 🛍️ E-commerce Application - Angular 22 + Node 24

Uma aplicação e-commerce moderna e totalmente funcional, construída com **Angular 22** e **Node.js 24-slim** seguindo as melhores práticas atuais.

## 📋 Características

### ✨ Arquitetura Moderna
- **Componentes Standalone** - Sem necessidade de NgModules
- **Signals** - Gerenciamento de estado reativo e performático
- **Novo Control Flow** - Usando `@if`, `@for`, `@switch` em templates
- **Input Signal API** - Sem decoradores `@Input`/`@Output`
- **Change Detection OnPush** - Otimização de performance
- **Angular 22** - Última versão com melhorias de performance

### 🎨 Interface
- Catálogo de produtos responsivo
- Detalhes detalhados do produto
- Carrinho de compras funcional
- Header sticky com badge de itens no carrinho
- Notificações de sucesso

### ♿ Acessibilidade
- **WCAG AA Compliant** - Segue padrões WCAG 2.1 AA
- **ARIA Attributes** - Labels e roles semânticos
- **Keyboard Navigation** - Totalmente navegável por teclado
- **Screen Reader Friendly** - Compatível com leitores de tela

### 📱 Responsivo
- Mobile-first design
- Breakpoints para tablets e desktops
- Layouts adaptáveis

## 🚀 Começando

### Pré-requisitos
- Docker Desktop instalado e rodando
- Node.js 24-slim container no Docker Desktop

### Setup Rápido

Execute este comando PowerShell para copiar e rodar a aplicação no seu container Docker:

```powershell
$CONTAINER_NAME = "seu-container-aqui"
$PROJECT_PATH = "c:\Users\Me\Desktop\angular"

# 1. Copiar projeto para o container
docker cp "$PROJECT_PATH\." $CONTAINER_NAME`:/app

# 2. Instalar dependências e iniciar
docker exec -it $CONTAINER_NAME bash -c "cd /app && npm ci --legacy-peer-deps && npm start -- --host 0.0.0.0"
```

**Acesse:** http://localhost:4200

### Alternativa: Script Único

```powershell
# Substitua seu-container-aqui pelo nome do seu container Docker
docker cp "c:\Users\Me\Desktop\angular\." seu-container-aqui:/app && docker exec -it seu-container-aqui bash -c "cd /app && npm ci --legacy-peer-deps && npm start -- --host 0.0.0.0"
```

### Ver Containers Disponíveis

```powershell
docker ps --format "table {{.Names}}\t{{.Image}}"
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── product-card/    # Card do produto
│   │   └── cart-item/       # Item do carrinho
│   ├── pages/               # Componentes de páginas/rotas
│   │   ├── product-list/    # Lista de produtos
│   │   ├── product-detail/  # Detalhes do produto
│   │   └── cart/            # Página do carrinho
│   ├── services/            # Serviços da aplicação
│   │   └── product.service.ts  # Gerenciamento de estado e dados
│   ├── app.component.*      # Componente raiz
│   ├── app.routes.ts        # Configuração de rotas
│   └── app.config.ts        # Configuração da aplicação
├── main.ts                  # Bootstrap da aplicação
├── index.html              # HTML principal
└── styles.css              # Estilos globais
```

## 🎯 Componentes

### ProductService
Gerencia o estado da aplicação usando **Signals**:
- `allProducts` - Catálogo de produtos
- `cartItems` - Itens no carrinho
- `cartTotal` - Computed total do carrinho
- `cartItemCount` - Computed quantidade de itens

**Métodos:**
- `getProductById()` - Buscar produto por ID
- `addToCart()` - Adicionar ao carrinho
- `removeFromCart()` - Remover do carrinho
- `updateCartItemQuantity()` - Atualizar quantidade
- `clearCart()` - Limpar carrinho

### ProductListComponent
Exibe a lista de produtos em um grid responsivo.

### ProductCardComponent
Card do produto com:
- Imagem
- Nome e descrição
- Rating
- Preço
- Botão "Add to Cart"
- Badge de stock baixo

### ProductDetailComponent
Página de detalhes com:
- Imagem grande
- Descrição completa
- Seletor de quantidade
- Rating e avaliações
- Status de stock

### CartComponent
Carrinho de compras com:
- Tabela de itens
- Seletor de quantidade por item
- Resumo do pedido
- Total com impostos
- Botão de checkout

## 🎨 Estilos

- **Design System Consistente** - Cores, tipografia e espaçamento padronizados
- **Temas Hover/Focus** - Feedback visual para interações
- **Dark Header** - Header com tema escuro (#0a0e27)
- **Cores Primárias**: #0066cc (azul), #ff6b6b (vermelho), #27ae60 (verde)

## 🔄 Fluxo de Dados

```
ProductService (Signals)
    ↓
Componentes (recebem via input signals)
    ↓
Usuário interage
    ↓
Métodos do service atualizam signals
    ↓
UI re-renderiza automaticamente
```

## 📊 Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Lista de produtos |
| `/product/:id` | Detalhes do produto |
| `/cart` | Carrinho de compras |

## 🔐 Boas Práticas Implementadas

### Angular 22
✅ Componentes standalone sem módulos  
✅ Signals para estado reativo  
✅ Control flow nativo (@if, @for, @switch)  
✅ Input signal API  
✅ Lazy loading de rotas (pronto para expansão)  
✅ Tree-shaking otimizado  

### Node.js 24 & TypeScript 5.7
✅ Suporte a recursos JavaScript mais novos  
✅ TypeScript strict mode habilitado  
✅ Sem uso de `any` type  
✅ Type inference quando apropriado  
✅ Interfaces bem definidas  

### Acessibilidade
✅ WCAG AA compliant  
✅ ARIA labels e roles  
✅ Keyboard navigation  
✅ Screen reader friendly  
✅ Contraste de cores adequado  

### Performance
✅ OnPush change detection  
✅ Lazy loading de imagens  
✅ Computed signals para valores derivados  
✅ Minimal bundle size  
✅ Node 24 com otimizações nativas

## 🚀 Próximas Melhorias

- [ ] Integração com API real
- [ ] Autenticação de usuário
- [ ] Persistência de carrinho (localStorage)
- [ ] Filtros e busca de produtos
- [ ] Avaliações de produtos
- [ ] Sistema de pagamento
- [ ] Página de confirmação de pedido
- [ ] Dark mode

## 📝 Licença

Este projeto é fornecido como exemplo educacional.

## 👨‍💻 Desenvolvido com

- [Angular 22](https://angular.dev)
- [Node.js 24](https://nodejs.org)
- [TypeScript 5.7](https://www.typescriptlang.org)
- [CSS3](https://www.w3.org/Style/CSS/)
- [Docker](https://www.docker.com)

---

**Built with ❤️ using Angular 22 Signals, Node 24, and Docker**
