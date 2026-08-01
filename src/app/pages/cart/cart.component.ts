import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  imports: [CommonModule, RouterLink, CartItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  protected readonly productService = inject(ProductService);

  onQuantityChanged(data: { productId: string; quantity: number }): void {
    this.productService.updateCartItemQuantity(data.productId, data.quantity);
  }

  onItemRemoved(productId: string): void {
    this.productService.removeFromCart(productId);
  }

  checkout(): void {
    alert('Checkout functionality would be implemented here!');
    this.productService.clearCart();
  }
}
