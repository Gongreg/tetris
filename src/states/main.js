/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../gameObjects/shape.ts" />
/// <reference path="../gameObjects/ghost.ts" />
/// <reference path="../gameObjects/board.ts" />
/// <reference path="../enums.ts" />
/// <reference path="../config.ts" />
/// <reference path="../hud.ts" />
/// <reference path="../scoring.ts" />
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
            this.moving = false;
            //rotating
            this.rotating = false;
            this.rotationDirection = 0;
            //dropping
            this.dropping = false;
            //private scoring: Scoring;
            this.level = 1;
            this.rowsCleared = 0;
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
            //block shapes for classes
            this.shapes = [
                'I',
                'J',
                'L',
                'O',
                'S',
                'T',
                'Z'
            ];
            this.shapeStack = [];
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
            if ((left || right) && !this.moving && this.board.emptyDirection(this.currentShape.getBlocks(), direction)) {
                this.moving = true;
                this.currentShape.move(direction);
                this.ghost.setPositions(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));
                this.moveTimer.start();
            }
        };
        MainState.prototype.resetMoving = function () {
            this.moving = false;
        };
        MainState.prototype.rotate = function (direction) {
            var positions = this.currentShape.getNextRotation(direction);
            var rotated = false;
            while (positions.length > 0) {
                if (this.board.emptyPositions(positions)) {
                    rotated = true;
                    this.currentShape.rotate();
                    this.ghost.setPositions(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));
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
                //console.log('falldown Before: ' + this.currentShape.getBlocks()[0].y);
                this.currentShape.fall(amountOfTiles);
                //console.log('falldown After: ' + this.currentShape.getBlocks()[0].y);
                if (!forceCheck) {
                    return;
                }
            }
            //set blocks as used, since we are creating new shape
            this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
            ////try to clear the rows in which blocks exist
            var rowsCleared = this.board.checkRows(this.currentShape.getBlocks());
            if (rowsCleared > 0) {
                this.rowsCleared += rowsCleared;
                this.hud.addScore(this.level * rowsCleared);
            }
            if (this.rowsCleared > 10 * this.level) {
                this.level++;
            }
            //create empty shape
            this.createNewShape();
            //if we can create shape add it into the game
            if (this.board.emptyPositions(this.currentShape.getPositions())) {
                this.canHold = true;
                this.addChild(this.currentShape.getGameObject());
                this.ghost.setPositions(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));
                return;
            }
            console.log('gg');
            //if unable to create new shape gg
        };
        MainState.prototype.rotationControls = function () {
            //rotation controls
            if (this.xKey.isDown) {
                this.rotationDirection = 1 /* Right */;
            }
            else if (this.zKey.isDown) {
                this.rotationDirection = -1 /* Left */;
            }
            else if (this.upKey.isDown) {
                this.rotationDirection = 2 /* Up */;
            }
            if (this.rotationDirection !== 0 && !this.rotating) {
                this.rotating = true;
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
            if ((this.rotationDirection == -1 /* Left */ && this.zKey.isUp) || (this.rotationDirection == 1 /* Right */ && this.xKey.isUp) || (this.rotationDirection == 2 /* Up */ && this.upKey.isUp)) {
                this.rotating = false;
                this.rotationDirection = 0;
            }
        };
        MainState.prototype.dropDownControls = function () {
            if (this.dropKey.isDown && !this.dropping) {
                this.dropping = true;
                var amountOfTiles = this.board.findDistanceToFall(this.currentShape.getPositions());
                this.fallDown(amountOfTiles, true);
            }
            if (this.dropKey.isUp && this.dropping) {
                this.dropping = false;
            }
        };
        MainState.prototype.fallTimerControls = function () {
            //delay if pressing down arrow
            this.fallTimer.delay = 0.5;
            if (this.downKey.isDown) {
                this.fallTimer.delay = 0.001;
            }
        };
        MainState.prototype.holdControls = function () {
            if (this.holdKey.isDown && !this.holdKeyIsDown && this.canHold) {
                this.holdKeyIsDown = true;
                var heldShapeName = this.heldShape ? this.heldShape : '';
                this.heldShape = this.currentShape.name;
                this.hud.setHeldShape(this.heldShape);
                this.currentShape.destroy();
                this.createNewShape(true, heldShapeName);
                this.ghost.setPositions(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));
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
        };
        /**
         * @author http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
         */
        MainState.shuffle = function (array) {
            var counter = array.length, temp, index;
            while (counter > 0) {
                // Pick a random index
                index = Math.floor(Math.random() * counter);
                // Decrease counter by 1
                counter--;
                // And swap the last element with it
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        };
        MainState.prototype.checkShapeStack = function () {
            if (this.shapeStack.length < 2) {
                var tempArray = this.shapes.slice(0);
                tempArray.forEach(function (element, index) { return tempArray[index] = 'Shape' + element; });
                this.shapeStack = this.shapeStack.concat(MainState.shuffle(tempArray));
            }
        };
        MainState.prototype.getNextShape = function (pop) {
            if (pop === void 0) { pop = false; }
            this.checkShapeStack();
            return pop ? this.shapeStack.shift() : this.shapeStack[0];
        };
        MainState.prototype.createNewShape = function (addToGame, shapeName, x, y, debug) {
            if (addToGame === void 0) { addToGame = false; }
            if (shapeName === void 0) { shapeName = ''; }
            if (x === void 0) { x = 4; }
            if (y === void 0) { y = 1; }
            if (debug === void 0) { debug = false; }
            if (shapeName.length == 0) {
                shapeName = this.getNextShape(true);
            }
            this.currentShape = new Tetris.Shapes[shapeName](this, x, y);
            if (debug) {
                this.board.setBlocks(this.currentShape.getBlocks());
            }
            if (addToGame) {
                this.addChild(this.currentShape.getGameObject());
            }
            this.hud.setNextShape(this.getNextShape());
        };
        MainState.prototype.create = function () {
            _super.prototype.create.call(this);
            //controls
            this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
            this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
            this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);
            this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
            this.zKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.Z);
            this.xKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.X);
            this.dropKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);
            this.holdKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SHIFT);
            //board sprites
            // Add score text to the state
            var scoreText = new Kiwi.GameObjects.TextField(this, "Score", Tetris.Config.boardWidthInPixels, 0, "#000", 24);
            this.addChild(scoreText);
            var score = new Kiwi.GameObjects.TextField(this, "0", Tetris.Config.boardWidthInPixels, 25, "#000", 24);
            this.addChild(score);
            var boardTiles = new Kiwi.GameObjects.StaticImage(this, this.textures.board, Tetris.Config.offsetX + Tetris.Config.borderWidth, Tetris.Config.borderWidth);
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
            this.board = new Tetris.Board();
            this.hud = new Tetris.Hud(this, score);
            //drop the first shape
            this.createNewShape(true);
            //set its ghost
            this.ghost = new Tetris.Ghost(this, this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));
            this.addChildBefore(this.ghost.getGameObject(), borders);
            //move timer for limiting move amount
            this.moveTimer = this.game.time.clock.createTimer('move', 0.1, 0);
            this.moveTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.resetMoving, this);
            //add drop timer
            this.fallTimer = this.game.time.clock.createTimer('fall', 0.5, 0);
            this.fallTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.fallDown, this);
            this.fallTimer.start();
        };
        return MainState;
    })(Kiwi.State);
    Tetris.MainState = MainState;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=main.js.map