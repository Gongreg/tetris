/**
 * Created by Gytis on 2015-07-05.
 */
/// <reference path="./game-objects/shapes/shape.ts" />
/// <reference path="../lib/kiwi.d.ts" />
/// <reference path="config.ts" />
/// <reference path="scoring-manager.ts" />
var Tetris;
(function (Tetris) {
    var Hud = (function () {
        function Hud(state, scoringManager, level, score, lines) {
            this.state = state;
            this.levelObject = level;
            this.scoreObject = score;
            this.linesObject = lines;
            this.scoringManager = scoringManager;
        }
        Hud.prototype.updateScore = function () {
            var info = this.scoringManager.getInfo();
            this.scoreObject.text = info.score.toString();
            this.levelObject.text = info.level.toString();
            this.linesObject = info.lines.toString();
        };
        Hud.setUpSprite = function (shape, shapeName, marginX, marginY) {
            var gameObject = shape.getGameObject();
            if (shapeName == 'ShapeI') {
                shape.rotate().rotate();
                marginX -= 20;
                marginY -= 15;
            }
            if (shapeName == 'ShapeO') {
                marginX -= 10;
                marginY += 4;
            }
            gameObject.y = marginY;
            gameObject.x = marginX;
            gameObject.scale = 0.7;
            return gameObject;
        };
        Hud.prototype.setNextShape = function (shapeName) {
            if (this.nextShape) {
                this.nextShape.getGameObject().destroy();
            }
            this.nextShape = new Tetris.Shapes[shapeName](this.state, 0, 0);
            if (shapeName == 'ShapeI') {
                this.nextShape.rotate();
                this.nextShape.rotate();
            }
            this.state.addChild(Hud.setUpSprite(this.nextShape, shapeName, Tetris.Config.boardWidthInPixels - 6, 285));
        };
        Hud.prototype.setHeldShape = function (shapeName) {
            if (this.heldShape) {
                this.heldShape.getGameObject().destroy();
            }
            this.heldShape = new Tetris.Shapes[shapeName](this.state, 0, 0);
            if (shapeName == 'ShapeI') {
                this.heldShape.rotate();
                this.heldShape.rotate();
            }
            this.state.addChild(Hud.setUpSprite(this.heldShape, shapeName, Tetris.Config.boardWidthInPixels - 6, 435));
        };
        return Hud;
    })();
    Tetris.Hud = Hud;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=hud.js.map