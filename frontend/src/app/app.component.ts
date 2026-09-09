import { ChangeDetectionStrategy, Component, effect, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterLink, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  protected readonly productService = inject(ProductService);
  protected readonly authService = inject(AuthService);
  protected readonly title = 'E-commerce Store';
  protected readonly routerLinkActiveOptions = { exact: true };
  protected accountMenuOpen = false;
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
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeAccountMenu();
  }
}
