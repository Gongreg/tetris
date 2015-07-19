var Tetris;
(function (Tetris) {
    var Position = (function () {
        function Position(x, y) {
            this.x = x;
            this.y = y;
        }
        Position.prototype.isLower = function (position) {
            return this.y > position.y;
        };
        return Position;
    })();
    Tetris.Position = Position;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=position.js.map