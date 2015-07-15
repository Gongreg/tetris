var Tetris;
(function (Tetris) {
    var Config = (function () {
        function Config() {
        }
        Config.borderWidth = 4;
        Config.tileSize = 30;
        Config.offsetX = 40;
        Config.offsetY = -2 * (Config.tileSize - 1);
        Config.boardWidth = 10;
        Config.boardWidthInPixels = Config.offsetX + Config.borderWidth * 2 + Config.boardWidth * Config.tileSize;
        Config.boardHeight = 22;
        return Config;
    })();
    Tetris.Config = Config;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=config.js.map