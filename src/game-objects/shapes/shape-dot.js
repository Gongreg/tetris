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
        var ShapeDot = (function (_super) {
            __extends(ShapeDot, _super);
            function ShapeDot(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'red';
                this.name = 'ShapeDot';
                this.addBlock(this.blockColor, x, y, true);
            }
            return ShapeDot;
        })(Shapes.Shape);
        Shapes.ShapeDot = ShapeDot;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
//# sourceMappingURL=shape-dot.js.map