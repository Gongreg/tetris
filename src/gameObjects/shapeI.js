/// <reference path="shape.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShapeI = (function (_super) {
    __extends(ShapeI, _super);
    function ShapeI(state, x, y) {
        _super.call(this, state);
        this.blockColor = 'blockcyan';
        this.addBlock(this.blockColor, x, y);
        this.addBlock(this.blockColor, x + 1, y);
        this.addBlock(this.blockColor, x + 2, y);
        this.addBlock(this.blockColor, x + 3, y);
    }
    return ShapeI;
})(Shape);
//# sourceMappingURL=shapeI.js.map