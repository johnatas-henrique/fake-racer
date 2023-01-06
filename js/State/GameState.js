class GameState {
  constructor() {
    this.mode = 'menuScene';
    this.canvasMidpoint = { x: 640 / 2, y: 360 / 2 };
    this.music = null;
    this.menuSelectedOptions = {
      track: 'canada',
      opponents: '19',
      difficulty: 'novato',
      isMusicActive: 'não',
      musicVolume: '1',
      isRPGOn: 'história',
      isRPGOnSave: 'jogo',
      isSingleRaceOn: 'rápida',
    };
  }
}

window.gameState = new GameState();
