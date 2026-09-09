import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarKey: string | null;
}

interface AuthResponse { user: User; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(null);
  readonly avatarRevision = signal(0);
  readonly sessionReady = signal(false);
  private sessionRequest$?: Observable<User | null>;

  constructor(private readonly http: HttpClient) {
    this.restoreSession().subscribe();
  }

  get isAuthenticated(): boolean { return this.user() !== null; }

  avatarUrl(user: User | null): string {
    return user?.avatarKey
      ? `${environment.apiUrl}/profile/avatar/${user.id}?v=${encodeURIComponent(user.avatarKey)}`
      : '';
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { name, email, password }).pipe(tap(response => this.saveSession(response)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(tap(response => this.saveSession(response)));
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe();
    this.user.set(null);
  }

  uploadAvatar(file: File): Observable<{ user: User; avatarUrl: string }> {
    const formData = new FormData(); formData.append('avatar', file);
    return this.http.post<{ user: User; avatarUrl: string }>(`${environment.apiUrl}/profile/avatar`, formData).pipe(tap(response => {
      this.user.set(response.user);
      this.avatarRevision.update(value => value + 1);
    }));
  }

  ensureSession(): Observable<boolean> {
    return this.restoreSession().pipe(map(() => this.isAuthenticated));
  }

  private restoreSession(): Observable<User | null> {
    if (!this.sessionRequest$) {
      this.sessionRequest$ = this.http.get<{ user: User }>(`${environment.apiUrl}/auth/me`).pipe(
        map(response => response.user),
        catchError(() => of(null)),
        tap(user => {
          this.user.set(user);
          this.sessionReady.set(true);
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }

    return this.sessionRequest$;
  }

  private saveSession(response: AuthResponse): void {
    this.user.set(response.user);
    this.sessionReady.set(true);
  }
}
