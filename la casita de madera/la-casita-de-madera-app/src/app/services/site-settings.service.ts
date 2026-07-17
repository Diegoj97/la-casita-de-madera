import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { BackgroundOption } from '../components/background-picker/background-picker';
import { catchError, map, of, tap, throwError } from 'rxjs';

export interface SiteSettings {
  home_title?: string;
  home_subtitle?: string;
  about_title?: string;
  about_text?: string;
  about_excerpt?: string;
  about_image_url?: string;
  background_url?: string;
  colmenar_text?: string;
  quienes_title?: string;
  quienes_text?: string;
  quienes_image_url?: string;
  [key: string]: string | undefined;
}

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/settings';

  readonly settings = signal<SiteSettings>({});
  readonly backgrounds = signal<BackgroundOption[]>([]);

  // Alias for backward compatibility with BackgroundPicker
  get backgroundUrl() {
    return () => this.settings().background_url ?? '';
  }

  constructor() {
    this.loadSettings();
    this.loadBackgrounds();
  }

  refreshSettings() {
    this.loadSettings();
  }

  private loadSettings() {
    this.http
      .get<SiteSettings>(`${this.apiUrl}/`)
      .pipe(catchError(() => of({} as SiteSettings)))
      .subscribe({
        next: (res) => this.settings.set(res ?? {}),
      });
  }

  private loadSetting(key: string) {
    this.http
      .get<{ key: string; value: string }>(`${this.apiUrl}/${key}`)
      .pipe(catchError(() => of({ key, value: '' })))
      .subscribe({
        next: (res) => {
          this.settings.update(s => ({ ...s, [res.key]: res.value }));
        },
      });
  }

  private loadBackgrounds() {
    this.http.get<BackgroundOption[]>('/api/backgrounds').subscribe({
      next: (res) => this.backgrounds.set(res),
      error: () => this.backgrounds.set([]),
    });
  }

  addBackground(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.http
      .post<BackgroundOption>('/api/backgrounds', formData)
      .pipe(tap((img) => this.backgrounds.update((list) => [...list, img])));
  }

  removeBackground(id: number) {
    return this.http
      .delete(`/api/backgrounds/${id}`)
      .pipe(
        tap(() =>
          this.backgrounds.update((list) => list.filter((b) => b.id !== id)),
        ),
      );
  }

  saveBackground(url: string) {
    return this.saveSetting('background_url', url);
  }

  saveSetting(key: string, value: string) {
    // Optimistic update so the UI reflects the change immediately
    this.settings.update(s => ({ ...s, [key]: value }));
    return this.http
      .put<{ key: string; value: string }>(`${this.apiUrl}/${key}`, { value })
      .pipe(
        tap((res) => this.settings.update(s => ({ ...s, [res.key]: res.value }))),
        catchError((err) => {
          // Revert optimistic update on failure
          this.loadSetting(key);
          return throwError(() => err);
        }),
      );
  }
}