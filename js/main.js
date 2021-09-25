import Background from './background.js';
import Camera from './camera.js';
import Director from './director.js';
import Menu from './menu.js';
import Player from './player.js';
import Render from './render.js';
import Road from './road.js';
import {
  canvas, handleInput, addItens, playMusic, resource, startPosition, tracks, toggleMusic,
} from './util.js';

window.onload = () => {
  const containerCanvas = document.querySelector('.container');
  containerCanvas.height = Math.min(window.innerHeight, (0.5625 * window.innerWidth));
};

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
const loop = (time, render, camera, player, oppArr, road, bg, director, menu, width, height) => {
  const directorParam = director;
  const cameraParam = camera;
  const playerParam = player;

  render.clear(0, 0, width, height);
  render.save();

  if (menu.state === 'race') {
    const timeNow = window.performance.now();
    const elapsed = (timeNow - directorParam.realTime) / 1000;
    directorParam.realTime = timeNow;
    directorParam.timeSinceLastFrameSwap += elapsed;
    if (directorParam.timeSinceLastFrameSwap > playerParam.animationUpdateTime) {
      curveAnim(playerParam, playerParam.runningPower);
      directorParam.timeSinceLastFrameSwap = 0;
    }
    playerParam.update(cameraParam, road, directorParam);
    oppArr.forEach((opponent) => opponent.update(road, directorParam));
    bg.update(playerParam, cameraParam, road);
    bg.render(render, cameraParam, playerParam, road.width);
    road.render(render, cameraParam, playerParam);
    playerParam.render(render, cameraParam, road.width, directorParam);
    directorParam.update(playerParam, oppArr);
    directorParam.render(render);

    render.restore();

    // print to screen (a better console.log)
    // addItens('#line1', `Position: ${position} / ${Number(menu.selectedOptions[1]) + 1}`);
    // addItens('#line1', `Segment: ${(cameraParam.cursor / 200).toFixed(3)}`);
    // addItens('#line2', `CameraY: ${cameraParam.y.toFixed(3)}`);
    // addItens('#line3', `NoUse: ${cameraParam.z.toFixed(3)}`);
    // addItens('#line4', `Centrifugal: ${playerParam.centrifugalForce.toFixed(3)}`);
    // addItens('#line5', `Curve: ${playerParam.curvePower.toFixed(3)}`);
    // addItens('#line6', `NoUse: ${window.performance.now().toFixed(3)}`);
  }

  if (menu.state === 'title') {
    const { selectedOptions } = menu;

    const timeNow = window.performance.now();
    const elapsed = (timeNow - directorParam.realTime) / 1000;
    directorParam.realTime = timeNow;
    directorParam.timeSinceLastFrameSwap += elapsed;

    if (directorParam.timeSinceLastFrameSwap > menu.updateTime) {
      menu.update(playerParam, road, oppArr, directorParam);
      toggleMusic('event', selectedOptions[2], selectedOptions[3]);
      directorParam.timeSinceLastFrameSwap = 0;
    }

    menu.render(render);

    // spawn point before startLine
    const { trackSize } = tracks[selectedOptions[0]];
    const qualyPos = Number(selectedOptions[1]) + 1;
    cameraParam.cursor = startPosition(trackSize, qualyPos);
    playerParam.x = qualyPos % 2 ? -1 : 1;

    // for test, enter race on page load
    // const hud = document.querySelector('#hud');
    // hud.classList.remove('hidden');
    // menu.startRace(player, road, oppArr, directorParam);
    // menu.state = 'race';
  }

  requestAnimationFrame(() => loop(
    time, render, cameraParam, playerParam, oppArr, road, bg, directorParam, menu, width, height,
  ));
};

const init = (time) => {
  const { width, height } = canvas;
  const opponents = [];

  const render = new Render(canvas.getContext('2d'));
  const camera = new Camera();
  const director = new Director();
  const player = new Player();
  const road = new Road();
  const background = new Background();
  const menu = new Menu(width, height);

  background.create();
  playMusic();

  loop(time, render, camera, player, opponents, road, background, director, menu, width, height);
};

resource
  .add('sky', './images/sprites/background/sky.png')
  .add('hill', './images/sprites/background/hill.png')
  .add('tree', './images/sprites/background/tree.png')
  .add('arrowKeys', './images/sprites/other/arrowKeys.png')
  .add('enterKey', './images/sprites/other/enterKey.png')
  .add('billboardSega', './images/sprites/other/billboard04.png')
  .add('startLights', './images/sprites/other/startLights.png')
  .add('startLightsBar', './images/sprites/other/startLightsBar.png')
  .add('leftSignal', './images/sprites/other/leftSignal.png')
  .add('rightSignal', './images/sprites/other/rightSignal.png')
  .add('opponents', './images/sprites/other/opponents.png')
  .add('playerLeft', './images/sprites/player/playerLeft.png')
  .add('playerRight', './images/sprites/player/playerRight.png')
  .load(() => requestAnimationFrame((time) => init(time)));
