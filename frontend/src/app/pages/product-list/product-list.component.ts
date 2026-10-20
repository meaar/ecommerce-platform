import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  imports: [CommonModule, RouterLink, ProductCardComponent]
})
export class ProductListComponent {
  protected readonly productService = inject(ProductService);
  protected readonly currentSlide = signal(0);
  protected readonly departments = [
    { icon: '▣', name: 'Hardware', anchor: 'hardware' },
    { icon: '⌨', name: 'Periféricos', anchor: 'perifericos' },
    { icon: '▤', name: 'Monitores', anchor: 'monitores' },
    { icon: '◈', name: 'Componentes', anchor: 'mais-vendidos' },
    { icon: '⚡', name: 'Ofertas', anchor: 'ofertas' },
  ];

  protected readonly slides = [
    {
      eyebrow: 'Semana do setup',
      title: 'Seu próximo upgrade começa aqui',
      description: 'Performance, conforto e estilo para transformar sua estação.',
      action: 'Montar meu setup',
      accent: 'R$ 199,99',
      productId: '2',
    },
    {
      eyebrow: 'Ofertas imperdíveis',
      title: 'Tecnologia que acompanha seu ritmo',
      description: 'Encontre os equipamentos certos para trabalhar, criar e jogar.',
      action: 'Ver ofertas',
      accent: 'Até 30% OFF',
      productId: '5',
    },
    {
      eyebrow: 'Mais vendidos',
      title: 'Potência para fazer mais',
      description: 'Os favoritos da comunidade E-commerce em um só lugar.',
      action: 'Comprar agora',
      accent: 'Top da semana',
      productId: '1',
    },
  ];

  protected readonly bestSellers = computed(() => this.productService.allProducts().slice(0, 4));
  protected readonly deals = computed(() => this.productService.allProducts().slice(2, 6));

  nextSlide(): void {
    this.currentSlide.update(index => (index + 1) % this.slides.length);
  }

  previousSlide(): void {
    this.currentSlide.update(index => (index - 1 + this.slides.length) % this.slides.length);
  }

  selectSlide(index: number): void {
    this.currentSlide.set(index);
  }

  onHeroImageError(event: Event, fallback: string | undefined): void {
    const image = event.target;

    if (fallback && image instanceof HTMLImageElement && image.src !== fallback) {
      image.src = fallback;
    }
  }
}
