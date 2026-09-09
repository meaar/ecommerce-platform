import { Injectable, inject } from '@angular/core';
import { signal, computed } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly products = signal<Product[]>([
    {
      id: '1',
      name: 'Laptop Pro',
      price: 1299.99,
      description: 'High-performance laptop for professionals',
      image: 'https://via.placeholder.com/300x200?text=Laptop+Pro',
      category: 'Electronics',
      rating: 4.8,
      stock: 15
    },
    {
      id: '2',
      name: 'Wireless Headphones',
      price: 199.99,
      description: 'Premium noise-cancelling headphones',
      image: 'https://via.placeholder.com/300x200?text=Headphones',
      category: 'Electronics',
      rating: 4.6,
      stock: 42
    },
    {
      id: '3',
      name: 'Mechanical Keyboard',
      price: 149.99,
      description: 'RGB mechanical keyboard with custom switches',
      image: 'https://via.placeholder.com/300x200?text=Keyboard',
      category: 'Accessories',
      rating: 4.7,
      stock: 28
    },
    {
      id: '4',
      name: 'USB-C Cable',
      price: 19.99,
      description: 'High-speed USB-C charging and data cable',
      image: 'https://via.placeholder.com/300x200?text=USB+Cable',
      category: 'Cables',
      rating: 4.4,
      stock: 150
    },
    {
      id: '5',
      name: '4K Monitor',
      price: 599.99,
      description: '27-inch 4K ultra HD monitor',
      image: 'https://via.placeholder.com/300x200?text=Monitor',
      category: 'Electronics',
      rating: 4.9,
      stock: 8
    },
    {
      id: '6',
      name: 'Mouse Pad',
      price: 29.99,
      description: 'Large extended gaming mouse pad',
      image: 'https://via.placeholder.com/300x200?text=Mouse+Pad',
      category: 'Accessories',
      rating: 4.3,
      stock: 60
    }
  ]);

  private readonly cart = signal<CartItem[]>([]);

  readonly allProducts = this.products.asReadonly();
  readonly cartItems = this.cart.asReadonly();
  readonly cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );
  readonly cartItemCount = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cart().find(item => item.product.id === product.id);

    if (existingItem) {
      this.cart.update(items =>
        items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      this.cart.update(items => [...items, { product, quantity }]);
    }
  }

  removeFromCart(productId: string): void {
    this.cart.update(items => items.filter(item => item.product.id !== productId));
  }

  updateCartItemQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.cart.update(items =>
        items.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  }

  clearCart(): void {
    this.cart.set([]);
  }
}
