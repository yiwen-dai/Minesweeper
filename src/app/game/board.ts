import { Cell, CellState } from './cells';

export class Board {
    cells: Cell[][] = [];

    constructor(private row: number, private col: number, private mines: number) {
        // create board
        for (let r = 0; r < row; ++r) {
            this.cells[r] = [];
            for (let c = 0; c < col; ++c) {
                this.cells[r][c] = new Cell(c, r);
            }
        }

        // assign mines
        let m = mines;
        while (m !== 0) {
            if (this.setMine()) {
                --m;
            }
        }

        // get number of neighbor mines
        for (let r = 0; r < row; ++r) {
            for (let c = 0; c < col; ++c) {
                this.getNeighbors(r, c);
            }
        }

    };

    // Sets a cell to be a mine if not already a mine. Returns true if successful
    // @params {null}
    // @output {Boolean}
    private setMine(): Boolean {
        const y = Math.floor(Math.random() * this.row);
        const x = Math.floor(Math.random() * this.col);

        if (!this.cells[y][x].mine) {
            this.cells[y][x].mine = true;
            return true;
        } else {
            return false;
        }
    }

    // Checks neighbouring cells and determines number of neighbouring mines of given cell
    // @params {Cell} cell
    // @output {null}
    private getNeighbors(row: number, col: number) {
        let numMines = 0;
        for (let r = row - 1; r <= row + 1; ++r) {
            if ((r < this.row) && (r >= 0)) {
                for (let c = col - 1; c <= row + 1; ++c) {
                    if ((c < this.col) && (c >= 0)) {
                        if ((r === row) && (c === col)) {
                            continue;
                        }
                        if (this.cells[r][c].mine) {
                            ++numMines;
                        }
                    }
                }
            }
        }
        this.cells[row][col].neighbourMines = numMines;
    }

    // Checks for cell status when cell is clicked
    // @params {Cell} cell
    // @output {null}
    private clickCell(cell: Cell) {
        if (cell.mine) {
            this.gameOver();
        } else if (cell.status !== CellState.open) {
            return;
        } else {
            cell.status = CellState.clear;
        }
    }

    private gameOver() {

    }

}
