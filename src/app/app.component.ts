import { Component, OnDestroy } from '@angular/core';
import { Board } from './game/board';
import { Tile, TileType } from './game/tile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  selectedDifficulty = 0;
  board = new Board(8, 8, 10);

  // ********************************************
  // TIMER LOGIC
  counter: number = 0;
  timerRef: number = 0;
  running: boolean = false;
  time: string = "000";

  startTimer() {
    this.running = !this.running;
    if (this.running) {
      const startTime = Date.now() - (this.counter || 0);
      this.timerRef = setInterval(() => {
        this.counter = Math.floor((Date.now() - startTime) / 1000);
        this.time = this.counter.toString();
        while (this.time.length < 3) {
          this.time = "0" + this.time;
        }
      });
    } else {
      clearInterval(this.timerRef);
    }
  }

  clearTimer() {
    this.running = false;
    this.counter = 0;
    clearInterval(this.timerRef);
  }

  ngOnDestroy() {
    clearInterval(this.timerRef);
  }


  // ********************************************
  // BOARD LOGIC
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

    this.clearTimer();
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

  sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  setImage(click: boolean) {
    var image = document.getElementById("image") as HTMLImageElement;
    if (click) {
      image.src = "../assets/click.png";
    } else {
      image.src = "../assets/dormant.png"
    }

  }

  checkTile(tile: Tile) {    
    if (!this.board.numClicks) {
      this.startTimer();
    }
    var result = this.board.uncover(tile);    
    if (result == "lost") {
      this.startTimer();
    }
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
