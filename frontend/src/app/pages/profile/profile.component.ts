import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({ selector: 'app-profile', templateUrl: './profile.component.html', styleUrl: './profile.component.css', imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush })
export class ProfileComponent {
  readonly authService = inject(AuthService);
  selectedFile: File | null = null; previewUrl = ''; error = ''; success = ''; uploading = false; avatarFailed = false;

  chooseFile(event: Event): void {
    const input = event.target as HTMLInputElement; const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { this.error = 'Escolha JPG, PNG ou WebP de ate 5 MB.'; return; }
    this.selectedFile = file; this.previewUrl = URL.createObjectURL(file); this.avatarFailed = false; this.error = ''; this.success = '';
  }

  upload(): void {
    if (!this.selectedFile) return;
    this.uploading = true; this.error = '';
    this.authService.uploadAvatar(this.selectedFile).subscribe({ next: () => { this.releasePreview(); this.selectedFile = null; this.success = 'Foto de perfil atualizada.'; this.uploading = false; }, error: response => { this.error = response.error?.message || 'Nao foi possivel enviar a foto.'; this.uploading = false; } });
  }

  avatarUrl(): string {
    const url = this.authService.avatarUrl(this.authService.user());
    return url ? `${url}&r=${this.authService.avatarRevision()}` : '';
  }

  onAvatarError(): void {
    this.avatarFailed = true;
  }

  private releasePreview(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = '';
    }
  }
}
