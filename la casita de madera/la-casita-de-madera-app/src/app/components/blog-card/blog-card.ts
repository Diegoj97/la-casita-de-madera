import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import type { BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-blog-card',
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-card.html',
})
export class BlogCard {
  readonly post = input.required<BlogPost>();
}
