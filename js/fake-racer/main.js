window.onload = () => {
  const containerCanvas = document.querySelector('.container');
  containerCanvas.height = Math.min(window.innerHeight, (0.5625 * window.innerWidth));
};

const handleInput = new HandleInput();


const stats = new Stats();
stats.showPanel(0);
const fps = document.querySelector('#fps');
fps.appendChild(stats.dom);

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
const loop = (
  time,
  render,
  camera,
  player,
  oppArr,
  road,
  bg,
  director,
  menu,
  tachometer,
  width,
  height,
) => {
  stats.begin();

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
    if (directorParam.timeSinceLastFrameSwap > player.animationUpdateTime && directorParam.paused) {
      curveAnim(playerParam, playerParam.runningPower);
      directorParam.timeSinceLastFrameSwap = 0;
    }
    playerParam.update(cameraParam, road, directorParam, oppArr);
    oppArr.forEach((opponent) => opponent.update(road, directorParam, playerParam, oppArr));
    bg.update(playerParam, cameraParam, road, directorParam);
    directorParam.update(playerParam, oppArr);
    tachometer.update(playerParam, directorParam);
    bg.render(render, cameraParam, playerParam, road.width);
    road.render(render, cameraParam, playerParam);
    playerParam.render(render, cameraParam, road.width, directorParam);
    directorParam.render(render, playerParam);
    tachometer.render(render);

    if (director.raining) bg.layer1.image = resource.get('skyDark');

    render.restore();

    // print to screen (a better console.log)
    addItens('#line1', `Position: ${position} / ${Number(menu.selectedOptions[1]) + 1}`);
    utils.addItens('#line1', `Segment: ${(cameraParam.cursor / 200).toFixed(3)}`);
    utils.addItens('#line2', `CameraY: ${cameraParam.y.toFixed(3)}`);
    // addItens('#line3', `NoUse: ${playerParam.z.toFixed(3)}`);
    // addItens('#line4', `Centrifugal: ${playerParam.centrifugalForce.toFixed(3)}`);
    // addItens('#line5', `Curve: ${playerParam.curvePower.toFixed(3)}`);
    // addItens('#line6', `PlayerX: ${playerParam.x.toFixed(3)}`);
  }

  if (menu.state === 'title') {
    const { selectedOptions } = menu;

    const timeNow = window.performance.now();
    const elapsed = (timeNow - directorParam.realTime) / 1000;
    directorParam.realTime = timeNow;
    directorParam.timeSinceLastFrameSwap += elapsed;

    if (menu.updateAnimationsTime) menu.animations.forEach((item) => item.update());

    if (directorParam.timeSinceLastFrameSwap > menu.updateTime) {
      menu.update(playerParam, road, oppArr, directorParam);
      utils.toggleMusic('event', selectedOptions[3], selectedOptions[4]);
      directorParam.timeSinceLastFrameSwap = 0;
    }

    menu.render(render);

    // spawn point before startLine
    const { trackSize } = utils.tracks[selectedOptions[0]];
    const qualyPos = Number(selectedOptions[1]) + 1;
    cameraParam.cursor = utils.startPosition(trackSize, qualyPos);
    playerParam.x = qualyPos % 2 ? -1 : 1;

    // for test, enter race on page load
    // menu.startRace(player, road, oppArr, directorParam);
    // directorParam.startTimer = 0;
    // fps.firstElementChild.classList.remove('hidden');
    // const pauseBtn = document.querySelector('#pauseBtn');
    // const mute = document.querySelector('#mute');
    // pauseBtn.classList.toggle('hidden');
    // mute.classList.toggle('hidden');
    // menu.state = 'race';
  }

  stats.end();

  requestAnimationFrame(() => loop(
    time,
    render,
    cameraParam,
    playerParam,
    oppArr,
    road,
    bg,
    directorParam,
    menu,
    tachometer,
    width,
    height,
  ));
};

const initialize = (time) => {
  const { width, height } = utils.canvas;
  const opponents = [];

  const render = new Render(utils.canvas.getContext('2d'));
  const camera = new Camera();
  const director = new Director();
  const player = new Player();
  const road = new Road();
  const background = new Background();
  const menu = new Menu(width, height, window.particles);
  const tachometer = new Tachometer();

  background.create();
  utils.playMusic();

  loop(
    time,
    render,
    camera,
    player,
    opponents,
    road,
    background,
    director,
    menu,
    tachometer,
    width,
    height,
  );
};

resource
  .add('skyClear', './images/sprites/background/skyClear.png')
  .add('skyDark', './images/sprites/background/skyDark.png')
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
  .load(() => requestAnimationFrame((time) => initialize(time)));
