import { Component } from '@angular/core';
import { Board } from './game/board';
import { Tile, TileType } from './game/tile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'minesweeper';

  public get TileType(): typeof TileType {
    return TileType; 
  }

  board = new Board(10, 10, 10);

  checkTile(tile: Tile) {
    const result = this.board.uncover(tile);
    if (result === 'lose') {
      alert("You lost... :(");
      alert("Try again?")
    } else if (result === 'win') {
      alert("You won! :)");
    }
  }
}
