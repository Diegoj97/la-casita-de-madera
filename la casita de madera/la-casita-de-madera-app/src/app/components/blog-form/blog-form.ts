import { Component, input, output, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogPostService } from '../../services/blog-post.service';
import type { BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-blog-form',
  imports: [ReactiveFormsModule],
  templateUrl: './blog-form.html',
})
export class BlogForm {
  private readonly fb = inject(FormBuilder);
  private readonly blogService = inject(BlogPostService);

  readonly post = input<BlogPost | null>(null);
  readonly submitLabel = input('Save');
  readonly saved = output<{
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    image_url: string;
    tags: string[];
    published: boolean;
  }>();
  readonly cancelled = output<void>();

  readonly uploading = signal(false);
  readonly uploadError = signal<string | null>(null);
  readonly previewUrl = signal<string | null>(null);

  readonly form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    content: ['', Validators.required],
    excerpt: [''],
    author: ['', Validators.required],
    image_url: [''],
    tags: [''],
    published: [false],
  });

  constructor() {
    effect(() => {
      const p = this.post();
      if (p) {
        this.form.patchValue({
          title: p.title,
          slug: p.slug,
          content: p.content,
          excerpt: p.excerpt ?? '',
          author: p.author,
          image_url: p.image_url ?? '',
          tags: p.tags.join(', '),
          published: p.published,
        });
        this.previewUrl.set(p.image_url ?? null);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    this.uploadError.set(null);

    const localPreview = URL.createObjectURL(file);
    this.previewUrl.set(localPreview);

    this.blogService.uploadImage(file).subscribe({
      next: (res) => {
        this.form.patchValue({ image_url: res.url });
        this.previewUrl.set(res.url);
        this.uploading.set(false);
      },
      error: (err) => {
        this.uploadError.set(err.error?.error ?? 'Upload failed');
        this.uploading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    this.saved.emit({
      title: raw.title!,
      slug: raw.slug!,
      content: raw.content!,
      excerpt: raw.excerpt ?? '',
      author: raw.author!,
      image_url: raw.image_url ?? '',
      tags: (raw.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
      published: raw.published ?? false,
    });
  }

  onCancel() {
    this.cancelled.emit();
  }
}
