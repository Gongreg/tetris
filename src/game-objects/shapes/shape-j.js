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
        var ShapeJ = (function (_super) {
            __extends(ShapeJ, _super);
            function ShapeJ(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'blue';
                this.name = 'ShapeJ';
                this.addBlock(this.blockColor, x - 1, y - 1);
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x + 1, y);
            }
            return ShapeJ;
        })(Shapes.Shape);
        Shapes.ShapeJ = ShapeJ;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
//# sourceMappingURL=shapeJ.js.map