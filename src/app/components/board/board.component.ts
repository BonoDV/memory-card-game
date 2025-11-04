import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Card } from '../../types/card';
import { ThemeSelectorComponent } from '../../components/themeSelector/themeSelector.component';
import { CardSelectorComponent } from '../card-selector/card-selector.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, ThemeSelectorComponent, CardSelectorComponent],
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  cards: Card[] = [];
  timer: number = 0;
  timerInterval: any;
  timeElapsed: string = '00:00';
  isLocked: boolean = false;
  currentTheme: string = 'one-piece';
  isLoading: boolean = true;
  loadingProgress: number = 0;
  totalImages: number = 0;
  loadedImages: number = 0;
  backgroundImage: string = '/img/background/one-piece/background.png';

  constructor() {
    this.createCards(16);
    this.startTimer();
  }

  ngOnInit() {
    this.preloadImages();
  }

  private preloadImages() {
    // Reset counters
    this.isLoading = true;
    this.loadedImages = 0;
    this.loadingProgress = 0;

    const themes = {
      'one-piece': 'OP',
      pokemon: 'PKMN',
      'final-fantasy': 'FF',
    };

    // Calculate total images to load based on current cards length
    const pairsCount = this.cards.length / 2;
    this.totalImages = Object.keys(themes).length * pairsCount;

    // Preload all themes
    Object.entries(themes).forEach(([theme, prefix]) => {
      for (let i = 1; i <= pairsCount; i++) {
        const img = new Image();
        img.onload = () => {
          this.loadedImages++;
          this.loadingProgress = Math.round((this.loadedImages / this.totalImages) * 100);
          if (this.loadedImages === this.totalImages) {
            this.isLoading = false;
          }
        };
        img.onerror = () => {
          this.loadedImages++;
          this.loadingProgress = Math.round((this.loadedImages / this.totalImages) * 100);
          if (this.loadedImages === this.totalImages) {
            this.isLoading = false;
          }
        };
        img.src = `/img/cards/${theme}/${prefix}${i}.png`;
      }
    });
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
    this.backgroundImage = `/img/background/${theme}/background.png`;
    this.resetGame();
    this.preloadImages(); // Preload images when theme changes
  }

  onCardNumberChanged(cardNumber: number) {
    this.resetGame();
    this.createCards(cardNumber);
    this.preloadImages();
  }
}
