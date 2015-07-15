/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="block.ts" />

module Tetris {

    export module Shapes {

        export class Shape
        {

            protected state: Kiwi.State;

            protected gameObject : Kiwi.Group;

            //rotations for J L T Z S Pieces
            static rotations = [
                [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
                [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
                [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
                [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
            ];

            //status for rotation
            protected currentRotation: number = 0;
            protected currentTest: number = 0;

            protected nextPositions: PositionI[] = [];
            protected nextCenter: PositionI;
            protected direction: number;

            protected blocks: Block[] = [];

            protected center: Block;


            constructor(state: Kiwi.State)
            {
                this.state = state;
                this.gameObject = new Kiwi.Group(state);
            }

            //add block into the shape
            protected addBlock(blockColor: string, x: number, y: number, center: boolean = false )
            {

                var block: Block = new Block(
                    x,
                    y,
                    this.state,
                    this.state.textures['block-' + blockColor]
                );

                this.blocks.push(
                    block
                );

                this.gameObject.addChild(
                    block.sprite
                );


                if (center) {
                    this.center = block;
                }
            }

            public getGameObject()
            {
                return this.gameObject;
            }

            public getBlocks()
            {
                return this.blocks;
            }

            private getRowOfLowestInColumn(column, blocks) {
                return blocks.reduce((row, block) =>{
                        return block.x === column && block.y > row ? block.y : row;
                    }, blocks[0].y
                )
            }

            //return lowest blocks
            public getLowestBlocks(blocks : Block[] = this.blocks) {

                return blocks.filter((block)=>{
                    return block.y === this.getRowOfLowestInColumn(block.x, blocks)
                });
            }

            //get blocks position
            public getPositions(blocks : Block[] = this.blocks)
            {

                return blocks.map(function(block : Block){
                    return block.getPosition();
                });
            }


            public fall(amountOfTiles: number = 1)
            {
                this.blocks.forEach((block) => {
                    if (block == this.center) {
                        return true;
                    }
                    block.fall(amountOfTiles);
                });

                this.center.fall(amountOfTiles);

            }

            move(side: number)
            {
                this.blocks.forEach((block) => {
                    if (block == this.center) {
                        return true;
                    }
                    block.move(side);
                });

                this.center.move(side);
            }

            getRotations()
            {
                return Shape.rotations;
            }

            getNextRotation(direction: number)
            {
                var nextPositions: PositionI[] = [];

                //if we checked all posibilities, return nothing
                if (this.currentTest == 5) {
                    this.currentTest = 0;
                    return nextPositions;
                }

                var rotations = this.getRotations();

                var centerX: number = this.center.x;
                var centerY: number = this.center.y;

                var xMargin: number = direction * rotations[this.currentRotation][this.currentTest][0];
                var yMargin: number = direction * rotations[this.currentRotation][this.currentTest][1];

                //set center positions, so we don't lose it during rotation
                var nextCenter = {
                    x: centerX + xMargin,
                    y: centerY + yMargin
                };

                this.blocks.forEach((block) => {
                    var xDiff: number = direction * (block.x - centerX);
                    var yDiff: number = direction * (block.y - centerY);

                    nextPositions.push({
                        x: nextCenter.x - yDiff,
                        y: nextCenter.y + xDiff
                    });

                });

                this.nextCenter = nextCenter;
                this.nextPositions = nextPositions;
                this.direction = direction;

                //increate test amount
                this.currentTest++;

                return nextPositions;
            }

            rotate()
            {

                this.center.setPosition(this.nextCenter.x, this.nextCenter.y);

                this.blocks.forEach((block, index) => {

                    //if c block is in center position, it is already set
                    if (block == this.center) {
                        return true;
                    }

                    block.setPosition(this.nextPositions[index].x, this.nextPositions[index].y);

                });

                this.currentTest = 0;

                this.currentRotation += this.direction;
                if (this.currentRotation == 4) {
                    this.currentRotation = 0;
                }

                if (this.currentRotation == -1) {
                    this.currentRotation = 3;
                }
            }

        }

        //DIFFERENT SHAPES


        export class ShapeI extends Shape {

            private blockColor : string = 'cyan';

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
                this.center =  new Block(
                    x,
                    y,
                    this.state,
                    null
                );
            }

        }

        export class ShapeJ extends Shape {

            private blockColor : string = 'blue';

            constructor(state: Kiwi.State, x : number, y : number)
            {
                super(state);

                this.addBlock(this.blockColor, x-1, y-1);
                this.addBlock(this.blockColor, x-1, y);
                this.addBlock(this.blockColor, x,   y, true);
                this.addBlock(this.blockColor, x+1, y);


            }

        }

        export class ShapeL extends Shape {

            private blockColor : string = 'orange';

            constructor(state: Kiwi.State, x : number, y : number)
            {
                super(state);
                this.addBlock(this.blockColor, x-1, y);
                this.addBlock(this.blockColor, x,   y, true);
                this.addBlock(this.blockColor, x+1, y);
                this.addBlock(this.blockColor, x+1, y-1);

            }

        }

        export class ShapeO extends Shape {

            private blockColor : string = 'yellow';

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
            public rotate()
            {
            }

            //No need to do anything
            getNextRotation()
            {
                return [];
            }

            protected addCenter(x: number, y: number)
            {
                this.center =  new Block(
                    x,
                    y,
                    this.state,
                    null
                );
            }


        }

        export class ShapeS extends Shape {

            private blockColor : string = 'green';

            constructor(state: Kiwi.State, x : number, y : number)
            {
                super(state);
                this.addBlock(this.blockColor, x-1, y);
                this.addBlock(this.blockColor, x,   y, true);
                this.addBlock(this.blockColor, x,   y-1);
                this.addBlock(this.blockColor, x+1, y-1);

            }

        }

        export class ShapeT extends Shape {

            private blockColor : string = 'purple';

            constructor(state: Kiwi.State, x : number, y : number)
            {
                super(state);
                this.addBlock(this.blockColor, x-1, y);
                this.addBlock(this.blockColor, x,   y, true);
                this.addBlock(this.blockColor, x,   y-1);
                this.addBlock(this.blockColor, x+1, y);

            }

        }

        export class ShapeZ extends Shape {

            private blockColor : string = 'red';

            constructor(state: Kiwi.State, x : number, y : number)
            {
                super(state);
                this.addBlock(this.blockColor, x-1, y-1);
                this.addBlock(this.blockColor, x,   y-1);
                this.addBlock(this.blockColor, x,   y, true);
                this.addBlock(this.blockColor, x+1, y);

            }

        }

        export class ShapeDot extends Shape {

            private blockColor : string = 'red';

            constructor(state: Kiwi.State, x : number, y : number)
            {
                super(state);
                this.addBlock(this.blockColor, x,   y, true);

            }

        }

    }
}


