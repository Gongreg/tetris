/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />

module Tetris {
    export module Shapes {
        export class ShapeO extends Shape {

            private blockColor : string = 'yellow';

            public name: string = 'ShapeO';

            constructor(state: Kiwi.State, x : number, y : number)
            {
                super(state);
                this.addBlock(this.blockColor, x,   y - 1);
                this.addBlock(this.blockColor, x,   y);
                this.addBlock(this.blockColor, x+1, y - 1);
                this.addBlock(this.blockColor, x+1, y);
                this.addCenter(x - 0.5,  y - 0.5);
            }

            //No need to do anything
            public rotate() { return this; }

            //No need to do anything
            getNextRotation() { return []; }

            protected addCenter(x: number, y: number)
            {
                this.center = new Block(
                    x,
                    y,
                    this.state,
                    null
                );
            }

        }
    }

}


