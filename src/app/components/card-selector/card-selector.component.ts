import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block text-left">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
        (click)="isOpen = !isOpen">
        {{ selectedCards }} Cards ▼
      </button>

      <div *ngIf="isOpen"
           class="absolute mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
        <div class="py-1">
          <div *ngFor="let option of cardOptions"
               (click)="selectOption(option)"
               class="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
            {{ option }} Cards
          </div>
        </div>
      </div>
    </div>
  `
})
export class CardSelectorComponent {
  @Output() cardNumberChanged = new EventEmitter<number>();

  cardOptions: number[] = [8, 16, 32];
  selectedCards: number = 16;
  isOpen: boolean = false;

  selectOption(number: number) {
    this.selectedCards = number;
    this.isOpen = false;
    this.cardNumberChanged.emit(number);
  }
}
