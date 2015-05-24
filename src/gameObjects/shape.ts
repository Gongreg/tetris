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

        constructor(state: Kiwi.State)
        {
            this.state = state;
            this.gameObject = new Kiwi.Group(state);
        }

        protected addBlock(texture : string, x : number, y : number)
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

    }

    export class ShapeJ extends Shape {

        private blockColor : string = 'blue';

        constructor(state: Kiwi.State, x : number, y : number)
        {
            super(state);
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x+1, y);
            this.addBlock(this.blockColor, x+2, y);
            this.addBlock(this.blockColor, x+2, y+1);


        }

    }

    export class ShapeL extends Shape {

        private blockColor : string = 'orange';

        constructor(state: Kiwi.State, x : number, y : number)
        {
            super(state);
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x+1, y);
            this.addBlock(this.blockColor, x+2, y);
            this.addBlock(this.blockColor, x, y+1);

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

    }

    export class ShapeS extends Shape {

        private blockColor : string = 'green';

        constructor(state: Kiwi.State, x : number, y : number)
        {
            super(state);
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x+1, y);
            this.addBlock(this.blockColor, x, y+1);
            this.addBlock(this.blockColor, x-1, y + 1);

        }

    }

    export class ShapeT extends Shape {

        private blockColor : string = 'purple';

        constructor(state: Kiwi.State, x : number, y : number)
        {
            super(state);
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x+1, y);
            this.addBlock(this.blockColor, x+2, y);
            this.addBlock(this.blockColor, x+1, y + 1);

        }

    }

    export class ShapeZ extends Shape {

        private blockColor : string = 'red';

        constructor(state: Kiwi.State, x : number, y : number)
        {
            super(state);
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x+1, y);
            this.addBlock(this.blockColor, x+1, y+1);
            this.addBlock(this.blockColor, x+2, y + 1);

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
