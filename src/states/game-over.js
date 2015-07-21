/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../config.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Tetris;
(function (Tetris) {
    var GameOverState = (function (_super) {
        __extends(GameOverState, _super);
        function GameOverState() {
            _super.apply(this, arguments);
        }
        GameOverState.prototype.update = function () {
            if (this.game.input.mouse.isDown) {
                this.game.states.switchState('main');
            }
        };
        GameOverState.prototype.create = function (score, level, lines) {
            _super.prototype.create.call(this);
            this.addChild(new Kiwi.GameObjects.TextField(this, "Game Over!", Tetris.Config.boardWidthInPixels / 2, 100, "#000", 30));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Score", Tetris.Config.boardWidthInPixels / 2, 150, "#000", 24));
            this.addChild(new Kiwi.GameObjects.TextField(this, score.toString(), Tetris.Config.boardWidthInPixels / 2, 175, "#000", 24));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Lines", Tetris.Config.boardWidthInPixels / 2, 200, "#000", 24));
            this.addChild(new Kiwi.GameObjects.TextField(this, lines.toString(), Tetris.Config.boardWidthInPixels / 2, 225, "#000", 24));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Level", Tetris.Config.boardWidthInPixels / 2, 250, "#000", 24));
            this.addChild(new Kiwi.GameObjects.TextField(this, level.toString(), Tetris.Config.boardWidthInPixels / 2, 275, "#000", 24));
            this.addChild(new Kiwi.GameObjects.TextField(this, 'Play again', Tetris.Config.boardWidthInPixels / 2, 350, "#000", 24));
            this.getAllChildren().forEach(function (children) { return children.textAlign = 'center'; });
        };
        return GameOverState;
    })(Kiwi.State);
    Tetris.GameOverState = GameOverState;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=game-over.js.map