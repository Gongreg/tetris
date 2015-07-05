/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../config.ts" />
/// <reference path="position.ts" />

module Tetris {

    export class Block {

        public x: number;
        public y: number;

        public sprite: Kiwi.GameObjects.Sprite;

        protected size: number = Config.tileSize;

        constructor(x :number, y : number, state: Kiwi.State, texture: any)
        {
            this.x = x;
            this.y = y;

            if (texture) {
                this.sprite = new Kiwi.GameObjects.Sprite(
                    state,
                    texture,
                    Config.offsetX  + Config.borderWidth + x * (this.size - 1),
                    Config.offsetY + Config.borderWidth + y * (this.size - 1)
                );
            }
        }

        public fall(amountOfTiles : number = 1)
        {
            this.y += amountOfTiles;

            if (this.sprite) {
                this.sprite.transform.y += amountOfTiles * (this.size - 1);
            }

        }

        public move(side:number)
        {
            this.x += side;

            if (this.sprite) {
                this.sprite.transform.x += side * (this.size - 1);
            }

        }

        public setPosition(x:number, y:number)
        {

            var xDiff: number = x - this.x;
            var yDiff: number = y - this.y;

            this.x = x;
            this.y = y;

            if (this.sprite) {
                this.sprite.transform.x += xDiff * (this.size - 1);
                this.sprite.transform.y += yDiff * (this.size - 1);
            }

        }

        public getPosition()
        {
            return new Position(this.x, this.y);
        }

        public destroy()
        {
            if (this.sprite) {
                this.sprite.destroy();
            }
        }
    }

}