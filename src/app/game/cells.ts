export enum CellState {
    open,
    clear,
    flag
}

export class Cell {
    status: CellState = CellState.open;
    mine = false;
    neighbourMines: number = 0;
    constructor(public col: number, public row: number) {};
}
