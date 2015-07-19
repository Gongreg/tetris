/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="block.ts" />
var Tetris;
(function (Tetris) {
    var Ghost = (function () {
        function Ghost(state, positions, lowerBy) {
            var _this = this;
            this.blocks = [];
            this.state = state;
            this.gameObject = new Kiwi.Group(state);
            positions.forEach(function (position) {
                var block = new Tetris.Block(position.x, position.y + lowerBy, _this.state, _this.state.textures['block-ghost']);
                _this.blocks.push(block);
                _this.gameObject.addChild(block.sprite);
            });
        }
        Ghost.prototype.getGameObject = function () {
            return this.gameObject;
        };
        Ghost.prototype.setPosition = function (positions, lowerBy) {
            this.blocks.forEach(function (block, index) {
                block.setPosition(positions[index].x, positions[index].y + lowerBy);
            });
        };
        return Ghost;
    })();
    Tetris.Ghost = Ghost;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=ghost.js.map