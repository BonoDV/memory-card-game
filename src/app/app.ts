import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { Analytics } from '@vercel/analytics/next';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BoardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('memory-card-game');
}
