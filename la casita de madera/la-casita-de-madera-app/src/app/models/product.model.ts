export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  excerpt: string | null;
  price: number | null;
  image_url: string | null;
  images: string[];
  tags: string[];
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProduct {
  name: string;
  slug: string;
  description: string;
  excerpt?: string;
  price?: number;
  image_url?: string;
  images?: string[];
  tags?: string[];
  available?: boolean;
}

export interface UpdateProduct {
  name?: string;
  slug?: string;
  description?: string;
  excerpt?: string;
  price?: number;
  image_url?: string;
  images?: string[];
  tags?: string[];
  available?: boolean;
}
