/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />

module Tetris {

    export module Shapes {
        export class ShapeJ extends Shape {

            private blockColor: string = 'blue';

            public name: string = 'ShapeJ';

            constructor(state:Kiwi.State, x:number, y:number) {
                super(state);
                this.addBlock(this.blockColor, x - 1, y - 1);
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x + 1, y);
            }

        }
    }
}


