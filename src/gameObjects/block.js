/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../config.ts" />
/// <reference path="position.ts" />
var Tetris;
(function (Tetris) {
    var Block = (function () {
        function Block(x, y, state, texture) {
            this.size = Tetris.Config.tileSize;
            this.x = x;
            this.y = y;
            console.log(Tetris.Config.offsetY);
            if (texture) {
                this.sprite = new Kiwi.GameObjects.Sprite(state, texture, Tetris.Config.offsetX + Tetris.Config.borderWidth + x * (this.size - 1), Tetris.Config.offsetY + Tetris.Config.borderWidth + y * (this.size - 1));
            }
        }
        Block.prototype.fall = function (amountOfTiles) {
            if (amountOfTiles === void 0) { amountOfTiles = 1; }
            this.y += amountOfTiles;
            if (this.sprite) {
                this.sprite.transform.y += amountOfTiles * (this.size - 1);
            }
        };
        Block.prototype.move = function (side) {
            this.x += side;
            if (this.sprite) {
                this.sprite.transform.x += side * (this.size - 1);
            }
        };
        Block.prototype.setPosition = function (x, y) {
            var xDiff = x - this.x;
            var yDiff = y - this.y;
            this.x = x;
            this.y = y;
            if (this.sprite) {
                this.sprite.transform.x += xDiff * (this.size - 1);
                this.sprite.transform.y += yDiff * (this.size - 1);
            }
        };
        Block.prototype.getPosition = function () {
            return new Tetris.Position(this.x, this.y);
        };
        Block.prototype.destroy = function () {
            if (this.sprite) {
                this.sprite.destroy();
            }
        };
        return Block;
    })();
    Tetris.Block = Block;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=block.js.map