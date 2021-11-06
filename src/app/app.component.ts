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
  selectedDifficulty = 0;
  board = new Board(8, 8, 20);

  public get TileType(): typeof TileType {
    return TileType; 
  }

  changeDifficulty() {
    var radios = document.getElementsByName("difficulty");
    for (var i = 0; i < 3; ++i) {
      var curr = radios[i] as HTMLInputElement;
      if (curr.checked) {
        if (i == this.selectedDifficulty) {
          return;
        } else {
          this.selectedDifficulty = i;
        }
      }
    }

    switch (this.selectedDifficulty) {
      // beginner
      case 0:
        this.board = new Board(8, 8, 10);
      break;
      
      // intermediate
      case 1:
        this.board = new Board(16, 16, 40);
      break;

      case 2:
        this.board = new Board(24, 24, 99);
      break;
          
      default:
        break;
    }
  }

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
    this.board.uncover(tile);
    ++this.board.numClicks;
  }

  flagTile(tile: Tile) {
    this.board.flagTile(tile);
    return false;
  }

  revealAll(tile: Tile) {
    this.board.revealAll(tile);
  }

}
