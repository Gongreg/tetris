/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../../lib/kiwi.d.ts" />
/// <reference path="../block.ts" />
var Tetris;
(function (Tetris) {
    var Shapes;
    (function (Shapes) {
        var Shape = (function () {
            function Shape(state) {
                //status for rotation
                this.currentRotation = 0;
                this.currentTest = 0;
                this.nextPositions = [];
                this.blocks = [];
                this.state = state;
                this.gameObject = new Kiwi.Group(state);
            }
            //add block into the shape
            Shape.prototype.addBlock = function (blockColor, x, y, center) {
                if (center === void 0) { center = false; }
                var block = new Tetris.Block(x, y, this.state, this.state.textures['block-' + blockColor]);
                this.blocks.push(block);
                this.gameObject.addChild(block.sprite);
                if (center) {
                    this.center = block;
                }
            };
            Shape.prototype.getGameObject = function () {
                return this.gameObject;
            };
            Shape.prototype.getBlocks = function () {
                return this.blocks;
            };
            Shape.prototype.destroy = function () {
                this.getBlocks().forEach(function (block) { return block.destroy(); });
            };
            //get blocks position
            Shape.prototype.getPositions = function (blocks) {
                if (blocks === void 0) { blocks = this.blocks; }
                return blocks.map(function (block) {
                    return block.getPosition();
                });
            };
            Shape.prototype.fall = function (amountOfTiles) {
                var _this = this;
                if (amountOfTiles === void 0) { amountOfTiles = 1; }
                this.blocks.forEach(function (block) {
                    if (block == _this.center) {
                        return true;
                    }
                    block.fall(amountOfTiles);
                });
                this.center.fall(amountOfTiles);
                return this;
            };
            Shape.prototype.move = function (side) {
                var _this = this;
                this.blocks.forEach(function (block) {
                    if (block == _this.center) {
                        return true;
                    }
                    block.move(side);
                });
                this.center.move(side);
                return this;
            };
            Shape.prototype.getRotations = function () {
                return Shape.rotations;
            };
            Shape.prototype.getNextRotation = function (direction) {
                var nextPositions = [];
                //if we checked all possibilities, return nothing
                if (this.currentTest == 5) {
                    this.currentTest = 0;
                    return nextPositions;
                }
                var rotations = this.getRotations();
                var centerX = this.center.x;
                var centerY = this.center.y;
                var xMargin = direction * rotations[this.currentRotation][this.currentTest][0];
                var yMargin = direction * rotations[this.currentRotation][this.currentTest][1];
                //set center positions, so we don't lose it during rotation
                var nextCenter = new Tetris.Position(centerX + xMargin, centerY + yMargin);
                this.blocks.forEach(function (block) {
                    var xDiff = direction * (block.x - centerX);
                    var yDiff = direction * (block.y - centerY);
                    nextPositions.push(new Tetris.Position(nextCenter.x - yDiff, nextCenter.y + xDiff));
                });
                this.nextCenter = nextCenter;
                this.nextPositions = nextPositions;
                this.direction = direction;
                //increate test amount
                this.currentTest++;
                return nextPositions;
            };
            Shape.prototype.rotate = function () {
                var _this = this;
                //if we want to ratate without checking
                if (!this.nextCenter) {
                    this.getNextRotation(1);
                }
                this.center.setPosition(this.nextCenter.x, this.nextCenter.y);
                this.blocks.forEach(function (block, index) {
                    //if c block is in center position, it is already set
                    if (block == _this.center) {
                        return true;
                    }
                    block.setPosition(_this.nextPositions[index].x, _this.nextPositions[index].y);
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
            };
            //rotations for J L T Z S Pieces
            Shape.rotations = [
                [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
                [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
                [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
                [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
            ];
            return Shape;
        })();
        Shapes.Shape = Shape;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
//# sourceMappingURL=shape.js.map