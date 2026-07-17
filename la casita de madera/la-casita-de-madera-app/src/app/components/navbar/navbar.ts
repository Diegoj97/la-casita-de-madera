import { Component, inject, signal, output } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly menuOpen = signal(false);
  readonly colmenarClick = output<void>();
  readonly productsClick = output<void>();

  signOut() {
    this.authService.logout();
    this.menuOpen.set(false);
    this.router.navigate(['/']);
  }

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  onColmenar() {
    this.closeMenu();
    this.colmenarClick.emit();
  }

  onProducts() {
    this.closeMenu();
    this.productsClick.emit();
  }
}
