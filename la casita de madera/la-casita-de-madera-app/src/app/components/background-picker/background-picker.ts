import { Component, computed, input, output, signal } from '@angular/core';
import { SiteSettingsService } from '../../services/site-settings.service';

export interface BackgroundOption {
  id: number;
  url: string;
  label: string;
}

@Component({
  selector: 'app-background-picker',
  imports: [],
  templateUrl: './background-picker.html',
})
export class BackgroundPicker {
  readonly backgrounds = input<BackgroundOption[]>([]);
  readonly current = input('');
  readonly changed = output<string>();

  protected readonly selected = signal<string | null>(null);
  protected readonly hasPending = computed(() => this.selected() !== null);
  protected readonly isUploading = signal(false);

  constructor(private readonly settingsService: SiteSettingsService) {}

  protected select(url: string) {
    this.selected.set(url === this.selected() ? null : url);
  }

  protected confirm() {
    const value = this.selected();
    if (value === null) return;
    this.changed.emit(value);
    this.selected.set(null);
  }

  protected cancel() {
    this.selected.set(null);
  }

  protected remove(id: number) {
    this.settingsService.removeBackground(id).subscribe();
  }

  protected onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.isUploading.set(true);
    this.settingsService.addBackground(file).subscribe({
      next: () => this.isUploading.set(false),
      error: () => this.isUploading.set(false),
    });
  }
}
