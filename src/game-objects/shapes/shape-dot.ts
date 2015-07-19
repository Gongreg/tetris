/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />

module Tetris {

    export module Shapes {
        export class ShapeDot extends Shape {

            private blockColor : string = 'red';

            public name: string = 'ShapeDot';

            constructor(state: Kiwi.State, x : number, y : number)
            {
                super(state);
                this.addBlock(this.blockColor, x,   y, true);

            }
        }
    }
}


