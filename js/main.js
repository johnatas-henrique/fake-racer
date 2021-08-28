import Camera from './camera.js';
import Player from './player.js';
import Render from './render.js';
import Road from './road.js';
import {
  canvas, keyboard, resource, addItens, playMusic, formatTime,
} from './util.js';

let lastTime = 0;
let timeSinceLastFrameSwap = 0;
let actualVal = 0;

const tyreAnimation = (player, direction, tyre, invertTyre, spriteNum, speed) => {
  const playerAnim = player;
  if (speed) {
    playerAnim.sprite.image = resource.get(`player${direction}${invertTyre}${spriteNum}`);
  } else {
    playerAnim.sprite.image = resource.get(`player${direction}${tyre}${spriteNum}`);
  }
};

const findDirection = () => {
  const { arrowleft, arrowright } = keyboard.map;
  if (arrowleft) return 'Left';
  if (arrowright) return 'Right';
  return 'Center';
};

const curveAnim = (player, speed) => {
  const playerAnim = player;
  const { arrowleft, arrowright } = keyboard.map;
  const actualImage = playerAnim.sprite.image;
  const actualArrow = actualImage.src.match(/player\w*\d/g, '')[0].slice(6, -2);
  const tyreDirection = actualImage.src.match(/player\w*\d/g, '')[0].slice(-2, -1);
  const otherTyre = tyreDirection === 'D' ? 'U' : 'D';
  const keyPress = findDirection();

  if ((!arrowleft && !arrowright) && actualVal >= 0) {
    actualVal = actualVal > 0 ? actualVal -= 1 : 0;
    tyreAnimation(player, actualArrow, tyreDirection, otherTyre, actualVal, speed);
  }

  if (arrowleft || arrowright) {
    if (keyPress === actualArrow) {
      actualVal = actualVal < 5 ? actualVal += 1 : 5;
      tyreAnimation(player, actualArrow, tyreDirection, otherTyre, actualVal, speed);
    } else if (keyPress !== actualArrow && actualVal > 0) {
      tyreAnimation(player, actualArrow, tyreDirection, otherTyre, actualVal, speed);
      actualVal = actualVal > 0 ? actualVal -= 1 : 0;
    } else if (keyPress !== actualArrow && actualVal === 0) {
      actualVal = 1;
      tyreAnimation(player, keyPress, tyreDirection, otherTyre, actualVal, speed);
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
const loop = (time, render, camera, player, road, width, height) => {
  requestAnimationFrame(() => loop(time, render, camera, player, road, width, height));
  render.clear(0, 0, width, height);
  render.save();
  camera.update(road);
  const timeNow = window.performance.now();
  const elapsed = (timeNow - lastTime) / 1000;
  lastTime = timeNow;
  timeSinceLastFrameSwap += elapsed;
  if (timeSinceLastFrameSwap > player.animationUpdateTime) {
    curveAnim(player, camera.runningPower);
    timeSinceLastFrameSwap = 0;
  }
  player.update(camera, road);
  road.render(render, camera, player);
  player.render(render, camera, road.width);
  render.restore();

  // HUD
  addItens('#current_lap_time_value', formatTime(lastTime));
  addItens('#speed_value', `${(camera.runningPower / 4).toFixed(0)}`);

  // print to screen (a better console.log)
  addItens('#line1', `Segment: ${(camera.cursor / 200).toFixed(3)}`);
  addItens('#line2', `PlayerX: ${player.x.toFixed(3)}`);
  // addItens('#line3', `NoUse: ${(camera.runningPower / 4).toFixed(0)}`);
  addItens('#line4', `Centrifugal: ${player.centrifugalForce.toFixed(3)}`);
  addItens('#line5', `Curve: ${player.curvePower.toFixed(3)}`);
  // addItens('#line6', `NoUse: ${window.performance.now().toFixed(3)}`);
};

const init = (time) => {
  const render = new Render(canvas.getContext('2d'));
  const camera = new Camera();
  const player = new Player();
  player.sprite.image = resource.get('playerLeftD0');
  player.sprite.scaleX = 2.85;
  const road = new Road();
  // spawn point before startLine
  camera.cursor = -road.segmentLength * road.rumbleLength * 2;
  road.create(4004);
  lastTime = window.performance.now();
  loop(time, render, camera, player, road, canvas.width, canvas.height);
  playMusic();
};

resource
  .add('billboardSega', './images/sprites/other/billboard04.png')
  .add('startLine', './images/sprites/other/startLine.png')
  .add('leftSignal', './images/sprites/other/leftSignal.png')
  .add('rightSignal', './images/sprites/other/rightSignal.png')
  .add('playerLeftD0', './images/sprites/player/playerLeftD0.png')
  .add('playerLeftU0', './images/sprites/player/playerLeftU0.png')
  .add('playerLeftD1', './images/sprites/player/playerLeftD1.png')
  .add('playerLeftU1', './images/sprites/player/playerLeftU1.png')
  .add('playerLeftD2', './images/sprites/player/playerLeftD2.png')
  .add('playerLeftU2', './images/sprites/player/playerLeftU2.png')
  .add('playerLeftD3', './images/sprites/player/playerLeftD3.png')
  .add('playerLeftU3', './images/sprites/player/playerLeftU3.png')
  .add('playerLeftD4', './images/sprites/player/playerLeftD4.png')
  .add('playerLeftU4', './images/sprites/player/playerLeftU4.png')
  .add('playerLeftD5', './images/sprites/player/playerLeftD5.png')
  .add('playerLeftU5', './images/sprites/player/playerLeftU5.png')
  .add('playerRightD0', './images/sprites/player/playerRightD0.png')
  .add('playerRightU0', './images/sprites/player/playerRightU0.png')
  .add('playerRightD1', './images/sprites/player/playerRightD1.png')
  .add('playerRightU1', './images/sprites/player/playerRightU1.png')
  .add('playerRightD2', './images/sprites/player/playerRightD2.png')
  .add('playerRightU2', './images/sprites/player/playerRightU2.png')
  .add('playerRightD3', './images/sprites/player/playerRightD3.png')
  .add('playerRightU3', './images/sprites/player/playerRightU3.png')
  .add('playerRightD4', './images/sprites/player/playerRightD4.png')
  .add('playerRightU4', './images/sprites/player/playerRightU4.png')
  .add('playerRightD5', './images/sprites/player/playerRightD5.png')
  .add('playerRightU5', './images/sprites/player/playerRightU5.png')
  .load(() => {
    requestAnimationFrame((time) => init(time));
  });
