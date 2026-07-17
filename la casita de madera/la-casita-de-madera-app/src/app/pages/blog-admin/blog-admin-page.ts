import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { BlogPostService } from '../../services/blog-post.service';
import { ProductService } from '../../services/product.service';
import { SiteSettingsService } from '../../services/site-settings.service';
import { BlogForm } from '../../components/blog-form/blog-form';
import { ProductForm } from '../../components/product-form/product-form';
import { BackgroundPicker } from '../../components/background-picker/background-picker';
import { ImageUploader } from '../../components/image-uploader/image-uploader';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import type { BlogPost } from '../../models/blog-post.model';
import type { Product } from '../../models/product.model';

@Component({
  selector: 'app-blog-admin-page',
  imports: [RouterLink, BlogForm, ProductForm, BackgroundPicker, ImageUploader, DateFormatPipe, DecimalPipe, FormsModule],
  templateUrl: './blog-admin-page.html',
})
export class BlogAdminPage implements OnInit {
  private readonly blogService = inject(BlogPostService);
  private readonly productService = inject(ProductService);
  readonly settingsService = inject(SiteSettingsService);

  readonly currentTab = signal<'posts' | 'settings' | 'products' | 'about'>('posts');

  readonly posts = signal<BlogPost[]>([]);
  readonly editingPost = signal<BlogPost | null>(null);
  readonly isCreating = signal(false);
  readonly error = signal<string | null>(null);
  readonly savedBg = signal(false);

  readonly products = signal<Product[]>([]);
  readonly editingProduct = signal<Product | null>(null);
  readonly isCreatingProduct = signal(false);

  readonly backgrounds = this.settingsService.backgrounds;
  readonly settings = this.settingsService.settings;
  readonly currentBg = this.settingsService.backgroundUrl;

  ngOnInit() {
    this.loadPosts();
    this.loadProducts();
    this.settingsService.refreshSettings();
  }

  private loadPosts() {
    this.blogService.getAll().subscribe({
      next: (p) => this.posts.set(p),
      error: () => this.error.set('Failed to load posts'),
    });
  }

  private loadProducts() {
    this.productService.getAll().subscribe({
      next: (p) => this.products.set(p),
      error: () => this.error.set('Failed to load products'),
    });
  }

  startCreate() {
    this.editingPost.set(null);
    this.isCreating.set(true);
  }

  startEdit(post: BlogPost) {
    this.editingPost.set(post);
    this.isCreating.set(false);
  }

  cancelEdit() {
    this.editingPost.set(null);
    this.isCreating.set(false);
  }

  onSaved(data: any) {
    const request$ = this.editingPost()
      ? this.blogService.update(this.editingPost()!.id, data)
      : this.blogService.create(data);

    request$.subscribe({
      next: () => {
        this.cancelEdit();
        this.loadPosts();
      },
      error: (err) => this.error.set(err.error?.error ?? 'Save failed'),
    });
  }

  deletePost(id: number) {
    if (!confirm('Delete this post?')) return;
    this.blogService.delete(id).subscribe({
      next: () => this.loadPosts(),
      error: (err) => this.error.set(err.error?.error ?? 'Delete failed'),
    });
  }

  startCreateProduct() {
    this.editingProduct.set(null);
    this.isCreatingProduct.set(true);
  }

  startEditProduct(product: Product) {
    this.editingProduct.set(product);
    this.isCreatingProduct.set(false);
  }

  cancelProductEdit() {
    this.editingProduct.set(null);
    this.isCreatingProduct.set(false);
  }

  onProductSaved(data: any) {
    const request$ = this.editingProduct()
      ? this.productService.update(this.editingProduct()!.id, data)
      : this.productService.create(data);

    request$.subscribe({
      next: () => {
        this.cancelProductEdit();
        this.loadProducts();
      },
      error: (err) => this.error.set(err.error?.error ?? 'Save failed'),
    });
  }

  deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return;
    this.productService.delete(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => this.error.set(err.error?.error ?? 'Delete failed'),
    });
  }

  setBackground(url: string) {
    this.settingsService.saveBackground(url).subscribe({
      next: () => this.savedBg.set(true),
      error: (err) => this.error.set(err.error?.error ?? 'Failed to update background'),
    });
  }

  updateSetting(key: string, value: string) {
    this.settingsService.saveSetting(key, value).subscribe({
      error: (err) => this.error.set(err.error?.error || 'Failed to update setting')
    });
  }

  saveSettings() {
    const s = this.settings();
    const keys = [
      'home_title', 'home_subtitle', 'about_title', 'about_excerpt',
      'about_image_url', 'colmenar_text',
    ];
    keys.forEach((key) => {
      const value = s[key];
      if (value !== undefined) {
        this.settingsService.saveSetting(key, value).subscribe({
          error: (err) => this.error.set(err.error?.error || 'Failed to update setting'),
        });
      }
    });
  }
}
