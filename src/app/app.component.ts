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
  singleClick = true;

  public get TileType(): typeof TileType {
    return TileType; 
  }

  board = new Board(10, 10, 10);

  getClass(tile: Tile) {
    var base = 'uncover ';
    var output = '';

    if (tile.curr && tile.mine) {
      output = base.concat('curr');
      return output;
    } else if (tile.mine) {
      return base;
    }

    switch (tile.nearby) {
      case 0:
        output = base.concat('zero ');
        break;

      case 1:
        output = base.concat('one ');
        break;

      case 2: 
        output = base.concat('two ');
        break;

      case 3:
        output = base.concat('three ');
        break;
      
      case 4:
        output = base.concat('four ');
        break;

      case 5:
        output = base.concat('five ');
        break;

      case 6:
        output = base.concat('six ');
        break;

      case 7:
        output = base.concat('seven ');
        break;

      case 8:
        output = base.concat('eight ');
        break;
      
      default:
        output.concat('unidentified');
    }

    return output;
  }

  checkTile(tile: Tile) {
    const result = this.board.uncover(tile);
    if (result === 'lose') {
      this.gameOver();
    } else if (result === 'win') {
      alert("You won! :)");
    }
    console.log(this.board.remainingTiles);
  }

  flagTile(tile: Tile) {
    this.board.flagTile(tile);
    return false;
  }

  revealAll(tile: Tile) {
    const result = this.board.revealAll(tile);
    if (!result) {
      this.gameOver();
    }
  }

  gameOver() {
    this.board.showAllMines();
  }
}
