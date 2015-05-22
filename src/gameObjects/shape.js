/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="block.ts" />
var Shape = (function () {
    function Shape(state) {
        this.cubeSize = 30;
        this.blocks = [];
        this.state = state;
        this.gameObject = new Kiwi.Group(state);
    }
    Shape.prototype.addBlock = function (texture, x, y) {
        var sprite = new Kiwi.GameObjects.Sprite(this.state, this.state.textures[texture], 4 + x * (this.cubeSize - 1), 4 + y * (this.cubeSize - 1));
        this.blocks.push(new Block(x, y, sprite));
        this.gameObject.addChildAt(sprite, this.blocks.length - 1);
    };
    Shape.prototype.getGameObject = function () {
        return this.gameObject;
    };
    Shape.prototype.fall = function () {
        for (var index in this.blocks) {
            var block = this.blocks[index];
            block.fall();
            this.gameObject.getChildAt(index).transform.y += this.cubeSize - 1;
        }
    };
    Shape.prototype.move = function (side) {
        for (var index in this.blocks) {
            var block = this.blocks[index];
            block.move(side);
            this.gameObject.getChildAt(index).transform.x += side * (this.cubeSize - 1);
        }
    };
    return Shape;
})();
//# sourceMappingURL=shape.js.map