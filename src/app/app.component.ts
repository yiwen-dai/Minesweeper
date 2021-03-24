import { Component } from '@angular/core';
import { Board } from './game/board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'minesweeper';
  board = new Board(10, 10, 15);
}
