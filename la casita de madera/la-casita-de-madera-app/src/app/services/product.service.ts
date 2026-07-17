import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import type { Product, CreateProduct, UpdateProduct } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = '/api/products';
  private readonly refreshTrigger = new Subject<void>();

  constructor(private http: HttpClient) {}

  readonly products = toSignal(
    this.refreshTrigger.pipe(
      switchMap(() => this.http.get<Product[]>(this.apiUrl)),
    ),
    { initialValue: null },
  );

  readonly availableProducts = computed(() => this.products() ?? []);

  readonly allProducts = toSignal(
    this.refreshTrigger.pipe(
      switchMap(() => this.http.get<Product[]>(`${this.apiUrl}/all`)),
    ),
    { initialValue: null },
  );

  refresh() {
    this.refreshTrigger.next();
  }

  getBySlug(slug: string) {
    return this.http.get<Product>(`${this.apiUrl}/slug/${slug}`);
  }

  getAll() {
    return this.http.get<Product[]>(`${this.apiUrl}/all`);
  }

  create(data: CreateProduct) {
    return this.http.post<Product>(this.apiUrl, data);
  }

  update(id: number, data: UpdateProduct) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImage(file: File) {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<{ url: string }>('/api/uploads', form);
  }
}
