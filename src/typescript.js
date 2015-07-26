var Tetris;
(function (Tetris) {
    var Config = (function () {
        function Config() {
        }
        Config.borderWidth = 4;
        Config.borderHeight = 4;
        Config.tileSize = 30;
        Config.offsetX = 40;
        Config.offsetY = -2 * (Config.tileSize - 1);
        Config.boardWidth = 10;
        Config.boardWidthInPixels = Config.offsetX + Config.borderWidth * 2 + Config.boardWidth * Config.tileSize;
        Config.boardHeight = 22;
        Config.boardHeightInPixels = Config.offsetY + Config.borderWidth * 2 + Config.boardHeight * Config.tileSize;
        Config.moveTimerRate = 0.1;
        Config.animationTime = 300;
        return Config;
    })();
    Tetris.Config = Config;
})(Tetris || (Tetris = {}));
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
/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../lib/kiwi.d.ts" />
/// <reference path="../config.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Tetris;
(function (Tetris) {
    var MenuState = (function (_super) {
        __extends(MenuState, _super);
        function MenuState() {
            _super.apply(this, arguments);
        }
        MenuState.prototype.update = function () {
            if (this.game.input.mouse.isDown || this.startKey.isDown) {
                this.game.states.switchState('main');
            }
        };
        MenuState.prototype.create = function () {
            _super.prototype.create.call(this);
            this.addChild(new Kiwi.GameObjects.TextField(this, "Tetris clone", Tetris.Config.boardWidthInPixels / 2, 200, "#000", 30));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Default controls for the game are:", Tetris.Config.boardWidthInPixels / 2, 250, "#000", 20));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Move - arrow keys", Tetris.Config.boardWidthInPixels / 2, 280, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Rotate counterclockwise - z", Tetris.Config.boardWidthInPixels / 2, 300, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Rotate clockwise - x", Tetris.Config.boardWidthInPixels / 2, 320, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Rotate both ways - up arrow", Tetris.Config.boardWidthInPixels / 2, 340, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Soft drop - down key", Tetris.Config.boardWidthInPixels / 2, 360, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Hard drop - space", Tetris.Config.boardWidthInPixels / 2, 380, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Hold - shift", Tetris.Config.boardWidthInPixels / 2, 400, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "On mobile you can play", Tetris.Config.boardWidthInPixels / 2, 440, "#000", 20));
            this.addChild(new Kiwi.GameObjects.TextField(this, "with on screen buttons", Tetris.Config.boardWidthInPixels / 2, 460, "#000", 20));
            this.addChild(new Kiwi.GameObjects.TextField(this, "or by dragging on screen", Tetris.Config.boardWidthInPixels / 2, 480, "#000", 20));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Click on screen to play", Tetris.Config.boardWidthInPixels / 2, 510, "#000", 25));
            this.getAllChildren().forEach(function (children) { return children.textAlign = 'center'; });
            this.startKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);
        };
        return MenuState;
    })(Kiwi.State);
    Tetris.MenuState = MenuState;
})(Tetris || (Tetris = {}));
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
/// <reference path="../lib/kiwi.d.ts" />
/// <reference path="../config.ts" />
/// <reference path="position.ts" />
var Tetris;
(function (Tetris) {
    var Block = (function () {
        function Block(x, y, state, texture) {
            this.size = Tetris.Config.tileSize;
            this.x = x;
            this.y = y;
            if (texture) {
                this.sprite = new Kiwi.GameObjects.Sprite(state, texture, Tetris.Config.offsetX + Tetris.Config.borderWidth + x * (this.size - 1), Tetris.Config.offsetY + Tetris.Config.borderWidth + y * (this.size - 1));
            }
        }
        Block.prototype.fall = function (amountOfTiles) {
            if (amountOfTiles === void 0) { amountOfTiles = 1; }
            this.y += amountOfTiles;
            if (this.sprite) {
                this.sprite.transform.y += amountOfTiles * (this.size - 1);
            }
        };
        Block.prototype.move = function (side) {
            this.x += side;
            if (this.sprite) {
                this.sprite.transform.x += side * (this.size - 1);
            }
        };
        Block.prototype.setPosition = function (position) {
            var xDiff = position.x - this.x;
            var yDiff = position.y - this.y;
            this.x = position.x;
            this.y = position.y;
            if (this.sprite) {
                this.sprite.transform.x += xDiff * (this.size - 1);
                this.sprite.transform.y += yDiff * (this.size - 1);
            }
        };
        Block.prototype.getPosition = function () {
            return new Tetris.Position(this.x, this.y);
        };
        Block.prototype.destroy = function (animate) {
            var _this = this;
            if (animate === void 0) { animate = false; }
            if (this.sprite) {
                if (animate) {
                    var tween = this.sprite.state.game.tweens.create(this.sprite);
                    tween.to({ alpha: 0 }, Tetris.Config.animationTime, Kiwi.Animations.Tweens.Easing.Bounce.In, true).onComplete(function () { return _this.sprite.destroy(); }, this);
                }
                else {
                    this.sprite.destroy();
                }
            }
        };
        return Block;
    })();
    Tetris.Block = Block;
})(Tetris || (Tetris = {}));
/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../block.ts" />
var Tetris;
(function (Tetris) {
    var Shapes;
    (function (Shapes) {
        var Shape = (function () {
            function Shape(state) {
                //status for rotation
                this.currentRotation = 0;
                this.currentTest = 0;
                this.nextPositions = [];
                this.blocks = [];
                this.state = state;
                this.gameObject = new Kiwi.Group(state);
            }
            //add block into the shape
            Shape.prototype.addBlock = function (blockColor, x, y, center) {
                if (center === void 0) { center = false; }
                var block = new Tetris.Block(x, y, this.state, this.state.textures['block-' + blockColor]);
                this.blocks.push(block);
                this.gameObject.addChild(block.sprite);
                if (center) {
                    this.center = block;
                }
            };
            Shape.prototype.getGameObject = function () { return this.gameObject; };
            Shape.prototype.getBlocks = function () { return this.blocks; };
            Shape.prototype.destroy = function () {
                this.getBlocks().forEach(function (block) { return block.destroy(); });
            };
            //get blocks position
            Shape.prototype.getPositions = function (blocks) {
                if (blocks === void 0) { blocks = this.blocks; }
                return blocks.map(function (block) {
                    return block.getPosition();
                });
            };
            Shape.prototype.fall = function (amountOfTiles) {
                var _this = this;
                if (amountOfTiles === void 0) { amountOfTiles = 1; }
                this.blocks.forEach(function (block) {
                    if (block == _this.center) {
                        return true;
                    }
                    block.fall(amountOfTiles);
                });
                this.center.fall(amountOfTiles);
                return this;
            };
            Shape.prototype.setByPointerPosition = function (distanceFromCenter) {
                var _this = this;
                this.blocks.forEach(function (block) {
                    if (block == _this.center) {
                        return true;
                    }
                    block.setPosition(new Tetris.Position(block.x + distanceFromCenter, block.y));
                });
                this.center.setPosition(new Tetris.Position(this.center.x + distanceFromCenter, this.center.y));
                return this;
            };
            Shape.prototype.move = function (side) {
                var _this = this;
                this.blocks.forEach(function (block) {
                    if (block == _this.center) {
                        return true;
                    }
                    block.move(side);
                });
                this.center.move(side);
                return this;
            };
            Shape.prototype.getRotations = function () { return Shape.rotations; };
            Shape.prototype.getNextRotation = function (direction) {
                var nextPositions = [];
                //if we checked all possibilities, return nothing
                if (this.currentTest == 5) {
                    this.currentTest = 0;
                    return nextPositions;
                }
                var rotations = this.getRotations();
                var centerX = this.center.x;
                var centerY = this.center.y;
                var xMargin = direction * rotations[this.currentRotation][this.currentTest][0];
                var yMargin = direction * rotations[this.currentRotation][this.currentTest][1];
                //set center positions, so we don't lose it during rotation
                var nextCenter = new Tetris.Position(centerX + xMargin, centerY + yMargin);
                this.blocks.forEach(function (block) {
                    var xDiff = direction * (block.x - centerX);
                    var yDiff = direction * (block.y - centerY);
                    nextPositions.push(new Tetris.Position(nextCenter.x - yDiff, nextCenter.y + xDiff));
                });
                this.nextCenter = nextCenter;
                this.nextPositions = nextPositions;
                this.direction = direction;
                //increate test amount
                this.currentTest++;
                return nextPositions;
            };
            Shape.prototype.rotate = function () {
                var _this = this;
                //if we want to ratate without checking
                if (!this.nextCenter) {
                    this.getNextRotation(1);
                }
                this.center.setPosition(new Tetris.Position(this.nextCenter.x, this.nextCenter.y));
                this.blocks.forEach(function (block, index) {
                    //if c block is in center position, it is already set
                    if (block == _this.center) {
                        return true;
                    }
                    block.setPosition(new Tetris.Position(_this.nextPositions[index].x, _this.nextPositions[index].y));
                });
                this.currentTest = 0;
                this.currentRotation += this.direction;
                if (this.currentRotation == 4) {
                    this.currentRotation = 0;
                }
                if (this.currentRotation == -1) {
                    this.currentRotation = 3;
                }
                return this;
            };
            //rotations for J L T Z S Pieces
            Shape.rotations = [
                [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
                [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
                [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
                [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
            ];
            return Shape;
        })();
        Shapes.Shape = Shape;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="shape.ts" />
var Tetris;
(function (Tetris) {
    var Shapes;
    (function (Shapes) {
        var ShapeStack = (function () {
            function ShapeStack(state) {
                //shape names
                this.shapes = [
                    'I',
                    'J',
                    'L',
                    'O',
                    'S',
                    'T',
                    'Z'
                ];
                //shapes array waiting to spawn
                this.shapeStack = [];
                this.state = state;
            }
            /**
             * @author http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
             */
            ShapeStack.shuffle = function (array) {
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
            };
            ShapeStack.prototype.getNextShape = function (pop) {
                if (pop === void 0) { pop = false; }
                if (this.shapeStack.length < 2) {
                    var tempArray = this.shapes.slice(0);
                    tempArray.forEach(function (element, index) { return tempArray[index] = 'Shape' + element; });
                    this.shapeStack = this.shapeStack.concat(ShapeStack.shuffle(tempArray));
                }
                return pop ? this.shapeStack.shift() : this.shapeStack[0];
            };
            ShapeStack.prototype.createNewShape = function (addToGame, shapeName, x, y) {
                if (addToGame === void 0) { addToGame = false; }
                if (shapeName === void 0) { shapeName = ''; }
                if (x === void 0) { x = 4; }
                if (y === void 0) { y = 1; }
                if (shapeName.length == 0) {
                    shapeName = this.getNextShape(true);
                }
                var shape = new Shapes[shapeName](this.state, x, y);
                if (addToGame) {
                    this.state.addChild(shape.getGameObject());
                }
                return shape;
            };
            return ShapeStack;
        })();
        Shapes.ShapeStack = ShapeStack;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../lib/kiwi.d.ts" />
/// <reference path="block.ts" />
var Tetris;
(function (Tetris) {
    var Ghost = (function () {
        function Ghost(state, positions, lowerBy) {
            var _this = this;
            this.blocks = [];
            this.state = state;
            this.gameObject = new Kiwi.Group(state);
            positions.forEach(function (position) {
                var block = new Tetris.Block(position.x, position.y + lowerBy, _this.state, _this.state.textures['block-ghost']);
                _this.blocks.push(block);
                _this.gameObject.addChild(block.sprite);
            });
        }
        Ghost.prototype.getGameObject = function () {
            return this.gameObject;
        };
        Ghost.prototype.setPosition = function (positions, lowerBy) {
            this.blocks.forEach(function (block, index) {
                block.setPosition(new Tetris.Position(positions[index].x, positions[index].y + lowerBy));
            });
        };
        return Ghost;
    })();
    Tetris.Ghost = Ghost;
})(Tetris || (Tetris = {}));
/// <reference path="../lib/ramda.d.ts" />
/// <reference path="shapes/shape.ts" />
/// <reference path="position.ts" />
/// <reference path="../enums.ts" />
/// <reference path="../config.ts" />
var Tetris;
(function (Tetris) {
    var R = require('ramda');
    var Board = (function () {
        function Board(state) {
            this.height = Tetris.Config.boardHeight;
            this.width = Tetris.Config.boardWidth;
            //blocks array to keep track of blocks inside game
            this.blocks = [];
            this.highestPositions = [];
            this.state = state;
            for (var i = 0; i < this.height; i++) {
                this.blocks[i] = [];
            }
            for (var i = 0; i < this.width; i++) {
                this.highestPositions[i] = new Tetris.Position(i, this.height);
            }
        }
        //check if given positions are empty
        Board.prototype.emptyPositions = function (positions) {
            var _this = this;
            return positions.filter(function (position) {
                return position.x < 0
                    || position.x > _this.width - 1
                    || position.y > _this.height - 1
                    || position.y < 0
                    || _this.blocks[position.y][position.x] !== undefined;
            }).length === 0;
        };
        //check blocks next to given ones are empty
        Board.prototype.emptyDirection = function (blocks, direction) {
            var _this = this;
            return blocks.filter(function (block) {
                return (direction === Tetris.Direction.Down && (block.y === _this.height - 1 || _this.blocks[block.y + 1][block.x] !== undefined))
                    || (direction === Tetris.Direction.Left && (block.x === 0 || _this.blocks[block.y][block.x - 1] !== undefined))
                    || (direction === Tetris.Direction.Right && (block.x === _this.width - 1 || _this.blocks[block.y][block.x + 1] !== undefined));
            }).length === 0;
        };
        Board.prototype.refreshHighestPosition = function (position) {
            this.highestPositions[position.x] =
                this.highestPositions[position.x].isLower(position) ? position : this.highestPositions[position.x];
        };
        Board.prototype.refreshHighestPositions = function (positions) {
            var _this = this;
            if (positions === void 0) { positions = []; }
            this.highestPositions.forEach(function (highestPosition, column) {
                _this.highestPositions[column].y = _this.height;
                var from = positions.filter(function (position) { return position.x == column; }).map(function (position) { return position.y; })[0];
                from = from ? from : 0;
                for (var i = from; i < _this.height; i++) {
                    if (_this.blocks[i][column]) {
                        _this.highestPositions[column].y = i;
                        break;
                    }
                }
            });
        };
        //set status for blocks
        Board.prototype.setBlocks = function (blocks, status) {
            var _this = this;
            if (status === void 0) { status = Tetris.BlockStatus.Taken; }
            blocks.forEach(function (block) {
                _this.blocks[block.y][block.x] = status === Tetris.BlockStatus.Taken ? block : undefined;
                if (status === Tetris.BlockStatus.Taken) {
                    _this.refreshHighestPosition(block.getPosition());
                }
            });
            return this;
        };
        //check for rows to clear and return amount of cleared rows
        Board.prototype.checkRows = function (blocks) {
            var _this = this;
            var rowsToClear = this.getRowsToClear(blocks);
            if (rowsToClear.length > 0) {
                this.clearRows(rowsToClear);
                this.state.game.time.clock.setTimeout(function () {
                    //after clearing the rows, make other blocks fall down
                    _this.fallBlocks(rowsToClear);
                    //refresh highest positions because some rows can get empty or some gaps can happen
                    _this.refreshHighestPositions();
                }, Tetris.Config.animationTime, this);
            }
            return rowsToClear.length;
        };
        //find full rows
        Board.prototype.getRowsToClear = function (blocks) {
            var _this = this;
            //no duplicates
            var rowsToClear = R.uniq(blocks
                .filter(function (block) {
                //only if full row (all blocks set and none of them are undefined)
                return (_this.blocks[block.y].length === _this.width && !R.contains(undefined, _this.blocks[block.y]));
                //only return rows
            }).map(function (block) { return block.y; }));
            //reverse sort
            return R.sort(function (a, b) {
                return b - a;
            }, rowsToClear);
        };
        Board.prototype.clearRows = function (rowNumbers) {
            var _this = this;
            rowNumbers.forEach(function (rowNumber) {
                //destroy all blocks in row
                _this.blocks[rowNumber].forEach(function (block) { return block.destroy(true); });
                //set all row empty
                _this.setBlocks(_this.blocks[rowNumber], Tetris.BlockStatus.Empty);
            });
        };
        Board.prototype.fallBlocks = function (rowsToFall) {
            var _this = this;
            rowsToFall.forEach(function (fromRow, index) {
                var lowerBy = index + 1;
                //till what row to clear
                var toRow = rowsToFall[lowerBy] ? rowsToFall[lowerBy] : 0;
                //flatten arrays into one typescript compilator is screwing in this place..
                var blocksToFall = R.flatten(
                //check from bottom to top
                R.reverse(
                //get all rows between highest and lowest
                _this.blocks.filter(function (blocks, row) {
                    return row <= fromRow && row >= toRow;
                }))).filter(function (block) { return block !== undefined; });
                //first get all rows which need to be checked, reverse them (so we wouldnt overwrite blocks in board), then get all blocks in them and do make them go down
                blocksToFall.forEach(function (block) {
                    _this.setBlocks([block], Tetris.BlockStatus.Empty);
                    block.setPosition(new Tetris.Position(block.x, block.y + lowerBy));
                    _this.setBlocks([block], Tetris.BlockStatus.Taken);
                });
            });
        };
        //return number of rows to fall
        Board.prototype.findDistanceToFall = function (positions) {
            var _this = this;
            this.refreshHighestPositions(positions);
            return positions.reduce(function (rowsToFall, position) {
                var distance = Math.sqrt(Math.pow(_this.highestPositions[position.x].y - position.y, 2)) - 1;
                return distance < rowsToFall ? distance : rowsToFall;
            }, this.height);
        };
        //find how much center position can move (used with pointer to check for walls)
        Board.prototype.findValidPosition = function (distanceFromCenter, positions) {
            var _this = this;
            if (distanceFromCenter === 0) {
                return 0;
            }
            return positions.reduce(function (previousElement, currentElement) {
                var newPosition = currentElement.x + distanceFromCenter;
                var newDistanceFromCenter = distanceFromCenter;
                if (newPosition < 0) {
                    newDistanceFromCenter = distanceFromCenter - newPosition;
                }
                if (newPosition > _this.width - 1) {
                    newDistanceFromCenter = distanceFromCenter - (newPosition - (_this.width - 1));
                }
                return Math.abs(newDistanceFromCenter) < Math.abs(previousElement) ? newDistanceFromCenter : previousElement;
            }, distanceFromCenter);
        };
        return Board;
    })();
    Tetris.Board = Board;
})(Tetris || (Tetris = {}));
/**
 * Created by Gytis on 2015-07-05.
 */
/// <reference path="lib/kiwi.d.ts" />
var Tetris;
(function (Tetris) {
    var ScoringManager = (function () {
        function ScoringManager(level) {
            if (level === void 0) { level = 1; }
            this.score = 0;
            this.level = 1;
            this.rowsCleared = 0;
            this.level = level;
        }
        ScoringManager.prototype.checkLevel = function (rowsCleared) {
            this.rowsCleared += rowsCleared;
            if (this.rowsCleared > this.level * 10) {
                this.level++;
            }
        };
        ScoringManager.prototype.getInfo = function () {
            return {
                score: this.score,
                level: this.level,
                lines: this.rowsCleared
            };
        };
        ScoringManager.prototype.getFallingDelay = function () {
            var level = this.level < 10 ? this.level : 10;
            return (11 - level) * 0.05;
        };
        ScoringManager.prototype.addRowsCleared = function (rowsCleared) {
            switch (rowsCleared) {
                case 1:
                    this.score += 40 * this.level;
                    break;
                case 2:
                    this.score += 100 * this.level;
                    break;
                case 3:
                    this.score += 300 * this.level;
                    break;
                case 4:
                    this.score += 1200 * this.level;
                    break;
                default:
                    return;
            }
            this.checkLevel(rowsCleared);
        };
        ScoringManager.prototype.addSoftDrop = function () {
            this.score++;
        };
        ScoringManager.prototype.addHardDrop = function (amountOfRows) {
            this.score += 2 * amountOfRows;
        };
        return ScoringManager;
    })();
    Tetris.ScoringManager = ScoringManager;
})(Tetris || (Tetris = {}));
/**
 * Created by Gytis on 2015-07-05.
 */
/// <reference path="game-objects/shapes/shape.ts" />
/// <reference path="lib/kiwi.d.ts" />
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
            this.linesObject.text = info.lines.toString();
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
            gameObject.getAllChildren().forEach(function (sprite) {
                sprite.alpha = 0;
                var tween = sprite.state.game.tweens.create(sprite);
                tween.to({ alpha: 1 }, Tetris.Config.animationTime, Kiwi.Animations.Tweens.Easing.Sinusoidal.In, true);
            });
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
            this.animationsStarted = false;
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
            this.addSpriteSheet('controlArrow', 'assets/img/control-arrow.png', 51, 73);
            this.addSpriteSheet('controlButton', 'assets/img/control-button.png', 100, 100);
        };
        MainState.prototype.moveControls = function () {
            if (this.boardSprite.input.withinBounds) {
                var pointerPosition = Math.trunc((this.game.input.x - Tetris.Config.offsetX - Tetris.Config.borderWidth) / (Tetris.Config.tileSize - 1));
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
                var checkedCenterPosition = this.board.findValidPosition(distanceFromCenter, this.currentShape.getPositions());
                this.currentShape.setByPointerPosition(checkedCenterPosition);
                this.ghost.setPosition(this.currentShape.getPositions(), this.board.findDistanceToFall(this.currentShape.getPositions()));
                return;
            }
            var left = this.leftKey.isDown || this.leftKeyScreen.isDown;
            var right = this.rightKey.isDown || this.rightKeyScreen.isDown;
            var direction = right ? Tetris.Direction.Right : Tetris.Direction.Left;
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
        MainState.prototype.afterShapeLanded = function () {
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
        };
        //drop down event
        MainState.prototype.fallDown = function (amountOfTiles, forceCheck) {
            var _this = this;
            if (amountOfTiles === void 0) { amountOfTiles = 1; }
            if (forceCheck === void 0) { forceCheck = false; }
            if (this.animationsStarted) {
                return;
            }
            //try to fall down
            //amount of Tiles specified must be empty, because here I don't check tiles below
            if (this.board.emptyDirection(this.currentShape.getBlocks(), Tetris.Direction.Down)) {
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
            this.board.setBlocks(this.currentShape.getBlocks(), Tetris.BlockStatus.Taken);
            ////try to clear the rows in which blocks exist
            var rowsCleared = this.board.checkRows(this.currentShape.getBlocks());
            this.scoringManager.addRowsCleared(rowsCleared);
            if (rowsCleared) {
                this.animationsStarted = true;
                this.game.time.clock.setTimeout(function () {
                    _this.afterShapeLanded();
                }, Tetris.Config.animationTime, this);
            }
            else {
                this.afterShapeLanded();
            }
        };
        MainState.prototype.rotationControls = function () {
            //rotation controls
            if (this.rotateCounterClockwiseKey.isDown || this.rotateCounterClockwiseScreen.isDown) {
                this.rotationDirection = Tetris.Direction.Left;
            }
            else if (this.rotateClockwiseKey.isDown || this.rotateClockwiseScreen.isDown) {
                this.rotationDirection = Tetris.Direction.Right;
            }
            else if (this.rotateBothKey.isDown || this.rotateBothScreen.isDown || this.boardSprite.input.isDown) {
                this.rotationDirection = Tetris.Direction.Up;
            }
            if (this.rotationDirection !== 0 && !this.rotateKeyIsDown) {
                this.rotateKeyIsDown = true;
                //try to rotate both to right and left
                if (this.rotationDirection == Tetris.Direction.Up) {
                    if (!this.rotate(Tetris.Direction.Right)) {
                        this.rotate(Tetris.Direction.Left);
                    }
                }
                else {
                    this.rotate(this.rotationDirection);
                }
            }
            //reset rotation controls
            if ((this.rotationDirection == Tetris.Direction.Right && (this.rotateClockwiseKey.isUp && this.rotateClockwiseScreen.isUp))
                || (this.rotationDirection == Tetris.Direction.Left && (this.rotateCounterClockwiseKey.isUp && this.rotateCounterClockwiseScreen.isUp))
                || (this.rotationDirection == Tetris.Direction.Up && (this.rotateBothKey.isUp && this.rotateBothScreen.isUp && this.boardSprite.input.isUp))) {
                this.rotateKeyIsDown = false;
                this.rotationDirection = 0;
            }
        };
        MainState.prototype.dropDownControls = function () {
            if ((this.hardDropKey.isDown || this.hardDropScreen.isDown) && !this.dropping) {
                this.dropping = true;
                var amountOfRows = this.board.findDistanceToFall(this.currentShape.getPositions());
                this.fallDown(amountOfRows, true);
                this.scoringManager.addHardDrop(amountOfRows);
            }
            if (this.hardDropKey.isUp && this.hardDropScreen.isUp && this.dropping) {
                this.dropping = false;
            }
        };
        MainState.prototype.fallTimerControls = function () {
            this.fallTimer.delay = this.scoringManager.getFallingDelay();
            if (this.softDropKey.isDown || this.softDropScreen.isDown) {
                this.fallTimer.delay = 0.01;
            }
        };
        MainState.prototype.holdControls = function () {
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
        };
        MainState.prototype.update = function () {
            _super.prototype.update.call(this);
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
        };
        MainState.prototype.createNewShape = function (addToGame, shapeName, x, y, debug) {
            if (addToGame === void 0) { addToGame = false; }
            if (shapeName === void 0) { shapeName = ''; }
            if (x === void 0) { x = 4; }
            if (y === void 0) { y = 1; }
            if (debug === void 0) { debug = false; }
            this.currentShape = this.shapeStack.createNewShape(addToGame, shapeName, x, y);
            //always refresh board, because sometimes bug can occur. Most likely because of setTimeouts. I don't like 'em. :(
            this.board.refreshHighestPositions();
            if (debug) {
                this.board.setBlocks(this.currentShape.getBlocks());
            }
        };
        MainState.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            //controls
            this.rotateBothScreen = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['controlArrow'], 95, Tetris.Config.boardHeightInPixels - 30);
            this.rotateBothScreen.rotPointX = this.rotateBothScreen.width * 0.5;
            this.rotateBothScreen.rotPointY = this.rotateBothScreen.height * 0.5;
            this.rotateBothScreen.rotation = Math.PI / 2;
            this.addChild(this.rotateBothScreen);
            this.leftKeyScreen = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['controlArrow'], 30, Tetris.Config.boardHeightInPixels + 35);
            this.addChild(this.leftKeyScreen);
            this.rightKeyScreen = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['controlArrow'], 160, Tetris.Config.boardHeightInPixels + 35);
            this.rightKeyScreen.rotPointX = this.rightKeyScreen.width * 0.5;
            this.rightKeyScreen.rotPointY = this.rightKeyScreen.height * 0.5;
            this.rightKeyScreen.rotation = Math.PI;
            this.addChild(this.rightKeyScreen);
            this.softDropScreen = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['controlArrow'], 95, Tetris.Config.boardHeightInPixels + 100);
            this.softDropScreen.rotPointX = this.softDropScreen.width * 0.5;
            this.softDropScreen.rotPointY = this.softDropScreen.height * 0.5;
            this.softDropScreen.rotation = -Math.PI / 2;
            this.addChild(this.softDropScreen);
            this.rotateClockwiseScreen = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['controlButton'], 210, Tetris.Config.boardHeightInPixels - 30);
            this.rotateClockwiseScreen.scaleX = 0.6;
            this.rotateClockwiseScreen.scaleY = 0.6;
            this.addChild(this.rotateClockwiseScreen);
            this.rotateCounterClockwiseScreen = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['controlButton'], 280, Tetris.Config.boardHeightInPixels - 30);
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
            var scoreText = new Kiwi.GameObjects.TextField(this, "Score", Tetris.Config.boardWidthInPixels, 0, "#000", 24);
            this.addChild(scoreText);
            var score = new Kiwi.GameObjects.TextField(this, "0", Tetris.Config.boardWidthInPixels, 25, "#000", 24);
            this.addChild(score);
            var levelText = new Kiwi.GameObjects.TextField(this, "Level", Tetris.Config.boardWidthInPixels, 60, "#000", 24);
            this.addChild(levelText);
            var level = new Kiwi.GameObjects.TextField(this, "0", Tetris.Config.boardWidthInPixels, 85, "#000", 24);
            this.addChild(level);
            var linesText = new Kiwi.GameObjects.TextField(this, "Lines", Tetris.Config.boardWidthInPixels, 110, "#000", 24);
            this.addChild(linesText);
            var lines = new Kiwi.GameObjects.TextField(this, "0", Tetris.Config.boardWidthInPixels, 135, "#000", 24);
            this.addChild(lines);
            this.boardSprite = new Kiwi.GameObjects.Sprite(this, this.textures.board, Tetris.Config.offsetX + Tetris.Config.borderWidth, Tetris.Config.borderHeight);
            this.boardSprite.input.enabled = true;
            this.addChild(this.boardSprite);
            var borders = new Kiwi.GameObjects.StaticImage(this, this.textures.borders, Tetris.Config.offsetX, 0);
            this.addChild(borders);
            var nextShapeText = new Kiwi.GameObjects.TextField(this, "Next", Tetris.Config.boardWidthInPixels, 170, "#000", 24);
            this.addChild(nextShapeText);
            var nextShapeBorders = new Kiwi.GameObjects.StaticImage(this, this.textures.hudBorders, Tetris.Config.boardWidthInPixels + 20, 235);
            nextShapeBorders.scaleX = 2.5;
            nextShapeBorders.scaleY = 3.5;
            this.addChild(nextShapeBorders);
            var heldShapeText = new Kiwi.GameObjects.TextField(this, "Hold", Tetris.Config.boardWidthInPixels, 320, "#000", 24);
            this.addChild(heldShapeText);
            this.holdSprite = new Kiwi.GameObjects.Sprite(this, this.textures.hudBorders, Tetris.Config.boardWidthInPixels + 20, 385);
            this.holdSprite.scaleX = 2.5;
            this.holdSprite.scaleY = 3.5;
            this.holdSprite.input.enabled = true;
            this.addChild(this.holdSprite);
            //move timer for limiting move amount
            this.moveTimer = this.game.time.clock.createTimer('move', Tetris.Config.moveTimerRate, 0);
            this.moveTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, function () { _this.moveKeyIsDown = false; }, this);
            //add drop timer
            this.fallTimer = this.game.time.clock.createTimer('fall', 0.5, 0);
            this.fallTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.fallDown, this);
            this.board = new Tetris.Board(this);
            this.shapeStack = new Tetris.Shapes.ShapeStack(this);
            this.scoringManager = new Tetris.ScoringManager(1);
            this.hud = new Tetris.Hud(this, this.scoringManager, level, score, lines);
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
/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../lib/kiwi.d.ts" />
/// <reference path="../config.ts" />
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
/// <reference path="lib/kiwi.d.ts" />
/// <reference path="states/menu.ts" />
/// <reference path="states/main.ts" />
/// <reference path="states/game-over.ts" />
/**
* The core TemplateGame game file.
*
* This file is only used to initalise (start-up) the main Kiwi Game
* and add all of the relevant states to that Game.
*
*/
//Initialise the Kiwi Game.
var Tetris;
(function (Tetris) {
    var gameOptions = {
        renderer: Kiwi.RENDERER_CANVAS,
        width: 430,
        height: 800,
        plugins: ['TouchButton']
    };
    var game = new Kiwi.Game('content', 'Tetris', null, gameOptions);
    var menuState = new Tetris.MenuState('menu');
    var mainState = new Tetris.MainState('main');
    var gameOverState = new Tetris.GameOverState('gameOver');
    game.states.addState(menuState);
    game.states.addState(mainState);
    game.states.addState(gameOverState);
    game.states.switchState('menu');
})(Tetris || (Tetris = {}));
/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />
var Tetris;
(function (Tetris) {
    var Shapes;
    (function (Shapes) {
        var ShapeDot = (function (_super) {
            __extends(ShapeDot, _super);
            function ShapeDot(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'red';
                this.name = 'ShapeDot';
                this.addBlock(this.blockColor, x, y, true);
            }
            return ShapeDot;
        })(Shapes.Shape);
        Shapes.ShapeDot = ShapeDot;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />
var Tetris;
(function (Tetris) {
    var Shapes;
    (function (Shapes) {
        var ShapeI = (function (_super) {
            __extends(ShapeI, _super);
            function ShapeI(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'cyan';
                this.name = 'ShapeI';
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y);
                this.addBlock(this.blockColor, x + 1, y);
                this.addBlock(this.blockColor, x + 2, y);
                //invisible center
                this.addCenter(x + 0.5, y + 0.5);
            }
            //return specific rotations for this shape
            ShapeI.prototype.getRotations = function () {
                return ShapeI.rotations;
            };
            ShapeI.prototype.addCenter = function (x, y) {
                this.center = new Tetris.Block(x, y, this.state, null);
            };
            ShapeI.rotations = [
                [[0, 0], [-2, 0], [+1, 0], [-2, -1], [+1, +2]],
                [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]],
                [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]],
                [[0, 0], [+1, 0], [-2, 0], [+1, -2], [-2, +1]],
            ];
            return ShapeI;
        })(Shapes.Shape);
        Shapes.ShapeI = ShapeI;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />
var Tetris;
(function (Tetris) {
    var Shapes;
    (function (Shapes) {
        var ShapeJ = (function (_super) {
            __extends(ShapeJ, _super);
            function ShapeJ(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'blue';
                this.name = 'ShapeJ';
                this.addBlock(this.blockColor, x - 1, y - 1);
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x + 1, y);
            }
            return ShapeJ;
        })(Shapes.Shape);
        Shapes.ShapeJ = ShapeJ;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />
var Tetris;
(function (Tetris) {
    var Shapes;
    (function (Shapes) {
        var ShapeL = (function (_super) {
            __extends(ShapeL, _super);
            function ShapeL(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'orange';
                this.name = 'ShapeL';
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x + 1, y);
                this.addBlock(this.blockColor, x + 1, y - 1);
            }
            return ShapeL;
        })(Shapes.Shape);
        Shapes.ShapeL = ShapeL;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />
var Tetris;
(function (Tetris) {
    var Shapes;
    (function (Shapes) {
        var ShapeO = (function (_super) {
            __extends(ShapeO, _super);
            function ShapeO(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'yellow';
                this.name = 'ShapeO';
                this.addBlock(this.blockColor, x, y - 1);
                this.addBlock(this.blockColor, x, y);
                this.addBlock(this.blockColor, x + 1, y - 1);
                this.addBlock(this.blockColor, x + 1, y);
                this.addCenter(x - 0.5, y - 0.5);
            }
            //No need to do anything
            ShapeO.prototype.rotate = function () { return this; };
            //No need to do anything
            ShapeO.prototype.getNextRotation = function (direction) {
                if (direction === void 0) { direction = 0; }
                return [];
            };
            ShapeO.prototype.addCenter = function (x, y) {
                this.center = new Tetris.Block(x, y, this.state, null);
            };
            return ShapeO;
        })(Shapes.Shape);
        Shapes.ShapeO = ShapeO;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />
var Tetris;
(function (Tetris) {
    var Shapes;
    (function (Shapes) {
        var ShapeS = (function (_super) {
            __extends(ShapeS, _super);
            function ShapeS(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'green';
                this.name = 'ShapeS';
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x, y - 1);
                this.addBlock(this.blockColor, x + 1, y - 1);
            }
            return ShapeS;
        })(Shapes.Shape);
        Shapes.ShapeS = ShapeS;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />
var Tetris;
(function (Tetris) {
    var Shapes;
    (function (Shapes) {
        var ShapeT = (function (_super) {
            __extends(ShapeT, _super);
            function ShapeT(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'purple';
                this.name = 'ShapeT';
                this.addBlock(this.blockColor, x - 1, y);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x, y - 1);
                this.addBlock(this.blockColor, x + 1, y);
            }
            return ShapeT;
        })(Shapes.Shape);
        Shapes.ShapeT = ShapeT;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="shape.ts" />
var Tetris;
(function (Tetris) {
    var Shapes;
    (function (Shapes) {
        var ShapeZ = (function (_super) {
            __extends(ShapeZ, _super);
            function ShapeZ(state, x, y) {
                _super.call(this, state);
                this.blockColor = 'red';
                this.name = 'ShapeZ';
                this.addBlock(this.blockColor, x - 1, y - 1);
                this.addBlock(this.blockColor, x, y - 1);
                this.addBlock(this.blockColor, x, y, true);
                this.addBlock(this.blockColor, x + 1, y);
            }
            return ShapeZ;
        })(Shapes.Shape);
        Shapes.ShapeZ = ShapeZ;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
