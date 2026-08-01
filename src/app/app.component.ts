import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterLink, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  protected readonly productService = inject(ProductService);
  protected readonly title = 'E-commerce Store';
  protected readonly routerLinkActiveOptions = { exact: true };
}
