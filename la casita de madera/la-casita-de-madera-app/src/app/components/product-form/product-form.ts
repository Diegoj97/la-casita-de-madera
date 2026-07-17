import { Component, input, output, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import type { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
})
export class ProductForm {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);

  readonly product = input<Product | null>(null);
  readonly submitLabel = input('Save');
  readonly saved = output<{
    name: string;
    slug: string;
    description: string;
    excerpt: string;
    price: number | null;
    image_url: string;
    images: string[];
    tags: string[];
    available: boolean;
  }>();
  readonly cancelled = output<void>();

  readonly uploading = signal(false);
  readonly uploadError = signal<string | null>(null);
  readonly images = signal<string[]>([]);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    description: ['', Validators.required],
    excerpt: [''],
    price: [6.50],
    tags: [''],
    available: [true],
  });

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) {
        this.form.patchValue({
          name: p.name,
          slug: p.slug,
          description: p.description,
          excerpt: p.excerpt ?? '',
          price: p.price ?? null,
          tags: p.tags.join(', '),
          available: p.available,
        });
        this.images.set(p.images?.length ? [...p.images] : (p.image_url ? [p.image_url] : []));
      }
    });
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) return;

    this.uploadError.set(null);
    let pending = files.length;
    let failed = false;

    for (const file of files) {
      this.uploading.set(true);
      this.productService.uploadImage(file).subscribe({
        next: (res) => {
          this.images.update((list) => [...list, res.url]);
          pending--;
          if (pending === 0 && !failed) this.uploading.set(false);
        },
        error: (err) => {
          this.uploadError.set(err.error?.error ?? 'Upload failed');
          failed = true;
          pending--;
          if (pending === 0) this.uploading.set(false);
        },
      });
    }

    input.value = '';
  }

  removeImage(index: number) {
    this.images.update((list) => list.filter((_, i) => i !== index));
    this.uploadError.set(null);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const images = this.images();
    this.saved.emit({
      name: raw.name!,
      slug: raw.slug!,
      description: raw.description!,
      excerpt: raw.excerpt ?? '',
      price: raw.price ?? null,
      image_url: images[0] ?? '',
      images,
      tags: (raw.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
      available: raw.available ?? true,
    });
  }

  onCancel() {
    this.cancelled.emit();
  }
}
