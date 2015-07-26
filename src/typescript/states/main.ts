/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../lib/kiwi.d.ts" />
/// <reference path="../game-objects/shapes/shape.ts" />
/// <reference path="../game-objects/shapes/shape-stack.ts" />
/// <reference path="../game-objects/ghost.ts" />
/// <reference path="../game-objects/board.ts" />
/// <reference path="../enums.ts" />
/// <reference path="../config.ts" />
/// <reference path="../hud.ts" />
/// <reference path="../scoring-manager.ts" />

module Tetris {

    export class MainState extends Kiwi.State
    {

        private heldShape: string;
        private currentShape: Shapes.Shape;
        private ghost: Ghost;

        private fallTimer: Kiwi.Time.Timer;
        private moveTimer: Kiwi.Time.Timer;

        private softDropKey: Kiwi.Input.Key;
        private softDropScreen: Kiwi.Plugins.GameObjects.TouchButton;

        private hardDropKey: Kiwi.Input.Key;
        private hardDropScreen: Kiwi.Plugins.GameObjects.TouchButton;

        private holdKey: Kiwi.Input.Key;
        private holdKeyIsDown: boolean = false;
        private holdSprite: Kiwi.GameObjects.Sprite;
        private canHold: boolean = true;

        //Moving to left and right
        private moveKeyIsDown: boolean = false;
        private leftKey: Kiwi.Input.Key;
        private leftKeyScreen: Kiwi.Plugins.GameObjects.TouchButton;

        private rightKey: Kiwi.Input.Key;
        private rightKeyScreen: Kiwi.Plugins.GameObjects.TouchButton;

        //rotating
        private rotateBothKey: Kiwi.Input.Key;
        private rotateBothScreen: Kiwi.Plugins.GameObjects.TouchButton;

        private rotateClockwiseKey: Kiwi.Input.Key;
        private rotateClockwiseScreen: Kiwi.Plugins.GameObjects.TouchButton;

        private rotateCounterClockwiseKey: Kiwi.Input.Key;
        private rotateCounterClockwiseScreen: Kiwi.Plugins.GameObjects.TouchButton;

        private rotateKeyIsDown: boolean = false;
        private rotationDirection: number = 0;

        //dropping
        private dropping: boolean = false;

        private board: Board;
        private hud: Hud;
        private scoringManager: ScoringManager;

        private boardSprite: Kiwi.GameObjects.Sprite;

        private animationsStarted: boolean = false;

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

        private shapeStack: Shapes.ShapeStack;

        preload() {
            super.preload();
            this.addImage('board', 'assets/img/board.png');
            this.addImage('borders', 'assets/img/borders.png');
            this.addImage('hudBorders', 'assets/img/hud-borders.png');

            this.blocks.forEach(color => this.addImage('block-'+ color, 'assets/img/block-'+ color +'.png'));

            this.addImage('block-ghost', 'assets/img/block-ghost.png');

            this.addSpriteSheet('controlArrow', 'assets/img/control-arrow.png', 51,73);
            this.addSpriteSheet('controlButton', 'assets/img/control-button.png', 100,100);

        }

        moveControls() {

            if (this.boardSprite.input.withinBounds) {

                var pointerPosition: number = Math.trunc((this.game.input.x - Config.offsetX - Config.borderWidth) / (Config.tileSize - 1));
                var distanceFromCenter = Math.trunc(pointerPosition - this.currentShape.center.x);


                if (this.currentShape.name == 'ShapeI' || this.currentShape.name == 'ShapeO') {
                    distanceFromCenter = Math.round(pointerPosition - this.currentShape.center.x) - 1;
                }

                //shapeI doesnt like rotation too
                if (this.currentShape.name == 'ShapeI' && this.currentShape.currentRotation == 3) {
                    distanceFromCenter++;
                }


                //something screws up with rotation 3.
                if (this.currentShape.currentRotation == 3 && pointerPosition == 9) {
                    distanceFromCenter++;
                }


                var checkedCenterPosition: number = this.board.findValidPosition(distanceFromCenter, this.currentShape.getPositions());

                this.currentShape.setByPointerPosition(checkedCenterPosition);
                this.ghost.setPosition(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));

                return;

            }

            var left: boolean = this.leftKey.isDown || this.leftKeyScreen.isDown;
            var right: boolean = this.rightKey.isDown || this.rightKeyScreen.isDown;

            var direction = right ? Direction.Right: Direction.Left;

            if ((left || right) && !this.moveKeyIsDown && this.board.emptyDirection(this.currentShape.getBlocks(), direction)) {
                this.moveKeyIsDown = true;

                this.currentShape.move(direction);

                this.ghost.setPosition(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));

