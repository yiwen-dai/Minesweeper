import { Component } from '@angular/core';

import { Board } from './game/board';
import { Cell } from './game/cells';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'minesweeper'

  board = new Board(14, 18, 40);

  onRightClick(event: any, cell: Cell) {
    this.board.onRightClick(cell);
    return false;
  }
}
