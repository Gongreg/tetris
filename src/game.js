/// <reference path="../lib/kiwi.d.ts" />
/// <reference path="states/main.ts" />
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
    width: 400,
    height: 700
};
var game = new Kiwi.Game('content', 'Tetris', null, gameOptions);
var mainState = new MainState('main');
game.states.addState(mainState);
game.states.switchState('main');
//# sourceMappingURL=game.js.map