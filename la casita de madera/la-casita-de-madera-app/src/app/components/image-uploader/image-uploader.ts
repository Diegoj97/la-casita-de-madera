import { Component, input, output, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  templateUrl: './image-uploader.html',
})
export class ImageUploader {
  private readonly http = inject(HttpClient);
  
  readonly label = input<string>('Upload Image');
  readonly currentUrl = input<string | null>(null);
  readonly uploaded = output<string>();
  
  readonly isUploading = signal(false);
  readonly error = signal<string | null>(null);

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.isUploading.set(true);
    this.error.set(null);

    const formData = new FormData();
    formData.append('image', file);

    this.http.post<{ url: string }>('/api/uploads', formData).subscribe({
      next: (res) => {
        this.isUploading.set(false);
        this.uploaded.emit(res.url);
      },
      error: (err) => {
        this.isUploading.set(false);
        this.error.set(err.error?.error || 'Upload failed');
      }
    });
  }
}
