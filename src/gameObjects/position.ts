module Tetris {
    export interface PositionI
    {
        x: number;
        y: number;

    }

    export class Position implements PositionI {

        constructor(public x:number, public y:number) {}

    }

}
