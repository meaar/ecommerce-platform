import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { CartItem } from '../../services/product.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
  imports: [CommonModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemComponent {
  readonly item = input.required<CartItem>();
  readonly quantityChanged = output<{ productId: string; quantity: number }>();
  readonly removed = output<string>();

  updateQuantity(newQuantity: number): void {
    if (newQuantity > 0) {
      this.quantityChanged.emit({
        productId: this.item().product.id,
        quantity: newQuantity
      });
    }
  }

  remove(): void {
    this.removed.emit(this.item().product.id);
  }

  decrementQuantity(): void {
    this.updateQuantity(this.item().quantity - 1);
  }

  incrementQuantity(): void {
    this.updateQuantity(this.item().quantity + 1);
  }
}
