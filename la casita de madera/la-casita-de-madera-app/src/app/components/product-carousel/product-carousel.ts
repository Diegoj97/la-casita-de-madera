import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-product-carousel',
  imports: [],
  templateUrl: './product-carousel.html',
})
export class ProductCarousel {
  readonly images = input.required<string[]>();
  readonly alt = input('');

  readonly current = signal(0);

  next() {
    const len = this.images().length;
    if (len === 0) return;
    this.current.set((this.current() + 1) % len);
  }

  prev() {
    const len = this.images().length;
    if (len === 0) return;
    this.current.set((this.current() - 1 + len) % len);
  }

  select(index: number) {
    this.current.set(index);
  }
}
