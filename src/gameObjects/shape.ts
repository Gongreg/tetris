/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="block.ts" />

module Shapes {

    export class Shape
    {

        static rotations = [
            [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
            [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
            [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
            [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
        ];

        protected currentRotation: number = 0;
        protected currentTest: number = 0;

        protected gameObject : Kiwi.Group;

        protected state: Kiwi.State;

        protected blocks: Block[] = [];

        protected center: Block;

        constructor(state: Kiwi.State)
        {
            this.state = state;
            this.gameObject = new Kiwi.Group(state);
        }

        protected addBlock(texture: string, x: number, y: number, center: boolean = false )
        {

            var block: Block = new Block(
                x,
                y,
                this.state,
                this.state.textures['block-' + texture]
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


        public fall()
        {
            for (var index in this.blocks) {
                var block: Block = this.blocks[index];
                block.fall();
            }

        }

        move(side: number)
        {
            for (var index in this.blocks) {
                var block: Block = this.blocks[index];
                block.move(side);

            }
        }

        getRotations()
        {
            return Shape.rotations;
        }

        getNextRotation(direction: number)
        {
            var rotations = this.getRotations();
            console.log(rotations);

            var nextPositions: PositionI[] = [];

            if (this.currentTest == 5) {
                this.currentTest = 0;
                return nextPositions;
            }

            var xMargin: number = direction * rotations[this.currentRotation][this.currentTest][0];
            var yMargin: number = direction * rotations[this.currentRotation][this.currentTest][1];

            console.log(xMargin + ' ' + yMargin);


            for (var index in this.blocks) {
                var block: Block = this.blocks[index];

                var xDiff: number = block.x - this.center.x;
                var yDiff: number = block.y - this.center.y;

                nextPositions.push({
                    x: this.center.x - yDiff + xMargin,
                    y: this.center.y + xDiff - yMargin
                });

            }

            this.currentTest++;

            return nextPositions;
        }

        rotate(direction: number)
        {

            var rotations = this.getRotations();

            var centerX: number = this.center.x;
            var centerY: number = this.center.y;

            var xMargin: number = direction * rotations[this.currentRotation][this.currentTest - 1][0];
            var yMargin: number = direction * rotations[this.currentRotation][this.currentTest - 1][1];

            for (var index in this.blocks) {
                var block: Block = this.blocks[index];

                var xDiff: number = direction * (block.x - centerX);
                var yDiff: number = direction * (block.y - centerY);

                block.setPosition(centerX - yDiff + xMargin, centerY + xDiff - yMargin);

            }

            this.currentTest = 0;

            this.currentRotation += direction;
            if (this.currentRotation == 4) {
                this.currentRotation = 0;
            }

            if (this.currentRotation == -1) {
                this.currentRotation = 3;
            }
        }

    }

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

        public fall()
        {
            super.fall();
            this.center.fall();

        }

        move(side: number)
        {
            super.move(side);
            this.center.move(side);
        }

        rotate(direction: number)
        {

            var rotations = this.getRotations();

            var xMargin: number = direction * rotations[this.currentRotation][this.currentTest - 1][0];
            var yMargin: number = direction * rotations[this.currentRotation][this.currentTest - 1][1];

            super.rotate(direction);

            this.center.setPosition(this.center.x + xMargin, this.center.y - yMargin);
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
            this.addBlock(this.blockColor, x,   y);
            this.addBlock(this.blockColor, x,   y + 1);
            this.addBlock(this.blockColor, x+1, y);
            this.addBlock(this.blockColor, x+1, y + 1);

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

}
