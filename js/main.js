const canvas = document.querySelector('canvas');
let lastTime = 0;
let timeSinceLastFrameSwap = 0;
let actualVal = 0;

const flickerAnim = (player, animDown, animUp) => {
  const playerAnim = player;
  if (playerAnim.sprite.image === resource.get(animDown)) {
    playerAnim.sprite.image = resource.get(animUp);
  } else {
    playerAnim.sprite.image = resource.get(animDown);
  }
};

const findDirection = () => {
  const { arrowleft, arrowright } = keyboard.map;
  if (arrowleft) return 'Left';
  if (arrowright) return 'Right';
  return 'Center';
};

const curveAnim = (player) => {
  const playerAnim = player;
  const { arrowleft, arrowright } = keyboard.map;
  const actualArrow = (playerAnim.sprite.image)
    .src.match(/player\w*\d/g, '')[0].slice(6, -2);
  const tyreDirection = (playerAnim.sprite.image)
    .src.match(/player\w*\d/g, '')[0].slice(-2, -1);
  const otherTyre = tyreDirection === 'D' ? 'U' : 'D';
  const keyPress = findDirection();

  if ((!arrowleft && !arrowright) && actualVal > 0) {
    actualVal = actualVal > 0 ? actualVal -= 1 : 0;
    flickerAnim(player,
      `player${actualArrow}${tyreDirection}${actualVal + 1}`,
      `player${actualArrow}${otherTyre}${actualVal}`);
  }

  if ((!arrowleft && !arrowright) && actualVal === 0) {
    flickerAnim(player, 'playerLeftD0', 'playerLeftU0');
  }

  if (arrowleft || arrowright) {
    if (keyPress === actualArrow) {
      actualVal = actualVal < 5 ? actualVal += 1 : 5;
      if (actualVal === 5) {
        flickerAnim(player,
          `player${keyPress}${tyreDirection}${actualVal}`,
          `player${keyPress}${otherTyre}${actualVal}`);
      } else {
        flickerAnim(player,
          `player${keyPress}${tyreDirection}${actualVal - 1}`,
          `player${keyPress}${otherTyre}${actualVal}`);
      }
    } else if (keyPress !== actualArrow && actualVal > 0) {
      actualVal = actualVal > 0 ? actualVal -= 1 : 0;
      flickerAnim(player,
        `player${actualArrow}${tyreDirection}${actualVal}`,
        `player${actualArrow}${otherTyre}${actualVal}`);
    } else if (keyPress !== actualArrow && actualVal === 0) {
      flickerAnim(player,
        `player${keyPress}${tyreDirection}${actualVal}`,
        `player${keyPress}${otherTyre}${actualVal}`);
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
    // flickerAnim(camera.cursor, road.segmentLength, player, 'playerCenterD', 'playerCenterU');
    curveAnim(player);
    timeSinceLastFrameSwap = 0;
  }
  player.update(camera, road);
  road.render(render, camera, player);
  player.render(render, camera, road.width);
  render.restore();

  // print to screen (a better console.log)
  addItens('#playerSegment', `Segment: ${camera.cursor / 200}`);
  addItens('#playerX', `PlayerX: ${player.x.toFixed(3)}`);
  addItens('#keyMap', `KeyMap: ${JSON.stringify(keyboard.map)}`);
  addItens('#keyPress', `ActualVal: ${JSON.stringify(actualVal)}`);
  addItens('#time', `Time: ${window.performance.now().toFixed(3)}`);
};

const init = (time) => {
  const render = new Render(canvas.getContext('2d'));
  const camera = new Camera();
  const player = new Player();
  player.sprite.image = resource.get('playerLeftD0');
  player.sprite.scaleX = 3;
  const road = new Road();
  // spawn point before startLine
  camera.cursor = -road.segmentLength * road.rumbleLength * 2;
  road.create();
  lastTime = window.performance.now();
  loop(time, render, camera, player, road, canvas.width, canvas.height);
};

resource
  .add('billboardSega', './images/sprites/other/billboard04.png')
  .add('finishLine', './images/sprites/other/finishLine.png')
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
