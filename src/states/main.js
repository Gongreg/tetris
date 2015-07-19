/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../game-objects/shapes/shape.ts" />
/// <reference path="../game-objects/shapes/shape-stack.ts" />
/// <reference path="../game-objects/ghost.ts" />
/// <reference path="../game-objects/board.ts" />
/// <reference path="../enums.ts" />
/// <reference path="../config.ts" />
/// <reference path="../hud.ts" />
/// <reference path="../scoring-manager.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Tetris;
(function (Tetris) {
    var MainState = (function (_super) {
        __extends(MainState, _super);
        function MainState() {
            _super.apply(this, arguments);
            this.holdKeyIsDown = false;
            this.canHold = true;
            //Moving to left and right
            this.moveKeyIsDown = false;
            this.rotateKeyIsDown = false;
            this.rotationDirection = 0;
            //dropping
            this.dropping = false;
            //block colors for sprite loading
            this.blocks = [
                'blue',
                'cyan',
                'green',
                'orange',
                'purple',
                'red',
                'yellow'
            ];
        }
        MainState.prototype.preload = function () {
            var _this = this;
            _super.prototype.preload.call(this);
            this.addImage('board', 'assets/img/board.png');
            this.addImage('borders', 'assets/img/borders.png');
            this.addImage('hudBorders', 'assets/img/hud-borders.png');
            this.blocks.forEach(function (color) { return _this.addImage('block-' + color, 'assets/img/block-' + color + '.png'); });
            this.addImage('block-ghost', 'assets/img/block-ghost.png');
        };
        MainState.prototype.moveControls = function () {
            var left = this.leftKey.isDown;
            var right = this.rightKey.isDown;
            var direction = right ? 1 /* Right */ : -1 /* Left */;
            if ((left || right) && !this.moveKeyIsDown && this.board.emptyDirection(this.currentShape.getBlocks(), direction)) {
                this.moveKeyIsDown = true;
                this.currentShape.move(direction);
                this.ghost.setPosition(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));
                this.moveTimer.start();
            }
        };
        MainState.prototype.rotate = function (direction) {
            var positions = this.currentShape.getNextRotation(direction);
            var rotated = false;
            while (positions.length > 0) {
                if (this.board.emptyPositions(positions)) {
                    rotated = true;
                    this.currentShape.rotate();
                    this.ghost.setPosition(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));
                    break;
                }
                if (rotated) {
                    break;
                }
                positions = this.currentShape.getNextRotation(direction);
            }
            return rotated;
        };
        //drop down event
        MainState.prototype.fallDown = function (amountOfTiles, forceCheck) {
            if (amountOfTiles === void 0) { amountOfTiles = 1; }
            if (forceCheck === void 0) { forceCheck = false; }
            //try to fall down
            //amount of Tiles specified must be empty, because here I don't check tiles below
            if (this.board.emptyDirection(this.currentShape.getBlocks(), 4 /* Down */)) {
                //if soft drop is being done, add score
                if (this.fallTimer.delay === 0.01) {
                    this.scoringManager.addSoftDrop();
                }
                this.currentShape.fall(amountOfTiles);
                if (!forceCheck) {
                    return;
                }
            }
            //if shape can't fall down, set blocks into board and create new shape unless it is gg
            //set blocks as used, since we are creating new shape
            this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
            ////try to clear the rows in which blocks exist
            var rowsCleared = this.board.checkRows(this.currentShape.getBlocks());
            this.scoringManager.addRowsCleared(rowsCleared);
            //create empty shape
            this.createNewShape();
            //if we can create shape add it into the game
            if (this.board.emptyPositions(this.currentShape.getPositions())) {
                //allow to hold shape again
                this.canHold = true;
                this.addChild(this.currentShape.getGameObject());
                this.hud.setNextShape(this.shapeStack.getNextShape());
                this.ghost.setPosition(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));
                return;
            }
            this.game.states.switchState('gameOver', null, null, this.scoringManager.getInfo());
            //if unable to create new shape gg
        };
        MainState.prototype.rotationControls = function () {
            //rotation controls
            if (this.rotateCounterClockwiseKey.isDown) {
                this.rotationDirection = 1 /* Right */;
            }
            else if (this.rotateClockwiseKey.isDown) {
                this.rotationDirection = -1 /* Left */;
            }
            else if (this.rotateBothKey.isDown) {
                this.rotationDirection = 2 /* Up */;
            }
            if (this.rotationDirection !== 0 && !this.rotateKeyIsDown) {
                this.rotateKeyIsDown = true;
                //try to rotate both to right and left
                if (this.rotationDirection == 2 /* Up */) {
                    if (!this.rotate(1 /* Right */)) {
                        this.rotate(-1 /* Left */);
                    }
                }
                else {
                    this.rotate(this.rotationDirection);
                }
            }
            //reset rotation controls
            if ((this.rotationDirection == -1 /* Left */ && this.rotateClockwiseKey.isUp) || (this.rotationDirection == 1 /* Right */ && this.rotateCounterClockwiseKey.isUp) || (this.rotationDirection == 2 /* Up */ && this.rotateBothKey.isUp)) {
                this.rotateKeyIsDown = false;
                this.rotationDirection = 0;
            }
        };
        MainState.prototype.dropDownControls = function () {
            if (this.hardDropKey.isDown && !this.dropping) {
                this.dropping = true;
                var amountOfRows = this.board.findDistanceToFall(this.currentShape.getPositions());
                this.fallDown(amountOfRows, true);
                this.scoringManager.addHardDrop(amountOfRows);
            }
            if (this.hardDropKey.isUp && this.dropping) {
                this.dropping = false;
            }
        };
        MainState.prototype.fallTimerControls = function () {
            this.fallTimer.delay = this.scoringManager.getFallingDelay();
            if (this.softDropKey.isDown) {
                this.fallTimer.delay = 0.01;
            }
        };
        MainState.prototype.holdControls = function () {
            if (this.holdKey.isDown && !this.holdKeyIsDown && this.canHold) {
                this.holdKeyIsDown = true;
                var heldShapeName = this.heldShape ? this.heldShape : '';
                this.heldShape = this.currentShape.name;
                this.currentShape.destroy();
                this.createNewShape(true, heldShapeName);
                this.hud.setHeldShape(this.heldShape);
                this.ghost.setPosition(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));
                this.canHold = false;
            }
            if (this.holdKey.isUp && this.holdKeyIsDown) {
                this.holdKeyIsDown = false;
            }
        };
        MainState.prototype.update = function () {
            _super.prototype.update.call(this);
            this.moveControls();
            this.rotationControls();
            this.dropDownControls();
            this.fallTimerControls();
            this.holdControls();
            //keep falling down
            this.fallTimer.start();
            this.hud.updateScore();
        };
        MainState.prototype.createNewShape = function (addToGame, shapeName, x, y, debug) {
            if (addToGame === void 0) { addToGame = false; }
            if (shapeName === void 0) { shapeName = ''; }
            if (x === void 0) { x = 4; }
            if (y === void 0) { y = 1; }
            if (debug === void 0) { debug = false; }
            this.currentShape = this.shapeStack.createNewShape(addToGame, shapeName, x, y);
            if (debug) {
                this.board.setBlocks(this.currentShape.getBlocks());
            }
        };
        MainState.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            //controls
            this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
            this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
            this.softDropKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);
            this.rotateBothKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
            this.rotateClockwiseKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.Z);
            this.rotateCounterClockwiseKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.X);
            this.hardDropKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);
            this.holdKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SHIFT);
            //board sprites
            // Add score text to the state
            var scoreText = new Kiwi.GameObjects.TextField(this, "Score", Tetris.Config.boardWidthInPixels, 0, "#000", 24);
            this.addChild(scoreText);
            var score = new Kiwi.GameObjects.TextField(this, "0", Tetris.Config.boardWidthInPixels, 25, "#000", 24);
            this.addChild(score);
            var levelText = new Kiwi.GameObjects.TextField(this, "Level", Tetris.Config.boardWidthInPixels, 60, "#000", 24);
            this.addChild(levelText);
            var level = new Kiwi.GameObjects.TextField(this, "0", Tetris.Config.boardWidthInPixels, 85, "#000", 24);
            this.addChild(level);
            var boardTiles = new Kiwi.GameObjects.StaticImage(this, this.textures.board, Tetris.Config.offsetX + Tetris.Config.borderWidth, Tetris.Config.borderHeight);
            this.addChild(boardTiles);
            var borders = new Kiwi.GameObjects.StaticImage(this, this.textures.borders, Tetris.Config.offsetX, 0);
            this.addChild(borders);
            var nextShapeText = new Kiwi.GameObjects.TextField(this, "Next", Tetris.Config.boardWidthInPixels, 120, "#000", 24);
            this.addChild(nextShapeText);
            var nextShapeBorders = new Kiwi.GameObjects.StaticImage(this, this.textures.hudBorders, Tetris.Config.boardWidthInPixels + 20, 185);
            nextShapeBorders.scaleX = 2.5;
            nextShapeBorders.scaleY = 3.5;
            this.addChild(nextShapeBorders);
            var heldShapeText = new Kiwi.GameObjects.TextField(this, "Hold", Tetris.Config.boardWidthInPixels, 300, "#000", 24);
            this.addChild(heldShapeText);
            var heldShapeBorders = new Kiwi.GameObjects.StaticImage(this, this.textures.hudBorders, Tetris.Config.boardWidthInPixels + 20, 365);
            heldShapeBorders.scaleX = 2.5;
            heldShapeBorders.scaleY = 3.5;
            this.addChild(heldShapeBorders);
            //move timer for limiting move amount
            this.moveTimer = this.game.time.clock.createTimer('move', Tetris.Config.moveTimerRate, 0);
            this.moveTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, function () {
                _this.moveKeyIsDown = false;
            }, this);
            //add drop timer
            this.fallTimer = this.game.time.clock.createTimer('fall', 0.5, 0);
            this.fallTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.fallDown, this);
            this.board = new Tetris.Board();
            this.shapeStack = new Tetris.Shapes.ShapeStack(this);
            this.scoringManager = new Tetris.ScoringManager(1);
            this.hud = new Tetris.Hud(this, this.scoringManager, level, score);
            //drop the first shape
            this.createNewShape(true);
            this.hud.setNextShape(this.shapeStack.getNextShape());
            //set its ghost
            this.ghost = new Tetris.Ghost(this, this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));
            this.addChildBefore(this.ghost.getGameObject(), borders);
            this.fallTimer.start();
        };
        return MainState;
    })(Kiwi.State);
    Tetris.MainState = MainState;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=main.js.map