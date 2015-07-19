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
        var ShapeT = (function (_super) {
            __extends(ShapeT, _super);
            function ShapeT(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'purple';
                this.name = 'ShapeT';
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x, y - 1);
                this.addBlock(this.blockColor, x + 1, y);
            }
            return ShapeT;
        })(Shapes.Shape);
        Shapes.ShapeT = ShapeT;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
//# sourceMappingURL=shapeT.js.map