import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({ selector: 'app-auth', templateUrl: './auth.component.html', styleUrl: './auth.component.css', imports: [CommonModule, ReactiveFormsModule, RouterLink], changeDetection: ChangeDetectionStrategy.OnPush })
export class AuthComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly isRegister = this.route.snapshot.data['mode'] === 'register';
  readonly form = this.formBuilder.nonNullable.group({ name: [''], email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(8)]] });
  error = ''; loading = false;

  submit(): void {
    if (this.form.invalid || (this.isRegister && !this.form.controls.name.value.trim())) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    const { name, email, password } = this.form.getRawValue();
    const request = this.isRegister ? this.authService.register(name, email, password) : this.authService.login(email, password);
    request.subscribe({ next: () => this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') || '/'), error: response => { this.error = response.error?.message || 'Nao foi possivel concluir. Tente novamente.'; this.loading = false; } });
  }
}
