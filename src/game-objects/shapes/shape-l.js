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
        var ShapeL = (function (_super) {
            __extends(ShapeL, _super);
            function ShapeL(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'orange';
                this.name = 'ShapeL';
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x + 1, y);
                this.addBlock(this.blockColor, x + 1, y - 1);
            }
            return ShapeL;
        })(Shapes.Shape);
        Shapes.ShapeL = ShapeL;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
//# sourceMappingURL=shapeL.js.map