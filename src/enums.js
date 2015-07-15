var Tetris;
(function (Tetris) {
    (function (BlockStatus) {
        BlockStatus[BlockStatus["Empty"] = 0] = "Empty";
        BlockStatus[BlockStatus["Taken"] = 1] = "Taken";
    })(Tetris.BlockStatus || (Tetris.BlockStatus = {}));
    var BlockStatus = Tetris.BlockStatus;
    (function (Direction) {
        Direction[Direction["Left"] = -1] = "Left";
        Direction[Direction["Right"] = 1] = "Right";
        Direction[Direction["Up"] = 2] = "Up";
        Direction[Direction["Down"] = 4] = "Down";
    })(Tetris.Direction || (Tetris.Direction = {}));
    var Direction = Tetris.Direction;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=enums.js.map