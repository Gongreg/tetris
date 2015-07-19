/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />

module Tetris {

    export module Shapes {
        export class ShapeI extends Shape {

            private blockColor : string = 'cyan';

            public name: string = 'ShapeI';

            static rotations = [
                [[0, 0], [-2, 0], [+1, 0], [-2, -1], [+1, +2]],
                [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]],
                [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]],
                [[0, 0], [+1, 0], [-2, 0], [+1, -2], [-2, +1]],
            ];

            constructor(state: Kiwi.State, x : number, y : number)
            {
                super(state);
                this.addBlock(this.blockColor, x-1, y);
                this.addBlock(this.blockColor, x,   y);
                this.addBlock(this.blockColor, x+1, y);
                this.addBlock(this.blockColor, x+2, y);

                //invisible center
                this.addCenter(x+0.5, y+0.5);

            }

            //return specific rotations for this shape
            getRotations()
            {
                return ShapeI.rotations;
            }

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
