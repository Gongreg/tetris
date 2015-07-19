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

module Tetris {

    export class MainState extends Kiwi.State
    {

        private currentShape: Shapes.Shape;
        private ghost: Ghost;


        private borders;

        private fallTimer: Kiwi.Time.Timer;
        private moveTimer: Kiwi.Time.Timer;

        private leftKey: Kiwi.Input.Key;
        private rightKey: Kiwi.Input.Key;
        private downKey: Kiwi.Input.Key;
        private upKey: Kiwi.Input.Key;
        private zKey: Kiwi.Input.Key;
        private xKey: Kiwi.Input.Key;
        private spaceKey: Kiwi.Input.Key;

        //Moving to left and right
        private moving: boolean = false;

        //rotating
        private rotating: boolean = false;
        private rotationDirection: number = 0;

        //dropping
        private dropping: boolean = false;

        private board: Board;

        private hud: Hud;

        //private scoring: Scoring;

        private level: number = 1;

        private rowsCleared: number = 0;

        //block colors for sprite loading
        private blocks: string[] = [
            'blue',
            'cyan',
            'green',
            'orange',
            'purple',
            'red',
            'yellow'
        ];

        //block shapes for classes
        private shapes: string[] = [
            'I',
            'J',
            'L',
            'O',
            'S',
            'T',
            'Z'
        ];

        private shapeStack: string[] = [];

        preload()
        {
            super.preload();
            this.addImage('board', 'assets/img/board.png');
            this.addImage('borders', 'assets/img/borders.png');

            this.blocks.forEach(color => this.addImage('block-'+ color, 'assets/img/block-'+ color +'.png'));

            this.addImage('block-ghost', 'assets/img/block-ghost.png');

        }

        moveControls()
        {

            var left: boolean = this.leftKey.isDown;
            var right: boolean = this.rightKey.isDown;

            var direction = right ? Direction.Right: Direction.Left;

            if ((left || right) && !this.moving && this.board.emptyDirection(this.currentShape.getBlocks(), direction)) {
                this.moving = true;


                this.currentShape.move(direction);

                this.ghost.setPositions(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getBlocks()));

                this.moveTimer.start();

            }
        }

        resetMoving()
        {
            this.moving = false;
        }

        rotate(direction: number)
        {

            var positions: Position[] = this.currentShape.getNextRotation(direction);
            var rotated: boolean = false;
            while (positions.length > 0) {

                if (this.board.emptyPositions(positions)) {
                    rotated = true;

                    this.currentShape.rotate();
                    this.ghost.setPositions(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getBlocks()));

                    break;
                }

                if (rotated) {
                    break;
                }

                positions = this.currentShape.getNextRotation(direction);
            }


