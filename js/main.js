const canvas = document.querySelector('canvas');

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
  requestAnimationFrame(() => loop(time, render, camera, player, road, width, height));
  render.clear(0, 0, width, height);
  render.save();
  camera.update(road);
  road.render(render, camera, player);
  player.render(render, camera, road.width);
  render.restore();
};

const init = (time) => {
  const render = new Render(canvas.getContext('2d'));
  const camera = new Camera();
  const player = new Player();
  player.sprite.image = resource.get('playerCar');
  const road = new Road();

  camera.cursor = -road.segmentLength * road.rumbleLength * 2; // spawn before startLine
  road.create();
  loop(time, render, camera, player, road, canvas.width, canvas.height);
};

resource
  .add('billboardSega', './images/sprites/billboard04.png')
  .add('playerCar', './images/sprites/player_centerD.png')
  .load(() => {
    requestAnimationFrame((time) => init(time));
  });

// const billboardSega = new Image();
// const playerCar = new Image();
// billboardSega.onload = () => {
//   playerCar.onload = () => {
//   };
//   playerCar.src = './images/sprites/player_straight.png';
// };

// billboardSega.src = './images/sprites/billboard04.png';
