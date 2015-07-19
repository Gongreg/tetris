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
        var ShapeI = (function (_super) {
            __extends(ShapeI, _super);
            function ShapeI(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'cyan';
                this.name = 'ShapeI';
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
        })(Shapes.Shape);
        Shapes.ShapeI = ShapeI;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
//# sourceMappingURL=shapeI.js.map