class GameState {
  constructor() {
    this.mode = 'menuScene';
    this.isTouchActive = window.navigator.maxTouchPoints;
    this.canvasMidpoint = { x: 640 / 2, y: 360 / 2 };
    this.music = null;
    this.menuSelectedOptions = {
      track: 'canada',
      opponents: '19',
      difficulty: 'novato',
      isMusicActive: 'não',
      controls: this.isTouchActive ? 'touch' : 'teclado',
      musicVolume: '1',
      sfxVolume: '1',
      isRPGOn: 'história',
      isRPGOnSave: 'jogo',
      isSingleRaceOn: 'rápida',
    };
  }
}

window.gameState = new GameState();
