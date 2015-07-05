/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../gameObjects/shape.ts" />
/// <reference path="../gameObjects/board.ts" />
/// <reference path="../enums.ts" />
/// <reference path="../config.ts" />
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
            //Moving to left and right
            this.moving = false;
            //rotating
            this.rotating = false;
            this.rotationDirection = 0;
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
            _super.prototype.preload.call(this);
            this.addImage('board', 'assets/img/board.png');
            this.addImage('borders', 'assets/img/borders.png');
            for (var index in this.blocks) {
                var color = this.blocks[index];
                this.addImage('block-' + color, 'assets/img/block-' + color + '.png');
            }
        };
        MainState.prototype.moveControls = function () {
            var left = this.leftKey.isDown;
            var right = this.rightKey.isDown;
            var direction = right ? 1 /* Right */ : -1 /* Left */;
            if ((left || right) && !this.moving && this.board.emptyDirection(this.currentShape.getBlocks(), direction)) {
                this.moving = true;
                this.board.setBlocks(this.currentShape.getBlocks(), 0 /* Empty */);
                this.currentShape.move(direction);
                this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
                this.moveTimer.start();
            }
        };
        MainState.prototype.resetMoving = function () {
            this.moving = false;
        };
        MainState.prototype.rotate = function (direction) {
            this.board.setBlocks(this.currentShape.getBlocks(), 2 /* CurrentShape */);
            var positions = this.currentShape.getNextRotation(direction);
            var rotated = false;
            while (positions.length > 0) {
                console.log(positions);
                if (this.board.emptyPositions(positions)) {
                    rotated = true;
                    this.board.setBlocks(this.currentShape.getBlocks(), 0 /* Empty */);
                    this.currentShape.rotate();
                    this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
                    break;
                }
                if (rotated) {
                    break;
                }
                positions = this.currentShape.getNextRotation(direction);
            }
            this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
            return rotated;
        };
        //drop down event
        MainState.prototype.fallDown = function () {
            //try to fall down
            if (this.board.emptyDirection(this.currentShape.getBlocks(), 4 /* Down */)) {
                this.board.setBlocks(this.currentShape.getBlocks(), 0 /* Empty */);
                this.currentShape.fall();
                this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
                return;
            }
            ////try to clear the rows in which blocks exist
            this.board.checkRows(this.currentShape.getBlocks());
            //create empty shape
            this.createEmptyShape();
            //if we can create shape add it into the game
            if (this.board.emptyPositions(this.currentShape.getPositions())) {
                this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
                this.addChild(this.currentShape.getGameObject());
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
            if (this.spaceKey.justPressed(10)) {
            }
        };
        MainState.prototype.fallTimerControls = function () {
            //delay if pressing down arrow
            this.fallTimer.delay = 0.5;
            if (this.downKey.isDown) {
                this.fallTimer.delay = 0.001;
            }
        };
        MainState.prototype.update = function () {
            _super.prototype.update.call(this);
            this.moveControls();
            this.rotationControls();
            this.dropDownControls();
            this.fallTimerControls();
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
        MainState.prototype.getFromShapeStack = function () {
            if (this.shapeStack.length == 0) {
                var tempArray = this.shapes.slice(0);
                for (var index in tempArray) {
                    tempArray[index] = 'Shape' + tempArray[index];
                }
                this.shapeStack = MainState.shuffle(tempArray);
            }
            return this.shapeStack.pop();
        };
        MainState.prototype.createEmptyShape = function (shapeName, x, y) {
            if (shapeName === void 0) { shapeName = ''; }
            if (x === void 0) { x = 4; }
            if (y === void 0) { y = -1; }
            if (shapeName.length == 0) {
                shapeName = this.getFromShapeStack();
            }
            this.currentShape = new Tetris.Shapes[shapeName](this, x, y);
        };
        MainState.prototype.createNewShape = function (shapeName, x, y) {
            if (shapeName === void 0) { shapeName = ''; }
            if (x === void 0) { x = 4; }
            if (y === void 0) { y = -1; }
            if (shapeName.length == 0) {
                shapeName = this.getFromShapeStack();
            }
            this.currentShape = new Tetris.Shapes[shapeName](this, x, y);
            this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
            this.addChild(this.currentShape.getGameObject());
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
            this.spaceKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);
            //move timer for limiting move amount
            this.moveTimer = this.game.time.clock.createTimer('move', 0.1, 0);
            this.moveTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.resetMoving, this);
            //board
            this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.borders, Tetris.Config.offsetX, Tetris.Config.offsetY));
            this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.board, Tetris.Config.offsetX + Tetris.Config.borderWidth, Tetris.Config.offsetY + Tetris.Config.borderWidth));
            this.board = new Tetris.Board();
            for (var i = 0; i < 10; i++) {
                var blockNumber = new Kiwi.GameObjects.TextField(this, i.toString(), 45 + 29 * i, 30, "#000000", 30);
                this.addChild(blockNumber);
            }
            for (var i = 0; i < 20; i++) {
                var blockNumber = new Kiwi.GameObjects.TextField(this, i.toString(), 0, 80 + 29 * i, "#000000", 30);
                this.addChild(blockNumber);
            }
            //drop the first shape
            this.createNewShape();
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