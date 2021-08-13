const canvas = document.querySelector('canvas');

const flickerAnim = (camera, road, playerAnim, animDown, animUp) => {
  (camera.cursor / road.segmentLength % 2 === 0)
    ? playerAnim.sprite.image = resource.get(animDown)
    : playerAnim.sprite.image = resource.get(animUp);
};

const curveAnim = (playerAnim) => {
  if (keyboard.isKeyDown('arrowleft')) {
    playerAnim.sprite.image = resource.get('playerCarLeft1D');
  } else if (keyboard.isKeyDown('arrowright')) {
    playerAnim.sprite.image = resource.get('playerCarLeft1D');
  }
};

/**
 *
 * @param {Number} time
 * @param {Render} render
 * @param {Camera} camera
 * @param {Player} player
 * @param {Road} road
 * @param {Number} width
 * @param {Number} height
 */
const loop = (time, render, camera, player, road, width, height) => {
  const playerAnim = player;
  requestAnimationFrame(() => loop(time, render, camera, player, road, width, height));
  render.clear(0, 0, width, height);
  render.save();
  camera.update(road);
  // keyboard.update();
  flickerAnim(camera, road, playerAnim, 'playerCarCenterD', 'playerCarCenterU');
  // curveAnim(playerAnim);
  player.update();
  road.render(render, camera, player);
  player.render(render, camera, road.width);
  render.restore();
};

const init = (time) => {
  const render = new Render(canvas.getContext('2d'));
  const camera = new Camera();
  const player = new Player();
  player.sprite.image = resource.get('playerCarCenterD');
  player.sprite.scaleX = 3;
  const road = new Road();
  camera.cursor = -road.segmentLength * road.rumbleLength * 2; // spawn before startLine
  road.create();
  loop(time, render, camera, player, road, canvas.width, canvas.height);
};

resource
  .add('billboardSega', './images/sprites/other/billboard04.png')
  .add('finishLine', './images/sprites/other/finishLine.png')
  .add('playerCarCenterD', './images/sprites/player/centerDown.png')
  .add('playerCarCenterU', './images/sprites/player/centerUp.png')
  .add('playerCarLeft1D', './images/sprites/player/car01.png')
  .load(() => {
    requestAnimationFrame((time) => init(time));
  });
