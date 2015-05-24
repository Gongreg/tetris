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
var Shapes;
(function (Shapes) {
    var Shape = (function () {
        function Shape(state) {
            this.cubeSize = 30;
            this.blocks = [];
            this.state = state;
            this.gameObject = new Kiwi.Group(state);
        }
        Shape.prototype.addBlock = function (texture, x, y) {
            var block = new Block(x, y, this.state, this.state.textures['block-' + texture]);
            this.blocks.push(block);
            this.gameObject.addChild(block.sprite);
        };
        Shape.prototype.getGameObject = function () {
            return this.gameObject;
        };
        Shape.prototype.getBlocks = function () {
            return this.blocks;
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
        return Shape;
    })();
    Shapes.Shape = Shape;
    var ShapeI = (function (_super) {
        __extends(ShapeI, _super);
        function ShapeI(state, x, y) {
            _super.call(this, state);
            this.blockColor = 'cyan';
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x + 1, y);
            this.addBlock(this.blockColor, x + 2, y);
            this.addBlock(this.blockColor, x + 3, y);
        }
        return ShapeI;
    })(Shape);
    Shapes.ShapeI = ShapeI;
    var ShapeJ = (function (_super) {
        __extends(ShapeJ, _super);
        function ShapeJ(state, x, y) {
            _super.call(this, state);
            this.blockColor = 'blue';
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x + 1, y);
            this.addBlock(this.blockColor, x + 2, y);
            this.addBlock(this.blockColor, x + 2, y + 1);
        }
        return ShapeJ;
    })(Shape);
    Shapes.ShapeJ = ShapeJ;
    var ShapeL = (function (_super) {
        __extends(ShapeL, _super);
        function ShapeL(state, x, y) {
            _super.call(this, state);
            this.blockColor = 'orange';
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x + 1, y);
            this.addBlock(this.blockColor, x + 2, y);
            this.addBlock(this.blockColor, x, y + 1);
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
        return ShapeO;
    })(Shape);
    Shapes.ShapeO = ShapeO;
    var ShapeS = (function (_super) {
        __extends(ShapeS, _super);
        function ShapeS(state, x, y) {
            _super.call(this, state);
            this.blockColor = 'green';
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x + 1, y);
            this.addBlock(this.blockColor, x, y + 1);
            this.addBlock(this.blockColor, x - 1, y + 1);
        }
        return ShapeS;
    })(Shape);
    Shapes.ShapeS = ShapeS;
    var ShapeT = (function (_super) {
        __extends(ShapeT, _super);
        function ShapeT(state, x, y) {
            _super.call(this, state);
            this.blockColor = 'purple';
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x + 1, y);
            this.addBlock(this.blockColor, x + 2, y);
            this.addBlock(this.blockColor, x + 1, y + 1);
        }
        return ShapeT;
    })(Shape);
    Shapes.ShapeT = ShapeT;
    var ShapeZ = (function (_super) {
        __extends(ShapeZ, _super);
        function ShapeZ(state, x, y) {
            _super.call(this, state);
            this.blockColor = 'red';
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x + 1, y);
            this.addBlock(this.blockColor, x + 1, y + 1);
            this.addBlock(this.blockColor, x + 2, y + 1);
        }
        return ShapeZ;
    })(Shape);
    Shapes.ShapeZ = ShapeZ;
    var ShapeLol = (function (_super) {
        __extends(ShapeLol, _super);
        function ShapeLol(state, x, y) {
            _super.call(this, state);
            this.blockColor = 'red';
            this.addBlock(this.blockColor, x, y);
            this.addBlock(this.blockColor, x, y + 1);
            this.addBlock(this.blockColor, x, y + 2);
            this.addBlock(this.blockColor, x, y + 3);
        }
        return ShapeLol;
    })(Shape);
    Shapes.ShapeLol = ShapeLol;
})(Shapes || (Shapes = {}));
//# sourceMappingURL=shape.js.map