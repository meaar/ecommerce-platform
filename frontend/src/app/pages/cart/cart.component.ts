import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  imports: [CommonModule, RouterLink, CartItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  protected readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  checkoutError = '';
  checkoutSuccess = '';

  onQuantityChanged(data: { productId: string; quantity: number }): void {
    this.productService.updateCartItemQuantity(data.productId, data.quantity);
  }

  onItemRemoved(productId: string): void {
    this.productService.removeFromCart(productId);
  }

  checkout(): void {
    this.checkoutError = '';
    this.http.post<{ orderId: string }>(`${environment.apiUrl}/orders`, { items: this.productService.cartItems().map(item => ({ productId: item.product.id, quantity: item.quantity })) }).subscribe({
      next: response => { this.checkoutSuccess = `Pedido ${response.orderId.slice(0, 8)} recebido com sucesso.`; this.productService.clearCart(); },
      error: response => { this.checkoutError = response.error?.message || 'Nao foi possivel concluir o pedido.'; }
    });
  }
}
