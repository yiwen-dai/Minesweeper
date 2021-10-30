export enum TileType {
    COVER,
    UNCOVER,
    FLAG
}

export class Tile {
    status: TileType = TileType.COVER;
    mine: boolean = false;
    nearby: number = 0;
    nearbyFlags: number = 0;
    curr : boolean = false;

    constructor(public row: number, public col: number) {}
    
}