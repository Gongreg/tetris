module Tetris {
    export enum BlockStatus {
        Empty,
        Taken,
        CurrentShape
    }

    export enum Direction {
        Left = -1,
        Right = 1,
        Up = 2,
        Down = 4
    }
}
