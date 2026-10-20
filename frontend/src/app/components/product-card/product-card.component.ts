import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  imports: [CommonModule, RouterLink]
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  private readonly productService = inject(ProductService);

  addToCart(): void {
    this.productService.addToCart(this.product(), 1);
  }

  onImageError(event: Event): void {
    const fallback = this.product().imageFallback;
    const image = event.target;

    if (fallback && image instanceof HTMLImageElement && image.src !== fallback) {
      image.src = fallback;
    }
  }
}
