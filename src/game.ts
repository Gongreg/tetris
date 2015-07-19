/// <reference path="../lib/kiwi.d.ts" />
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

var gameOptions = {
	renderer: Kiwi.RENDERER_CANVAS, 
	width: 430,
	height: 600
};

var game = new Kiwi.Game('content', 'Tetris', null, gameOptions);

var mainState = new Tetris.MainState('main');
var gameOverState = new Tetris.GameOverState('gameOver');

game.states.addState(mainState);
game.states.addState(gameOverState);
game.states.switchState('main');