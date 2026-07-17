import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly username = signal('');
  readonly password = signal('');
  readonly error = signal<string | null>(null);
  readonly isLoading = signal(false);

  login() {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.authService.login({ username: this.username(), password: this.password() })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/admin/blog']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set(err.error?.error || 'Login failed');
        }
      });
  }
}
