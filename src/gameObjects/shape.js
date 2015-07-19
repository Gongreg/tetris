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
            Shape.prototype.getRowOfLowestInColumn = function (column, blocks) {
                return blocks.reduce(function (row, block) {
                    return block.x === column && block.y > row ? block.y : row;
                }, blocks[0].y);
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
                //if we checked all posibilities, return nothing
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
                this.addBlock(this.blockColor, x, y - 1);
                this.addBlock(this.blockColor, x, y);
                this.addBlock(this.blockColor, x + 1, y - 1);
                this.addBlock(this.blockColor, x + 1, y);
                this.addCenter(x - 0.5, y - 0.5);
            }
            //No need to do anything
            ShapeO.prototype.rotate = function () {
                return this;
            };
            //No need to do anything
            ShapeO.prototype.getNextRotation = function () {
                return [];
            };
            ShapeO.prototype.addCenter = function (x, y) {
                this.center = new Tetris.Block(x, y, this.state, null);
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