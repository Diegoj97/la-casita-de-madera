export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author: string;
  image_url: string | null;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateBlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  image_url?: string;
  tags?: string[];
  published?: boolean;
}

export interface UpdateBlogPost {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  image_url?: string;
  tags?: string[];
  published?: boolean;
}
