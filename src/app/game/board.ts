import { Cell, CellState } from './cells';

export class Board {
    cells: Cell[][] = [];
    remainingCells = this.row * this.col - this.mines;

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
                this.countMines(r, c);
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
    private countMines(row: number, col: number) {
        const neighbours = this.getNeighbors(row, col);
        let mines = 0;
        for (let cell of neighbours) {
            mines += cell.mine ? 1 : 0;
        }
        this.cells[row][col].neighbourMines = mines;
    }

    // Gets all neighbouring cells
    // @params {Cell} cell
    // @output {Cell[]}
    private getNeighbors(row: number, col: number) {
        let neighbours : Cell[] = [];
        for (let r = row - 1; r <= row + 1; ++r) {
            if ((r < this.row) && (r >= 0)) {
                for (let c = col - 1; c <= col + 1; ++c) {
                    if ((c < this.col) && (c >= 0)) {
                        if ((r === row) && (c === col)) {
                            continue;
                        } else {
                            neighbours.push(this.cells[r][c]);
                        }
                    }
                }
            }
        }
        return neighbours;
    }

    // Checks for cell status when cell is clicked
    // @params {Cell} cell
    // @output {null}
    public clickCell(cell: Cell) : 'Game Over' | 'Win' | null {
        if (cell.mine) {
            this.revealGrid();
            return 'Game Over';
        } else if (cell.status !== CellState.open) {
            return null;
        } else {
            cell.status = CellState.clear;
            --this.remainingCells;
            if (!this.remainingCells) {
                return 'Win';
            } else if (!cell.neighbourMines) {
                const neighbours = this.getNeighbors(cell.row, cell.col);
                for (let cell of neighbours) {
                    this.clickCell(cell);
                }
            }
            return null;
        }
    }

    // Right click on a cell
    // @params {Cell} cell
    // @output {null}
    public onRightClick(cell: Cell) {
        const neighbours = this.getNeighbors(cell.row, cell.col);
        if (cell.status === CellState.open) {
            cell.status = CellState.flag;
            for (let neighbour of neighbours) {
                ++neighbour.neighbourFlags;
            }
        } else if (cell.status === CellState.flag) {
            cell.status = CellState.open;
            for (let neighbour of neighbours) {
                --neighbour.neighbourFlags;
            }
        }
    }

    private revealGrid() {
        for (let r = 0; r < this.col; ++r) {
            for (let c = 0; c < this.col; ++c) {
                if (this.cells[r][c].status === CellState.open) {
                    this.cells[r][c].status = CellState.clear;
                }
            }
        }
    }

}