            return rotated;

        }

        //drop down event
        fallDown(amountOfTiles: number = 1, forceCheck: boolean = false)
        {
            //try to fall down
            //amount of Tiles specified must be empty, because here I don't check tiles below
            if (this.board.emptyDirection(this.currentShape.getBlocks(), Direction.Down)) {

                //console.log('falldown Before: ' + this.currentShape.getBlocks()[0].y);

                this.currentShape.fall(amountOfTiles);

                //console.log('falldown After: ' + this.currentShape.getBlocks()[0].y);

                if (!forceCheck) {
                    return;
                }

            }

            //set blocks as used, since we are creating new shape
            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);

            ////try to clear the rows in which blocks exist
            var rowsCleared = this.board.checkRows(this.currentShape.getBlocks());

            if (rowsCleared > 0) {
                this.rowsCleared += rowsCleared;
                this.hud.addScore(this.level * rowsCleared)
            }

            if (this.rowsCleared > 10 * this.level) {
                this.level++;
            }

            //create empty shape
            this.createEmptyShape();

            //if we can create shape add it into the game
            if (this.board.emptyPositions(this.currentShape.getPositions())) {

                this.addChild(this.currentShape.getGameObject());
                this.ghost.setPositions(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getBlocks()));
                return;
            }

            console.log('gg');
            //if unable to create new shape gg
        }

        rotationControls()
        {
            //rotation controls
            if (this.xKey.isDown) {
                this.rotationDirection = Direction.Right;
            } else if (this.zKey.isDown) {
                this.rotationDirection = Direction.Left;
            } else if (this.upKey.isDown) {
                this.rotationDirection = Direction.Up;
            }

            if (this.rotationDirection !== 0 && !this.rotating) {

                this.rotating = true;

                //try to rotate both to right and left
                if (this.rotationDirection == Direction.Up) {
                    if (!this.rotate(Direction.Right)) {
                        this.rotate(Direction.Left);
                    }
                } else {
                    this.rotate(this.rotationDirection);
                }

            }

            if ((this.rotationDirection == Direction.Left && this.zKey.isUp)
                || (this.rotationDirection == Direction.Right && this.xKey.isUp)
                || (this.rotationDirection == Direction.Up && this.upKey.isUp)
            ) {
                this.rotating = false;
                this.rotationDirection = 0;
            }

        }

        dropDownControls()
        {
            if (this.spaceKey.isDown && !this.dropping) {
                this.dropping = true;
                var amountOfTiles: number = this.board.findDistanceToFall(this.currentShape.getBlocks());

                this.fallDown(amountOfTiles, true);

            }

            if (this.spaceKey.isUp && this.dropping) {
                this.dropping = false;
            }
        }

        fallTimerControls()
        {
            //delay if pressing down arrow
            this.fallTimer.delay = 0.5;
            if (this.downKey.isDown) {
                this.fallTimer.delay = 0.001;
            }
        }

        update()
        {
            super.update();

            this.moveControls();

            this.rotationControls();

            this.dropDownControls();

            this.fallTimerControls();

            //keep falling down
            this.fallTimer.start();

        }

        /**
         * @author http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
         */
        static shuffle(array: any[]) {
            var counter = array.length, temp, index;

            // While there are elements in the array
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
        }

        getFromShapeStack()
        {
            if (this.shapeStack.length == 0) {
                var tempArray: string[] = this.shapes.slice(0);
                for (var index in tempArray) {
                    tempArray[index] = 'Shape' + tempArray[index];
                }

                this.shapeStack = MainState.shuffle(tempArray);

            }

            return this.shapeStack.pop();
        }

        createEmptyShape(shapeName: string = '', x: number = 4, y: number = 1)
        {
            if (shapeName.length == 0) {
                shapeName = this.getFromShapeStack();
            }


            this.currentShape = new Shapes[shapeName](this, x, y);
        }

        createNewShape(shapeName: string = '', x: number = 4, y: number = 1, debug = false)
        {

            if (shapeName.length == 0) {
                shapeName = this.getFromShapeStack();
            }


            this.currentShape = new Shapes[shapeName](this, x, y);

            if (debug) {
                this.board.setBlocks(this.currentShape.getBlocks());
            }

            this.addChild(this.currentShape.getGameObject());
        }

        create()
        {
            super.create();

            //controls
            this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
            this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
            this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);
            this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
            this.zKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.Z);
            this.xKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.X);
            this.spaceKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);

            var text = new Kiwi.GameObjects.TextField(this, "Score", Config.boardWidthInPixels + 5, 60, "#000", 24);

            // Add text to the state
            this.addChild(text);

            var score = new Kiwi.GameObjects.TextField(this, "0", Config.boardWidthInPixels + 5, 85, "#000", 24);

            this.addChild(score);

            this.hud = new Hud(score);


            //move timer for limiting move amount
            this.moveTimer = this.game.time.clock.createTimer('move', 0.1, 0);
            this.moveTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.resetMoving, this);

            //board

            var borders = new Kiwi.GameObjects.StaticImage(this, this.textures.borders, Config.offsetX, 0);
            this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.board, Config.offsetX + Config.borderWidth, Config.borderWidth));
            this.addChild(borders);

            this.board = new Board();

            //drop the first shape
            this.createNewShape();

            ////numbers on sides of board
            //for (var i: number = 0; i < 10; i++) {
            //    var blockNumber = new Kiwi.GameObjects.TextField(this, i.toString(), 48 +  29 * i, 0, "#000000", 30);
            //    this.addChild(blockNumber);
            //}
            //
            //for (var i: number = 2; i < 22; i++) {
            //    var blockNumber = new Kiwi.GameObjects.TextField(this, i.toString(), 4 , 4 + 29 * (i - 2), "#000000", 30);
            //    this.addChild(blockNumber);
            //}


            this.ghost = new Ghost(this, this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getBlocks()));

            this.addChildBefore(this.ghost.getGameObject(), borders);

            //add drop timer
            this.fallTimer = this.game.time.clock.createTimer('fall', 0.5, 0);
            this.fallTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.fallDown, this);
            this.fallTimer.start();


        }
    }

}