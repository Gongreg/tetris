module Tetris {
    export class Config {
        static borderWidth: number = 4;
        static borderHeight: number = 4;
        static tileSize: number = 30;
        static offsetX: number = 40;
        static offsetY: number = -2 * (Config.tileSize - 1);
        static boardWidth: number = 10;
        static boardWidthInPixels: number = Config.offsetX + Config.borderWidth * 2 + Config.boardWidth * Config.tileSize;
        static boardHeight: number = 22;
        static moveTimerRate = 0.1;
    }
}
