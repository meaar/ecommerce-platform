import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private readonly http = inject(HttpClient);
  private readonly products = signal<Product[]>([]);
  private readonly cart = signal<CartItem[]>([]);

  readonly allProducts = this.products.asReadonly();
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly cartItems = this.cart.asReadonly();
  readonly cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );
  readonly cartItemCount = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.http.get<Product[]>(`${environment.apiUrl}/products`).pipe(
      catchError(error => {
        console.error('Unable to load products:', error);
        this.loading.set(false);
        this.loadError.set('Nao foi possivel carregar os produtos.');
        return of([]);
      }),
    ).subscribe(products => {
      this.products.set(products);
      this.loading.set(false);
    });
  }

  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  getProductByIdFromApi(id: string): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${encodeURIComponent(id)}`);
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
