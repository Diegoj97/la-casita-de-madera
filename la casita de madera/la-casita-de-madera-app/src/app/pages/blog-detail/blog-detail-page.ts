import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { BlogPostService } from '../../services/blog-post.service';
import type { BlogPost } from '../../models/blog-post.model';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-blog-detail-page',
  imports: [RouterLink, DateFormatPipe],
  templateUrl: './blog-detail-page.html',
})
export class BlogDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogPostService);

  readonly post = signal<BlogPost | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const slug = params.get('slug');
          if (!slug) throw new Error('No slug provided');
          return this.blogService.getBySlug(slug);
        }),
      )
      .subscribe({
        next: (p) => {
          this.post.set(p);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.error ?? err.message ?? 'Post not found');
          this.loading.set(false);
        },
      });
  }
}
