/**
 * Created by Gytis on 2015-05-22.
 */
/// <reference path="../../lib/kiwi.d.ts" />
var Block = (function () {
    function Block(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }
    Block.prototype.fall = function () {
        this.y++;
    };
    Block.prototype.move = function (side) {
        this.x += side;
    };
    return Block;
})();
//# sourceMappingURL=block.js.map