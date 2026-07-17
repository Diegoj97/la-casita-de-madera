import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteSettingsService } from './services/site-settings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    '[style]': 'bgStyle()',
  },
})
export class App {
  private readonly settings = inject(SiteSettingsService);

  protected readonly bgStyle = computed(() => {
    const url = this.settings.backgroundUrl();
    return url
      ? `background-image: url(${url}); background-size: cover; background-position: center; background-attachment: fixed;`
      : '';
  });
}
