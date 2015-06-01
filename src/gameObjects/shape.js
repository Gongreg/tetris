/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="block.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Tetris;
(function (Tetris) {
    var Shapes;
    (function (Shapes) {
        var Shape = (function () {
            function Shape(state) {
                //status for rotation
                this.currentRotation = 0;
                this.currentTest = 0;
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
            //get blocks position
            Shape.prototype.getPositions = function () {
                var positions = [];
                for (var i = 0; i < this.blocks.length; i++) {
                    var block = this.blocks[i];
                    positions.push(block.getPosition());
                }
                return positions;
            };
            Shape.prototype.fall = function () {
                for (var index in this.blocks) {
                    var block = this.blocks[index];
                    block.fall();
                }
            };
            Shape.prototype.move = function (side) {
                for (var index in this.blocks) {
                    var block = this.blocks[index];
                    block.move(side);
                }
            };
            Shape.prototype.getRotations = function () {
                return Shape.rotations;
            };
            Shape.prototype.getNextRotation = function (direction) {
                var rotations = this.getRotations();
                var nextPositions = [];
                if (this.currentTest == 5) {
                    this.currentTest = 0;
                    return nextPositions;
                }
                var xMargin = direction * rotations[this.currentRotation][this.currentTest][0];
                var yMargin = direction * rotations[this.currentRotation][this.currentTest][1];
                for (var index in this.blocks) {
                    var block = this.blocks[index];
                    var xDiff = block.x - this.center.x;
                    var yDiff = block.y - this.center.y;
                    nextPositions.push({
                        x: this.center.x - yDiff + xMargin,
                        y: this.center.y + xDiff - yMargin
                    });
                }
                this.currentTest++;
                return nextPositions;
            };
            Shape.prototype.rotate = function (direction) {
                var rotations = this.getRotations();
                var centerX = this.center.x;
                var centerY = this.center.y;
                var xMargin = direction * rotations[this.currentRotation][this.currentTest - 1][0];
                var yMargin = direction * rotations[this.currentRotation][this.currentTest - 1][1];
                for (var index in this.blocks) {
                    var block = this.blocks[index];
                    var xDiff = direction * (block.x - centerX);
                    var yDiff = direction * (block.y - centerY);
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
        //DIFFERENT SHAPES
        var ShapeI = (function (_super) {
            __extends(ShapeI, _super);
            function ShapeI(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'cyan';
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y);
                this.addBlock(this.blockColor, x + 1, y);
                this.addBlock(this.blockColor, x + 2, y);
                //invisible center
                this.addCenter(x + 0.5, y + 0.5);
            }
            //return specific rotations for this shape
            ShapeI.prototype.getRotations = function () {
                return ShapeI.rotations;
            };
            ShapeI.prototype.addCenter = function (x, y) {
                this.center = new Tetris.Block(x, y, this.state, null);
            };
            //need to move center too
            ShapeI.prototype.fall = function () {
                _super.prototype.fall.call(this);
                this.center.fall();
            };
            //need to move center too
            ShapeI.prototype.move = function (side) {
                _super.prototype.move.call(this, side);
                this.center.move(side);
            };
            //need to move center too
            ShapeI.prototype.rotate = function (direction) {
                var rotations = this.getRotations();
                var xMargin = direction * rotations[this.currentRotation][this.currentTest - 1][0];
                var yMargin = direction * rotations[this.currentRotation][this.currentTest - 1][1];
                _super.prototype.rotate.call(this, direction);
                this.center.setPosition(this.center.x + xMargin, this.center.y - yMargin);
            };
            ShapeI.rotations = [
                [[0, 0], [-2, 0], [+1, 0], [-2, -1], [+1, +2]],
                [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]],
                [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]],
                [[0, 0], [+1, 0], [-2, 0], [+1, -2], [-2, +1]],
            ];
            return ShapeI;
        })(Shape);
        Shapes.ShapeI = ShapeI;
        var ShapeJ = (function (_super) {
            __extends(ShapeJ, _super);
            function ShapeJ(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'blue';
                this.addBlock(this.blockColor, x - 1, y - 1);
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x + 1, y);
            }
            return ShapeJ;
        })(Shape);
        Shapes.ShapeJ = ShapeJ;
        var ShapeL = (function (_super) {
            __extends(ShapeL, _super);
            function ShapeL(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'orange';
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x + 1, y);
                this.addBlock(this.blockColor, x + 1, y - 1);
            }
            return ShapeL;
        })(Shape);
        Shapes.ShapeL = ShapeL;
        var ShapeO = (function (_super) {
            __extends(ShapeO, _super);
            function ShapeO(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'yellow';
                this.addBlock(this.blockColor, x, y);
                this.addBlock(this.blockColor, x, y + 1);
                this.addBlock(this.blockColor, x + 1, y);
                this.addBlock(this.blockColor, x + 1, y + 1);
            }
            //No need to do anything
            ShapeO.prototype.rotate = function () {
            };
            //No need to do anything
            ShapeO.prototype.getNextRotation = function () {
                return [];
            };
            return ShapeO;
        })(Shape);
        Shapes.ShapeO = ShapeO;
        var ShapeS = (function (_super) {
            __extends(ShapeS, _super);
            function ShapeS(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'green';
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x, y - 1);
                this.addBlock(this.blockColor, x + 1, y - 1);
            }
            return ShapeS;
        })(Shape);
        Shapes.ShapeS = ShapeS;
        var ShapeT = (function (_super) {
            __extends(ShapeT, _super);
            function ShapeT(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'purple';
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x, y - 1);
                this.addBlock(this.blockColor, x + 1, y);
            }
            return ShapeT;
        })(Shape);
        Shapes.ShapeT = ShapeT;
        var ShapeZ = (function (_super) {
            __extends(ShapeZ, _super);
            function ShapeZ(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'red';
                this.addBlock(this.blockColor, x - 1, y - 1);
                this.addBlock(this.blockColor, x, y - 1);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x + 1, y);
            }
            return ShapeZ;
        })(Shape);
        Shapes.ShapeZ = ShapeZ;
        var ShapeDot = (function (_super) {
            __extends(ShapeDot, _super);
            function ShapeDot(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'red';
                this.addBlock(this.blockColor, x, y, true);
            }
            return ShapeDot;
        })(Shape);
        Shapes.ShapeDot = ShapeDot;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
//# sourceMappingURL=shape.js.map