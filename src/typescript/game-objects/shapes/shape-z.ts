/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />
module Tetris {

    export module Shapes {
        export class ShapeZ extends Shape {

            private blockColor : string = 'red';

            public name: string = 'ShapeZ';

            constructor(state: Kiwi.State, x : number, y : number)
            {
                super(state);
                this.addBlock(this.blockColor, x-1, y-1);
                this.addBlock(this.blockColor, x,   y-1);
                this.addBlock(this.blockColor, x,   y, true);
                this.addBlock(this.blockColor, x+1, y);

            }
        }
    }
}


