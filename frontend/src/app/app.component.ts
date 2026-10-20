import { Component, effect, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterLink, RouterOutlet]
})
export class AppComponent {
  protected readonly productService = inject(ProductService);
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly title = 'E-commerce';
  protected readonly routerLinkActiveOptions = { exact: true };
  protected accountMenuOpen = false;
  protected departmentsMenuOpen = false;
  protected departmentsMenuHovering = false;
  protected departmentsMenuDismissed = false;
  protected activeDepartment = 0;
  protected accountMenuHovering = false;
  protected accountMenuDismissed = false;
  protected avatarFailed = false;
  private lastUserId: string | null = null;

  constructor() {
    effect(() => {
      const userId = this.authService.user()?.id ?? null;

      if (userId === this.lastUserId) {
        return;
      }

      this.lastUserId = userId;
      this.accountMenuOpen = false;
      this.accountMenuHovering = false;
      this.accountMenuDismissed = false;
      this.avatarFailed = false;
    });
  }

  toggleAccountMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.accountMenuOpen = !this.accountMenuOpen;
    this.accountMenuDismissed = !this.accountMenuOpen;
  }

  protected readonly departmentCategories = [
    {
      name: 'Hardware',
      icon: '▣',
      anchor: 'hardware',
      groups: [
        { name: 'Processadores', anchor: 'hardware', items: ['AMD Ryzen', 'Intel Core', 'Processadores para servidor'] },
        { name: 'Placas de vídeo', anchor: 'hardware', items: ['NVIDIA GeForce', 'AMD Radeon', 'Placas para jogos'] },
        { name: 'Placas-mãe', anchor: 'hardware', items: ['ASUS', 'Gigabyte', 'MSI'] },
        { name: 'Memórias', anchor: 'hardware', items: ['DDR4', 'DDR5', 'Memória para notebook'] },
        { name: 'Armazenamento', anchor: 'hardware', items: ['SSD NVMe', 'SSD SATA', 'HD'] },
        { name: 'Fontes e gabinetes', anchor: 'hardware', items: ['Fontes', 'Gabinetes', 'Coolers'] },
      ],
    },
    {
      name: 'Periféricos',
      icon: '⌨',
      anchor: 'perifericos',
      groups: [
        { name: 'Teclados', anchor: 'perifericos', items: ['Mecânicos', 'Membrana', 'Sem fio'] },
        { name: 'Mouses', anchor: 'perifericos', items: ['Gamer', 'Ergonômicos', 'Sem fio'] },
        { name: 'Headsets', anchor: 'perifericos', items: ['Com fio', 'Wireless', 'Acessórios'] },
        { name: 'Acessórios', anchor: 'perifericos', items: ['Mouse pads', 'Webcams', 'Microfones'] },
      ],
    },
    {
      name: 'Monitores',
      icon: '▤',
      anchor: 'monitores',
      groups: [
        { name: 'Por resolução', anchor: 'monitores', items: ['Full HD', 'Quad HD', '4K'] },
        { name: 'Por uso', anchor: 'monitores', items: ['Gamer', 'Ultrawide', 'Profissional'] },
        { name: 'Marcas', anchor: 'monitores', items: ['AOC', 'LG', 'Samsung'] },
      ],
    },
    {
      name: 'Computadores',
      icon: '▧',
      anchor: 'todos-produtos',
      groups: [
        { name: 'Notebooks', anchor: 'todos-produtos', items: ['Para estudo', 'Para trabalho', 'Gamer'] },
        { name: 'Desktops', anchor: 'todos-produtos', items: ['PC Gamer', 'Workstation', 'Home office'] },
        { name: 'Acessórios', anchor: 'todos-produtos', items: ['Suportes', 'Dock stations', 'Cabos'] },
      ],
    },
    {
      name: 'Ofertas',
      icon: '⚡',
      anchor: 'ofertas',
      groups: [
        { name: 'Ofertas do dia', anchor: 'ofertas', items: ['Mais vendidos', 'Preço baixo', 'Últimas unidades'] },
        { name: 'Kits e combos', anchor: 'ofertas', items: ['Setup completo', 'Kit gamer', 'Monte seu PC'] },
      ],
    },
  ];

  toggleDepartmentsMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.departmentsMenuOpen = !this.departmentsMenuOpen;
    this.departmentsMenuDismissed = !this.departmentsMenuOpen;
  }

  onDepartmentsMenuEnter(): void {
    this.departmentsMenuHovering = true;
  }

  onDepartmentsMenuLeave(): void {
    this.departmentsMenuHovering = false;
    this.departmentsMenuDismissed = false;
  }

  selectDepartment(index: number): void {
    this.activeDepartment = index;
  }

  closeDepartmentsMenu(): void {
    this.departmentsMenuOpen = false;
    this.departmentsMenuDismissed = this.departmentsMenuHovering;
  }

  onAccountMenuEnter(): void {
    this.accountMenuHovering = true;
  }

  onAccountMenuLeave(): void {
    this.accountMenuHovering = false;
    this.accountMenuDismissed = false;
  }

  onAvatarError(): void {
    this.avatarFailed = true;
  }

  closeAccountMenu(): void {
    this.accountMenuOpen = false;
    this.accountMenuDismissed = this.accountMenuHovering;
  }

  logout(): void {
    this.closeAccountMenu();
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;

    if (target instanceof Element && !target.closest('.account-menu')) {
      this.closeAccountMenu();
    }

    if (target instanceof Element && !target.closest('.departments-menu')) {
      this.closeDepartmentsMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeAccountMenu();
    this.closeDepartmentsMenu();
  }
}
