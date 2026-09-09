import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  protected readonly product = signal<Product | undefined>(undefined);
  protected readonly quantity = signal(1);
  protected readonly addedToCart = signal(false);

  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  constructor() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      const foundProduct = this.productService.getProductById(productId);
      this.product.set(foundProduct);
    });
  }

  incrementQuantity(): void {
    const product = this.product();
    if (product && this.quantity() < product.stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart(): void {
    const product = this.product();
    if (product) {
      this.productService.addToCart(product, this.quantity());
      this.addedToCart.set(true);
      setTimeout(() => this.addedToCart.set(false), 2000);
    }
  }
}
