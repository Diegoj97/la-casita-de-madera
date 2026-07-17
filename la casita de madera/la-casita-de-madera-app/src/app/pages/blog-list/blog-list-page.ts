import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPostService } from '../../services/blog-post.service';
import { BlogCard } from '../../components/blog-card/blog-card';
import type { BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-blog-list-page',
  standalone: true,
  imports: [RouterLink, BlogCard],
  templateUrl: './blog-list-page.html',
})
export class BlogListPage implements OnInit {
  private readonly blogService = inject(BlogPostService);

  readonly posts = signal<BlogPost[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this.blogService.getAll().subscribe({
      next: (list) => {
        this.posts.set(list.filter((p) => p.published));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las entradas.');
        this.loading.set(false);
      },
    });
  }
}