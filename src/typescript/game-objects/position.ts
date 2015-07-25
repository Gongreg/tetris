module Tetris {
    export class Position {

        constructor(public x:number, public y:number) {}

        public isLower(position : Position) {
            return this.y > position.y;
        }

    }

}
