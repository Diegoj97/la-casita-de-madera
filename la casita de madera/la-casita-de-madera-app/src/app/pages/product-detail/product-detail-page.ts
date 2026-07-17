import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductCarousel } from '../../components/product-carousel/product-carousel';
import type { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail-page',
  imports: [RouterLink, DecimalPipe, ProductCarousel],
  templateUrl: './product-detail-page.html',
})
export class ProductDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const slug = params.get('slug');
          if (!slug) throw new Error('No slug provided');
          return this.productService.getBySlug(slug);
        }),
      )
      .subscribe({
        next: (p) => {
          this.product.set(p);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.error ?? err.message ?? 'Product not found');
          this.loading.set(false);
        },
      });
  }
}
