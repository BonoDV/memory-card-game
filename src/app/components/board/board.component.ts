import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Card } from '../../types/card';
import { ThemeSelectorComponent } from '../../components/themeSelector/themeSelector.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, ThemeSelectorComponent],
  templateUrl: './board.component.html',
})
export class BoardComponent {
  cards: Card[] = [];
  timer: number = 0;
  timerInterval: any;
  timeElapsed: string = '00:00';
  isLocked: boolean = false;
  currentTheme: string = 'one-piece';

  constructor() {
    this.createCards(16);
    this.startTimer();
  }

  flipCard(card: Card) {
    // Doesn't allow to flip if the board is locked or the card is already flipped/matched
    if (this.isLocked || card.isMatched || card.isFlipped) {
      return;
    }

    card.isFlipped = true;
  }

  createCards(cardNumber: number) {
    const cards: Card[] = [];
      const prefix = {
        'one-piece': 'OP',
        pokemon: 'PKMN',
        'final-fantasy': 'FF',
      }[this.currentTheme];
    for(let i = 0; i < cardNumber / 2; i++) {


      const card1: Card = {
        id: i,
        image: `/img/cards/${this.currentTheme}/${prefix}${i + 1}.png`,
        isFlipped: false,
        isMatched: false
      };

      const card2: Card = {
        ...card1
      };

      cards.push(card1, card2);
    }

    this.cards = this.shuffleCards(cards);
  }

  private shuffleCards(cards: Card[]): Card[] {

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  private winGame() {
    const hasWon = this.cards.every(card => card.isMatched);
    if (hasWon) {
      this.stopTimer();
      setTimeout(() => {
        alert(`Congratulations! You found all pairs in  ${this.timeElapsed}!`);
        if (confirm('Would you play again?')) {
          this.resetGame();
        }
      }, 300);
    }
  }

  private resetGame() {
    this.stopTimer();
    this.timer = 0;
    this.timeElapsed = '00:00';
    this.createCards(this.cards.length);
    this.startTimer();
  }

  private startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateTimeElapsed();
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private updateTimeElapsed() {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    this.timeElapsed = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  comprobeMatch() {

    const flippedCards = this.cards.filter(card => card.isFlipped && !card.isMatched);
    if (flippedCards.length === 2) {
      if (flippedCards[0].id === flippedCards[1].id) {
        // Math cards
        flippedCards[0].isMatched = true;
        flippedCards[1].isMatched = true;
        this.winGame(); // Check for win after a match
      } else {
        // No match cards, lock the board
        this.isLocked = true;

        setTimeout(() => {
          flippedCards[0].isFlipped = false;
          flippedCards[1].isFlipped = false;
          this.isLocked = false;
        }, 1000);
      }
    }
  }

  onThemeChanged(theme: string) {
    this.currentTheme = theme;
    this.resetGame();
  }
}
