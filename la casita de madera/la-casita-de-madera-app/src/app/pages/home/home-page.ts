import { Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogPostService } from '../../services/blog-post.service';
import { ProductService } from '../../services/product.service';
import { SiteSettingsService } from '../../services/site-settings.service';
import { BlogCard } from '../../components/blog-card/blog-card';
import { Navbar } from '../../components/navbar/navbar';
import { HttpClient } from '@angular/common/http';
import type { BlogPost } from '../../models/blog-post.model';
import type { Product } from '../../models/product.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [BlogCard, Navbar, RouterLink, DecimalPipe, FormsModule],
  templateUrl: './home-page.html',
})
export class HomePage implements OnInit {
  private readonly blogService = inject(BlogPostService);
  private readonly productService = inject(ProductService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly settingsService = inject(SiteSettingsService);

  readonly contactFormAction = 'https://formsubmit.co/Miel.lacasitademadera@gmail.com';
  readonly contactFormNext = (typeof window !== 'undefined' ? window.location.origin : '');

  readonly latestPosts = signal<BlogPost[]>([]);
  readonly postsPage = signal<number>(1);
  readonly postsTotalPages = signal<number>(1);
  readonly postsPerPage = 3;
  readonly products = signal<Product[]>([]);
  readonly settings = this.settingsService.settings;

  // Coordenadas del colmenar
  readonly colmenarLat = 41.229938;
  readonly colmenarLng = -3.523813;
  readonly colmenarZoom = 14;
  readonly showColmenar = signal(false);

  // Formulario de contacto (modal)
  readonly showContact = signal(false);
  readonly contact = signal({ name: '', email: '', phone: '', message: '' });
  readonly contactSent = signal(false);
  readonly contactError = signal<string | null>(null);
  readonly contactSending = signal(false);

  readonly mapSection = viewChild<ElementRef<HTMLElement>>('mapSection');
  readonly productsSection = viewChild<ElementRef<HTMLElement>>('productsSection');

  readonly mapSrc: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://www.openstreetmap.org/export/embed.html?bbox=${
      this.colmenarLng - 0.01
    }%2C${this.colmenarLat - 0.01}%2C${this.colmenarLng + 0.01}%2C${
      this.colmenarLat + 0.01
    }&layer=mapnik&marker=${this.colmenarLat}%2C${this.colmenarLng}`,
  );

  ngOnInit() {
    this.loadPosts();
    this.loadProducts();
  }



  changePostsPage(delta: number) {
    const next = this.postsPage() + delta;
    if (next < 1 || next > this.postsTotalPages()) return;
    this.postsPage.set(next);
    this.loadPosts();
  }

  private loadPosts() {
    this.blogService
      .getPaginated(this.postsPage(), this.postsPerPage)
      .subscribe({
        next: (res) => {
          this.latestPosts.set(res.posts.filter((p) => p.published));
          this.postsTotalPages.set(Math.max(1, res.totalPages));
        },
        error: () => this.latestPosts.set([]),
      });
  }

  private loadProducts() {
    this.productService.getAll().subscribe({
      next: (list) => this.products.set(list),
      error: () => this.products.set([]),
    });
  }

  scrollToProducts() {
    setTimeout(() => {
      this.productsSection()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  toggleColmenar() {
    this.showColmenar.update((v) => !v);
    if (!this.showColmenar()) return;
    setTimeout(() => {
      this.mapSection()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  openContact() {
    this.showContact.set(true);
  }

  closeContact() {
    this.showContact.set(false);
    this.contactSent.set(false);
    this.contactError.set(null);
    this.contact.set({ name: '', email: '', phone: '', message: '' });
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  sendContact() {
    const c = this.contact();
    this.contactError.set(null);

    if (!c.name.trim()) {
      this.contactError.set('El nombre es obligatorio.');
      return;
    }
    if (!this.isValidEmail(c.email.trim())) {
      this.contactError.set('Introduce un correo electrónico válido.');
      return;
    }
    if (c.message.trim().length < 20) {
      this.contactError.set('El mensaje debe tener al menos 20 caracteres.');
      return;
    }

    // Validación OK: enviamos a Formsubmit vía fetch (no-cors para evitar bloqueo CORS)
    const body = new URLSearchParams({
      name: c.name.trim(),
      email: c.email.trim(),
      phone: c.phone.trim(),
      message: c.message.trim(),
      _subject: 'Nuevo mensaje de contacto - La Casita de Madera',
      _captcha: 'false',
      _template: 'table',
    });

    fetch(this.contactFormAction, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      mode: 'no-cors',
    })
      .catch(() => {})
      .finally(() => {
        this.contactSent.set(true);
        this.contact.set({ name: '', email: '', phone: '', message: '' });
      });
  }
}
