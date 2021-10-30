import { Tile, TileType } from "./tile";

export class Board{
    tiles: Tile[][] = [];
    allMines: Tile[] = [];

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

    // when a player uncovers a tile
    uncover(tile: Tile) {
        if (tile.mine) {
            tile.curr = true;
            return 'lose';
        } else if (tile.status == TileType.UNCOVER) {
            return;
        } else {
            tile.status = TileType.UNCOVER;
            --this.remainingTiles;
            if (this.remainingTiles < 1) {
                return 'win';
            }
            if (!tile.nearby) {
                var neighbours = this.getNeighbours(tile.row, tile.col);
                neighbours.forEach(nb => {
                    this.uncover(nb);
                });
            }
            return;
        }
    }

    // when a player flags a tile
    flagTile(tile: Tile) {
        if (tile.status === TileType.FLAG) {
            tile.status = TileType.COVER;
            this.updateFlag(tile, -1);
        } else if (tile.status === TileType.UNCOVER) {
            return;
        } else {
            tile.status = TileType.FLAG;
            this.updateFlag(tile, 1);
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
        var output = 1;
        if (tile.mine) {
            return;
        }
        if (tile.nearby == tile.nearbyFlags) {
            var neighbours = this.getNeighbours(tile.row, tile.col);
            neighbours.forEach(nb => {
                // incorrect flag => game over
                if ((nb.status == TileType.FLAG) != (nb.mine)) {
                    output = 0;
                }
            });
            neighbours.forEach(nb => {
                this.uncover(nb);
            });
        }
        return output;    
    }

    // when game ends all mines are shown
    showAllMines() {
        this.allMines.forEach(mine => {
            mine.status = TileType.UNCOVER;
        })
    }
}