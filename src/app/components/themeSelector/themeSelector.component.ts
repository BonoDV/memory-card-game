import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-4 justify-center items-center mb-8 mt-8">
      <button
        (click)="selectTheme('one-piece')"
        class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        [ngClass]="{ 'ring-2 ring-red-300': selectedTheme === 'one-piece' }"
      >
        One Piece
      </button>
      <button
        (click)="selectTheme('pokemon')"
        class="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        [ngClass]="{ 'ring-2 ring-yellow-300': selectedTheme === 'pokemon' }"
      >
        Pokémon
      </button>
      <button
        (click)="selectTheme('final-fantasy')"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        [ngClass]="{ 'ring-2 ring-blue-300': selectedTheme === 'final-fantasy' }"
      >
        Final Fantasy
      </button>
    </div>
  `,
})
export class ThemeSelectorComponent {
  @Output() themeChanged = new EventEmitter<string>();
  selectedTheme: string = 'one-piece';

  selectTheme(theme: string) {
    this.selectedTheme = theme;
    this.themeChanged.emit(theme);
  }
}
