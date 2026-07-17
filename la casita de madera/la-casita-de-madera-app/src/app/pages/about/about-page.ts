import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteSettingsService } from '../../services/site-settings.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about-page.html',
})
export class AboutPage {
  readonly settingsService = inject(SiteSettingsService);
  readonly settings = this.settingsService.settings;
}
