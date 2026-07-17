import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import type { BlogPost, PaginatedResponse, CreateBlogPost, UpdateBlogPost } from '../models/blog-post.model';

@Injectable({ providedIn: 'root' })
export class BlogPostService {
  private apiUrl = '/api/blog-posts';

  private postsSignal = signal<BlogPost[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private pageSignal = signal<number>(1);
  private pageSizeSignal = signal<number>(3);
  private totalSignal = signal<number>(0);
  private selectedSlug = signal<string | null>(null);
  private refreshTrigger = signal<number>(0);

  posts = computed(() => this.postsSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());
  page = computed(() => this.pageSignal());
  pageSize = computed(() => this.pageSizeSignal());
  total = computed(() => this.totalSignal());

  constructor(private http: HttpClient) {
    this.refresh();
  }

  refresh() {
    this.refreshTrigger.update((v) => v + 1);
  }

  private load() {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    const params = new HttpParams()
      .set('page', this.pageSignal().toString())
      .set('limit', this.pageSizeSignal().toString());
    this.http.get<PaginatedResponse>(this.apiUrl, { params }).subscribe({
      next: (res) => {
        this.postsSignal.set(res.posts);
        this.totalSignal.set(res.total);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err.message ?? 'Error loading posts');
        this.loadingSignal.set(false);
      },
    });
  }

  get(page: number, limit: number) {
    this.pageSignal.set(page);
    this.pageSizeSignal.set(limit);
    this.refresh();
    return this.http.get<PaginatedResponse>(this.apiUrl, {
      params: new HttpParams().set('page', page.toString()).set('limit', limit.toString()),
    });
  }

  getAll() {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/all`);
  }

  getBySlug(slug: string) {
    return this.http.get<BlogPost>(`${this.apiUrl}/slug/${slug}`);
  }

  getPaginated(page: number, limit: number) {
    return this.http.get<PaginatedResponse>(
      `${this.apiUrl}?page=${page}&limit=${limit}`,
    );
  }

  create(data: CreateBlogPost) {
    return this.http.post<BlogPost>(this.apiUrl, data).pipe(
      tap(() => this.refresh()),
    );
  }

  update(id: number, data: UpdateBlogPost) {
    return this.http.put<BlogPost>(`${this.apiUrl}/${id}`, data).pipe(
      tap(() => this.refresh()),
    );
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refresh()),
    );
  }

  uploadImage(file: File) {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<{ url: string }>('/api/uploads', form);
  }
}
