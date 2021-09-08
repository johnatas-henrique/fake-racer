import Background from './background.js';
import Camera from './camera.js';
import Director from './director.js';
import Player from './player.js';
import Render from './render.js';
import Road from './road.js';
import {
  canvas, handleInput, addItens, playMusic, resource,
} from './util.js';

let lastTime = 0;
let timeSinceLastFrameSwap = 0;
let actualVal = 0;

const tyreAnimation = (player, spriteNum, speed) => {
  const playerAnim = player;
  if (speed) {
    playerAnim.sprite.sheetPositionX = spriteNum;
    playerAnim.sprite.sheetPositionY = Number(!playerAnim.sprite.sheetPositionY);
  } else {
    playerAnim.sprite.sheetPositionX = spriteNum;
  }
};

const findDirection = () => {
  const { arrowleft, arrowright } = handleInput.map;
  if (arrowleft) return 'Left';
  if (arrowright) return 'Right';
  return 'Center';
};

const curveAnim = (player, speed) => {
  const playerAnim = player;
  const { arrowleft, arrowright } = handleInput.map;
  const actualImage = playerAnim.sprite.image;
  const actualArrow = actualImage.src.match(/player\w+/g, '')[0].slice(6);
  const keyPress = findDirection();
  if ((!arrowleft && !arrowright) && actualVal >= 0) {
    actualVal = actualVal > 0 ? actualVal -= 1 : 0;
    tyreAnimation(player, actualVal, speed);
  }

  if (arrowleft || arrowright) {
    if (keyPress === actualArrow) {
      actualVal = actualVal < 5 ? actualVal += 1 : 5;
      tyreAnimation(player, actualVal, speed);
    } else if (keyPress !== actualArrow && actualVal > 0) {
      tyreAnimation(player, actualVal, speed);
      actualVal = actualVal > 0 ? actualVal -= 1 : 0;
    } else if (keyPress !== actualArrow && actualVal === 0) {
      actualVal = 1;
      playerAnim.sprite.image = resource.get(`player${keyPress}`);
      tyreAnimation(player, actualVal, speed);
    }
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
const loop = (time, render, camera, player, road, background, director, width, height) => {
  requestAnimationFrame(() => loop(
    time, render, camera, player, road, background, director, width, height,
  ));
  render.clear(0, 0, width, height);
  render.save();
  camera.update(road, director);
  const timeNow = window.performance.now();
  const elapsed = (timeNow - lastTime) / 1000;
  lastTime = timeNow;
  timeSinceLastFrameSwap += elapsed;
  if (timeSinceLastFrameSwap > player.animationUpdateTime) {
    curveAnim(player, player.runningPower);
    timeSinceLastFrameSwap = 0;
  }
  player.update(camera, road, director);
  background.update(player, camera, road);
  background.render(render, camera, player, road.width);
  road.render(render, camera, player);
  player.render(render, camera, road.width);
  director.update(player);
  render.restore();

  // print to screen (a better console.log)
  addItens('#line1', `Segment: ${(camera.cursor / 200).toFixed(3)}`);
  addItens('#line2', `CameraY: ${camera.y.toFixed(3)}`);
  // addItens('#line3', `NoUse: ${camera.z.toFixed(3)}`);
  addItens('#line4', `Centrifugal: ${player.centrifugalForce.toFixed(3)}`);
  addItens('#line5', `Curve: ${player.curvePower.toFixed(3)}`);
  // addItens('#line6', `NoUse: ${window.performance.now().toFixed(3)}`);
};

const init = (time) => {
  const render = new Render(canvas.getContext('2d'));
  const camera = new Camera();
  const director = new Director();
  const player = new Player();
  player.sprite.image = resource.get('playerRight');
  player.sprite.spritesInX = 6;
  player.sprite.spritesInY = 2;
  player.sprite.sheetPositionY = 1;
  player.sprite.scaleX = 2.5;
  player.sprite.scaleY = 3;
  const road = new Road('brazil');
  const background = new Background();
  road.create();
  background.create();
  lastTime = window.performance.now();
  playMusic();

  // spawn point before startLine
  camera.cursor = -road.segmentLength * road.rumbleLength * 2;
  player.x = 0;

  loop(time, render, camera, player, road, background, director, canvas.width, canvas.height);
};

resource
  .add('sky', './images/sprites/background/sky.png')
  .add('hill', './images/sprites/background/hill.png')
  .add('tree', './images/sprites/background/tree.png')
  .add('billboardSega', './images/sprites/other/billboard04.png')
  .add('startLine', './images/sprites/other/startLine.png')
  .add('leftSignal', './images/sprites/other/leftSignal.png')
  .add('rightSignal', './images/sprites/other/rightSignal.png')
  .add('playerLeft', './images/sprites/player/playerLeft.png')
  .add('playerRight', './images/sprites/player/playerRight.png')

  .load(() => {
    requestAnimationFrame((time) => init(time));
  });
