/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />
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
        var ShapeO = (function (_super) {
            __extends(ShapeO, _super);
            function ShapeO(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'yellow';
                this.name = 'ShapeO';
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
        })(Shapes.Shape);
        Shapes.ShapeO = ShapeO;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
//# sourceMappingURL=shapeO.js.map