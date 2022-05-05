function init() {
  const core = new Core({
    element: utils.htmlElements.gameContainer(),
  });

  // resource cache

  // resource
  // .add('arrowKeys', './images/sprites/other/arrowKeys.png')
  // .add('enterKey', './images/sprites/other/enterKey.png')
  //   .add('skyClear', './images/sprites/background/skyClear.png')
  //   .add('skyDark', './images/sprites/background/skyDark.png')
  //   .add('hill', './images/sprites/background/hill.png')
  //   .add('tree', './images/sprites/background/tree.png')
  //   .add('billboardSega', './images/sprites/other/billboard04.png')
  //   .add('startLights', './images/sprites/other/startLights.png')
  //   .add('startLightsBar', './images/sprites/other/startLightsBar.png')
  //   .add('leftSignal', './images/sprites/other/leftSignal.png')
  //   .add('rightSignal', './images/sprites/other/rightSignal.png')
  //   .add('opponents', './images/sprites/other/opponents.png')
  //   .add('playerLeft', './images/sprites/player/playerLeft.png')
  //   .add('playerRight', './images/sprites/player/playerRight.png')
  //   .load(() => console.log('images loaded'));

  core.init();
}
init();
