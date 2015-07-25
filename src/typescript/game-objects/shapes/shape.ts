/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../block.ts" />

module Tetris {

    export module Shapes {

        export class Shape
        {

            public name: string;

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

            protected nextPositions: Position[] = [];
            protected nextCenter: Position;
            protected direction: number;

            protected blocks: Block[] = [];

            public center: Block;

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

            public getGameObject() { return this.gameObject; }

            public getBlocks() { return this.blocks; }

            public destroy() {
                this.getBlocks().forEach(block => block.destroy());
            }

            //get blocks position
            public getPositions(blocks : Block[] = this.blocks) {
                return blocks.map(function(block : Block){
                    return block.getPosition();
                });
            }


            public fall(amountOfTiles: number = 1) {
                this.blocks.forEach((block) => {
                    if (block == this.center) {
                        return true;
                    }
                    block.fall(amountOfTiles);
                });

                this.center.fall(amountOfTiles);

                return this;
            }

            move(side: number) {
                this.blocks.forEach((block) => {
                    if (block == this.center) {
                        return true;
                    }
                    block.move(side);
                });

                this.center.move(side);

                return this;
            }

            getRotations() { return Shape.rotations; }

            getNextRotation(direction: number) {
                var nextPositions: Position[] = [];

                //if we checked all possibilities, return nothing
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
                var nextCenter = new Position(
                    centerX + xMargin,
                    centerY + yMargin
                );

                this.blocks.forEach((block) => {
                    var xDiff: number = direction * (block.x - centerX);
                    var yDiff: number = direction * (block.y - centerY);

                    nextPositions.push(new Position(
                        nextCenter.x - yDiff,
                        nextCenter.y + xDiff
                    ));

                });

                this.nextCenter = nextCenter;
                this.nextPositions = nextPositions;
                this.direction = direction;

                //increate test amount
                this.currentTest++;

                return nextPositions;
            }

            rotate() {

                //if we want to ratate without checking
                if (!this.nextCenter) {
                    this.getNextRotation(1);
                }

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

                return this;
            }
        }
    }
}
