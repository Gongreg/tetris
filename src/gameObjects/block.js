/**
 * Created by Gytis on 2015-05-22.
 */
/// <reference path="../../lib/kiwi.d.ts" />
var Block = (function () {
    function Block(x, y, state, texture) {
        this.size = 30;
        this.x = x;
        this.y = y;
        if (texture) {
            this.sprite = new Kiwi.GameObjects.Sprite(state, texture, 4 + x * (this.size - 1), 84 + y * (this.size - 1));
        }
    }
    Block.prototype.fall = function () {
        this.y++;
        if (this.sprite) {
            this.sprite.transform.y += this.size - 1;
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
    Block.prototype.destroy = function () {
        if (this.sprite) {
            this.sprite.destroy();
        }
    };
    return Block;
})();
//# sourceMappingURL=block.js.map