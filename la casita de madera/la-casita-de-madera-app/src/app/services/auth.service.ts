import { Injectable, signal, inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly TOKEN_KEY = 'auth_token';

  // Start false so server and first client render match (no hydration mismatch / flash).
  // The real value is read from localStorage only in the browser, after render.
  readonly isAuthenticated = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        this.isAuthenticated.set(this.hasToken());
      });
    }
  }

  private hasToken(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ token: string }>('/api/auth/login', credentials).pipe(
      tap((res) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.TOKEN_KEY, res.token);
        }
        this.isAuthenticated.set(true);
      })
    );
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.isAuthenticated.set(false);
  }
}
