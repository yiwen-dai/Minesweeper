import { Tile, TileType } from "./tile";

export class Board{
    tiles: Tile[][] = [];
    allMines: Tile[] = [];
    nonMines: Tile[] = [];
    numClicks = 0;

    remainingTiles: number;
    remainingMines: number;

    constructor(public row: number, public col: number, public mines: number) {
        this.remainingMines = mines;
        this.remainingTiles = row * col - mines;

        var unplacedMines = this.remainingMines;
        var unplacedTiles = row * col;

        for (var r = 0; r < row; ++r) {
            this.tiles[r] = [];
            for (var c = 0; c < col; ++c) {
                this.tiles[r][c] = new Tile(r, c);

                // each tile has a unplacedMines/unplacedTiles probability of being a mine
                var prob = unplacedMines/unplacedTiles;
                if (Math.random() <= prob) {
                    this.tiles[r][c].mine = true;
                    this.allMines.push(this.tiles[r][c]);
                    --unplacedMines;
                } else {
                    this.nonMines.push(this.tiles[r][c]);
                }
                --unplacedTiles;
            }
        }

        // updates grid with neighbour mines
        for (var r = 0; r < row; ++r) {
            for (var c = 0; c < col; ++c) {
                if (this.tiles[r][c].mine) {
                    this.getNeighbours(r, c).forEach(tile => {
                        ++tile.nearby;
                    });
                }
            }
        }
    }

    // returns an array of tiles that are the 8 neighbours surrounding the specified tile
    getNeighbours(r: number, c: number) {
        var output: Tile[] = [];
        for (var x = -1; x < 2; ++x) {
            if (r + x >= 0 && r + x < this.row) {
                for (var y = -1; y < 2; ++y) {
                    if (c + y >= 0 && c + y < this.col) {
                        if (!(x == 0 && y == 0)) {
                            output.push(this.tiles[r+x][c+y]);
                        }
                    }
                }
            }
        }
        return output;
    }

    // remove a tile from an array
    remove(t: Tile, arr: Tile[]) {
        arr.forEach((tile,index)=>{
            if(tile == t) arr.splice(index,1);
         });
    }

    // when a player uncovers a tile
    uncover(tile: Tile) {
        // ensure first click isnt mine
        if (!this.numClicks) {
            if (tile.mine) {
                // swap mine posn with a non mine tile
                var i = Math.floor(Math.random() * this.nonMines.length);
                tile.mine = false;
                this.nonMines.push(tile);
                this.nonMines[i].mine = true;
                this.allMines.push(this.nonMines[i]);
                this.remove(tile, this.allMines);
                this.remove(this.nonMines[i], this.nonMines);
            }
        }
        if (tile.mine) {
            tile.curr = true;
            this.gameOver();
            return;
        } else if (tile.status == TileType.UNCOVER) {
            return;
        } else {
            tile.status = TileType.UNCOVER;
            --this.remainingTiles;
            if (this.remainingTiles < 1) {
                this.won();
            }
            if (!tile.nearby) {
                var neighbours = this.getNeighbours(tile.row, tile.col);
                neighbours.forEach(nb => {
                   this.uncover(nb);
                });
            }
        }
    }

    // when a player flags a tile
    flagTile(tile: Tile) {
        if (tile.status === TileType.FLAG) {
            tile.status = TileType.COVER;
            this.updateFlag(tile, -1);
            ++this.remainingMines;
        } else if (tile.status === TileType.UNCOVER) {
            return;
        } else {
            tile.status = TileType.FLAG;
            this.updateFlag(tile, 1);
            --this.remainingMines;
        }
        return;
    }

    // update tiles' nearby flag count
    updateFlag(tile: Tile, update: number) {
        var neighbours = this.getNeighbours(tile.row, tile.col);
        neighbours.forEach(nb => {
            nb.nearbyFlags += update;
        });
    }

    // reveal all known knowledge from this tile
    revealAll(tile: Tile) {
        if (tile.mine) {
            this.gameOver();
        }
        if (tile.nearby == tile.nearbyFlags) {
            var neighbours = this.getNeighbours(tile.row, tile.col);
            neighbours.forEach(nb => {
                // incorrect flag => game over
                if ((nb.status == TileType.FLAG) != (nb.mine)) {
                    this.gameOver();
                }
            });
            neighbours.forEach(nb => {
                if (!(nb.status == TileType.FLAG)) {
                    this.uncover(nb);
                } else {
                    return;
                }
            });
        } 
    }

    // when game ends all mines are shown
    showAllMines() {
        this.allMines.forEach(mine => {
            mine.status = TileType.UNCOVER;
        })
    }

    gameOver() {
        alert('you lost!')
        this.showAllMines();
    }

    won() {
        alert('you won!');
    }
}