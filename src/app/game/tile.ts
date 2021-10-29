export enum TileType {
    COVER,
    UNCOVER,
    FLAG
}

export class Tile {
    status: TileType = TileType.COVER;
    mine: boolean = false;
    nearby: number = 0;

    constructor(public row: number, public col: number) {}
}