                this.moveTimer.start();

            }
        }

        rotate(direction: number)
        {
            var positions: Position[] = this.currentShape.getNextRotation(direction);
            var rotated: boolean = false;
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
        }

        afterShapeLanded() {
            this.animationsStarted = false;
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
        }

        //drop down event
        fallDown(amountOfTiles: number = 1, forceCheck: boolean = false)
        {
            if (this.animationsStarted) {
                return;
            }
            //try to fall down
            //amount of Tiles specified must be empty, because here I don't check tiles below
            if (this.board.emptyDirection(this.currentShape.getBlocks(), Direction.Down)) {

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
            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);

            ////try to clear the rows in which blocks exist
            var rowsCleared = this.board.checkRows(this.currentShape.getBlocks());

            this.scoringManager.addRowsCleared(rowsCleared);

            if (rowsCleared) {
                this.animationsStarted = true;
                this.game.time.clock.setTimeout(() => {
                    this.afterShapeLanded();
                }, Config.animationTime, this);
            } else {
                this.afterShapeLanded();
            }

        }

        rotationControls()
        {
            //rotation controls
            if (this.rotateCounterClockwiseKey.isDown || this.rotateCounterClockwiseScreen.isDown) {
                this.rotationDirection = Direction.Left;
            } else if (this.rotateClockwiseKey.isDown || this.rotateClockwiseScreen.isDown) {
                this.rotationDirection = Direction.Right;
            } else if (this.rotateBothKey.isDown || this.rotateBothScreen.isDown || this.boardSprite.input.isDown) {
                this.rotationDirection = Direction.Up;
            }

            if (this.rotationDirection !== 0 && !this.rotateKeyIsDown) {

                this.rotateKeyIsDown = true;

                //try to rotate both to right and left
                if (this.rotationDirection == Direction.Up) {
                    if (!this.rotate(Direction.Right)) {
                        this.rotate(Direction.Left);
                    }
                } else {
                    this.rotate(this.rotationDirection);
                }

            }

            //reset rotation controls
            if ((this.rotationDirection == Direction.Right && (this.rotateClockwiseKey.isUp && this.rotateClockwiseScreen.isUp))
                || (this.rotationDirection == Direction.Left && (this.rotateCounterClockwiseKey.isUp && this.rotateCounterClockwiseScreen.isUp))
                || (this.rotationDirection == Direction.Up && (this.rotateBothKey.isUp && this.rotateBothScreen.isUp && this.boardSprite.input.isUp))
            ) {
                this.rotateKeyIsDown = false;
                this.rotationDirection = 0;
            }

        }

        dropDownControls()
        {
            if ((this.hardDropKey.isDown || this.hardDropScreen.isDown) && !this.dropping) {
                this.dropping = true;
                var amountOfRows: number = this.board.findDistanceToFall(this.currentShape.getPositions());

                this.fallDown(amountOfRows, true);

                this.scoringManager.addHardDrop(amountOfRows);

            }

            if (this.hardDropKey.isUp && this.hardDropScreen.isUp && this.dropping) {
                this.dropping = false;
            }
        }

        fallTimerControls()
        {
            this.fallTimer.delay = this.scoringManager.getFallingDelay();
            if (this.softDropKey.isDown || this.softDropScreen.isDown) {
                this.fallTimer.delay = 0.01;
            }
        }

        holdControls() {
            if ((this.holdKey.isDown || this.holdSprite.input.isDown) && !this.holdKeyIsDown && this.canHold) {
                this.holdKeyIsDown = true;

                var heldShapeName = this.heldShape ? this.heldShape : '';

                this.heldShape = this.currentShape.name;
                this.currentShape.destroy();

                this.createNewShape(true, heldShapeName);

                if (!heldShapeName) {
                    this.hud.setNextShape(this.shapeStack.getNextShape());
                }

                this.hud.setHeldShape(this.heldShape);
                this.ghost.setPosition(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));

                this.canHold = false;
            }

            if (this.holdKey.isUp && this.holdSprite.input.isUp && this.holdKeyIsDown) {
                this.holdKeyIsDown = false;
            }
        }


        update()
        {
            super.update();

            if (this.animationsStarted) {
                return;
            }

            this.moveControls();

            this.rotationControls();

            this.dropDownControls();

            this.fallTimerControls();

            this.holdControls();

            //keep falling down
            this.fallTimer.start();

            this.hud.updateScore();

        }

        createNewShape(addToGame: boolean = false, shapeName: string = '', x: number = 4, y: number = 1, debug = false)
        {

            this.currentShape = this.shapeStack.createNewShape(addToGame, shapeName, x, y);

            //always refresh board, because sometimes bug can occur. Most likely because of setTimeouts. I don't like 'em. :(
            this.board.refreshHighestPositions();

            if (debug) {
                this.board.setBlocks(this.currentShape.getBlocks());
            }


        }

        create()
        {
            super.create();

            //controls

            this.rotateBothScreen = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['controlArrow'], 95, Config.boardHeightInPixels - 30);
            this.rotateBothScreen.rotPointX = this.rotateBothScreen.width * 0.5;
            this.rotateBothScreen.rotPointY = this.rotateBothScreen.height * 0.5;
            this.rotateBothScreen.rotation = Math.PI / 2;
            this.addChild(this.rotateBothScreen);

            this.leftKeyScreen = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['controlArrow'], 30, Config.boardHeightInPixels + 35);
            this.addChild(this.leftKeyScreen);

            this.rightKeyScreen = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['controlArrow'], 160, Config.boardHeightInPixels + 35);
            this.rightKeyScreen.rotPointX = this.rightKeyScreen.width * 0.5;
            this.rightKeyScreen.rotPointY = this.rightKeyScreen.height * 0.5;
            this.rightKeyScreen.rotation = Math.PI;
            this.addChild(this.rightKeyScreen);


            this.softDropScreen = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['controlArrow'], 95, Config.boardHeightInPixels + 100);
            this.softDropScreen.rotPointX = this.softDropScreen.width * 0.5;
            this.softDropScreen.rotPointY = this.softDropScreen.height * 0.5;
            this.softDropScreen.rotation = -Math.PI / 2;
            this.addChild(this.softDropScreen);

            this.rotateClockwiseScreen = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['controlButton'], 210, Config.boardHeightInPixels - 30);
            this.rotateClockwiseScreen.scaleX = 0.6;
            this.rotateClockwiseScreen.scaleY = 0.6;
            this.addChild(this.rotateClockwiseScreen);

            this.rotateCounterClockwiseScreen = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['controlButton'], 280, Config.boardHeightInPixels - 30);
            this.rotateCounterClockwiseScreen.scaleX = 0.6;
            this.rotateCounterClockwiseScreen.scaleY = 0.6;
            this.addChild(this.rotateCounterClockwiseScreen);

            this.hardDropScreen = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['controlButton'], 330, 460);
            this.hardDropScreen.scaleX = 0.6;
            this.hardDropScreen.scaleY = 0.6;
            this.addChild(this.hardDropScreen);

            this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
            this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
            this.rotateBothKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
            this.rotateClockwiseKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.Z);
            this.rotateCounterClockwiseKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.X);
            this.softDropKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);
            this.hardDropKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);
            this.holdKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SHIFT);

            //board sprites

            // Add score text to the state
            var scoreText = new Kiwi.GameObjects.TextField(this, "Score", Config.boardWidthInPixels, 0, "#000", 24);
            this.addChild(scoreText);

            var score = new Kiwi.GameObjects.TextField(this, "0", Config.boardWidthInPixels, 25, "#000", 24);
            this.addChild(score);

            var levelText = new Kiwi.GameObjects.TextField(this, "Level", Config.boardWidthInPixels, 60, "#000", 24);
            this.addChild(levelText);

            var level = new Kiwi.GameObjects.TextField(this, "0", Config.boardWidthInPixels, 85, "#000", 24);
            this.addChild(level);

            var linesText = new Kiwi.GameObjects.TextField(this, "Lines", Config.boardWidthInPixels, 110, "#000", 24);
            this.addChild(linesText);

            var lines = new Kiwi.GameObjects.TextField(this, "0", Config.boardWidthInPixels, 135, "#000", 24);
            this.addChild(lines);

            this.boardSprite = new Kiwi.GameObjects.Sprite(this, this.textures.board, Config.offsetX + Config.borderWidth, Config.borderHeight);
            this.boardSprite.input.enabled = true;
            this.addChild(this.boardSprite);

            var borders = new Kiwi.GameObjects.StaticImage(this, this.textures.borders, Config.offsetX, 0);
            this.addChild(borders);

            var nextShapeText = new Kiwi.GameObjects.TextField(this, "Next", Config.boardWidthInPixels, 170, "#000", 24);
            this.addChild(nextShapeText);

            var nextShapeBorders = new Kiwi.GameObjects.StaticImage(this, this.textures.hudBorders, Config.boardWidthInPixels + 20, 235);
            nextShapeBorders.scaleX = 2.5;
            nextShapeBorders.scaleY = 3.5;
            this.addChild(nextShapeBorders);

            var heldShapeText = new Kiwi.GameObjects.TextField(this, "Hold", Config.boardWidthInPixels, 320, "#000", 24);
            this.addChild(heldShapeText);

            this.holdSprite = new Kiwi.GameObjects.Sprite(this, this.textures.hudBorders, Config.boardWidthInPixels + 20, 385);
            this.holdSprite.scaleX = 2.5;
            this.holdSprite.scaleY = 3.5;
            this.holdSprite.input.enabled = true;
            this.addChild(this.holdSprite);

            //move timer for limiting move amount
            this.moveTimer = this.game.time.clock.createTimer('move', Config.moveTimerRate, 0);
            this.moveTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, () =>  {this.moveKeyIsDown = false}, this);

            //add drop timer
            this.fallTimer = this.game.time.clock.createTimer('fall', 0.5, 0);
            this.fallTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.fallDown, this);

            this.board = new Board(this);

            this.shapeStack = new Shapes.ShapeStack(this);

            this.scoringManager = new ScoringManager(1);
            this.hud = new Hud(this, this.scoringManager, level, score, lines);

            //drop the first shape
            this.createNewShape(true);

            this.hud.setNextShape(this.shapeStack.getNextShape());

            //set its ghost
            this.ghost = new Ghost(this, this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));
            this.addChildBefore(this.ghost.getGameObject(), borders);


            this.fallTimer.start();

        }
    }

}