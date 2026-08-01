import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  private readonly productService = inject(ProductService);

  addToCart(): void {
    this.productService.addToCart(this.product(), 1);
  }
}
