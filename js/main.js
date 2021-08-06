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
  // requestAnimationFrame((time) => loop(time, render, camera, player, road, width, height));
  render.clear(0, 0, width, height);
  render.save();
  render.drawTrapezium(200, 350, 200, 250, 75, 150);
  render.restore();
};

const init = (time) => {
  const render = new Render(canvas.getContext('2d'));
  const camera = new Camera();
  const player = new Player();
  const road = new Road();
  loop(time, render, camera, player, road, canvas.width, canvas.height);
};

requestAnimationFrame((time) => init(time));
