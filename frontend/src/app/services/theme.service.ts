import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'ecommerce-theme';
  private readonly document: Document;
  private readonly browser: boolean;
  readonly isDarkMode = signal(false);

  constructor(@Inject(DOCUMENT) document: Document, @Inject(PLATFORM_ID) platformId: object) {
    this.document = document;
    this.browser = isPlatformBrowser(platformId);

    const savedTheme = this.browser ? localStorage.getItem(this.storageKey) : null;
    const prefersDark = this.browser && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    this.setDarkMode(savedTheme ? savedTheme === 'dark' : prefersDark, false);
  }

  toggle(): void {
    this.setDarkMode(!this.isDarkMode());
  }

  private setDarkMode(enabled: boolean, persist = true): void {
    this.isDarkMode.set(enabled);
    this.document.body.classList.toggle('dark-mode', enabled);

    if (persist && this.browser) {
      localStorage.setItem(this.storageKey, enabled ? 'dark' : 'light');
    }
  }
}
