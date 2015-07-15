module Tetris {
    export enum BlockStatus {
        Empty,
        Taken
    }

    export enum Direction {
        Left = -1,
        Right = 1,
        Up = 2,
        Down = 4
    }
}
