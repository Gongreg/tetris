/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="block.ts" />

module Shapes {

    export class Shape
    {

        protected cubeSize: number = 30;

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

        rotate()
        {

            for (var index in this.blocks) {
                var block: Block = this.blocks[index];

                var xDiff: number = block.x - this.center.x;
                var yDiff: number = block.y - this.center.y;

                block.setPosition(this.center.x - yDiff, this.center.y + xDiff);

            }
        }

    }

    export class ShapeI extends Shape {

        private blockColor : string = 'cyan';

        constructor(state: Kiwi.State, x : number, y : number)
        {
            super(state);
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x+1, y);
            this.addBlock(this.blockColor, x+2, y);
            this.addBlock(this.blockColor, x+3, y);

        }

        rotate()
        {

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

        public rotate()
        {
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

    export class ShapeLol extends Shape {

        private blockColor : string = 'red';

        constructor(state: Kiwi.State, x : number, y : number)
        {
            super(state);
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x, y+1);
            this.addBlock(this.blockColor, x, y+2);
            this.addBlock(this.blockColor, x, y+3);

        }

    }

}
