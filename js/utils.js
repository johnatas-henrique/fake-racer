const utils = {
  htmlElements: {
    gameContainer: () => document.querySelector('.game-container'),
    canvas: () => document.querySelector('.game-canvas'),
    pauseMenu: () => document.querySelector('.keyboard-menu'),
    descriptionPauseMenu: () => document.querySelector('.description-box'),
    fps: () => document.querySelector('.fps'),
    fullScreenBtn: () => document.querySelector('.fullscreen-btn'),
    pauseBtn: () => document.querySelector('.pause-btn'),
    muteBtn: () => document.querySelector('.mute-btn'),
  },
  keyUnbinder: (keyToUnbind, coreClass) => (
    coreClass.inputs.keyPressListeners
      .find(({ keyCode }) => keyCode === keyToUnbind).unbind()
  ),
  keyInitializer: (keyToUnbind, coreClass) => (
    coreClass.inputs.keyPressListeners
      .find(({ keyCode }) => keyCode === keyToUnbind).init()
  ),
  classToggler: (htmlEl, cssClass) => {
    utils.htmlElements[htmlEl]().classList.toggle(cssClass);
  },
  classRemover: (htmlEl, cssClass) => {
    utils.htmlElements[htmlEl]().classList.remove(cssClass);
  },

  // RPG Functions
  withGrid: (n) => (n * 16),
  asGridCoord: (x, y) => `${x * 16},${y * 16}`,
  nextPosition: (initialX, initialY, direction) => {
    let x = initialX;
    let y = initialY;
    const size = 16;
    if (direction === 'left') {
      x -= size;
    } else if (direction === 'right') {
      x += size;
    } else if (direction === 'up') {
      y -= size;
    } else if (direction === 'down') {
      y += size;
    }
    return { x, y };
  },
  emitEvent: (name, detail) => {
    const event = new CustomEvent(name, { detail });
    document.dispatchEvent(event);
  },
  oppositeDirection: (direction) => {
    if (direction === 'left') return 'right';
    if (direction === 'right') return 'left';
    if (direction === 'up') return 'down';
    return 'up';
  },
  chooseTalk: (win, lose, result) => {
    if (result) return win;
    return lose;
  },
  changeTalk: (newMessage, eventsArr, oldMessage) => {
    const eventItem = eventsArr.find((item) => {
      const [depends, loseAlready] = oldMessage;
      return item.text === depends || item.text === loseAlready;
    });
    eventItem.text = newMessage;
  },
  hasEventTextWin: (winMessage, eventsArr) => (
    eventsArr.find((item) => (item.text === winMessage))
  ),

  // Race Functions
  secondInMS: 1000,
  fieldOfView: (120 / 180) * Math.PI,
  theta: (120 / 180) * Math.PI * 0.5,
  addItens: (liId, text) => {
    const li = document.querySelector(liId);
    li.textContent = text;
  },
  toggleMusic: (_e, toggle, volume = '2') => {
    const music = document.getElementById('music');
    const mute = document.getElementById('mute');

    music.volume = Number(volume) / 10;
    if (!toggle) {
      music.play();
      mute.classList.toggle('off');
      music.muted = !music.muted;
    }

    if (toggle === 'sim') {
      music.play();
      mute.classList.remove('off');
      music.muted = false;
    } else if (toggle === 'não') {
      mute.classList.add('off');
      music.muted = true;
    }
  },
  playMusic: () => {
    const music = document.getElementById('music');
    const mute = document.getElementById('mute');
    music.loop = true;
    music.volume = 0.3;
    music.muted = 'true';
    mute.classList.toggle('off');
    mute.addEventListener('click', utils.toggleMusic);
  },
  formatTime: (dt) => {
    const time = Math.round(dt);
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor(time / 1000) - (minutes * 60);
    const tenths = time.toString().slice(-3);
    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}.${time < 100 ? '000' : tenths}`;
  },
  startPosition: (trackSize, position) => (trackSize - (position * 16)) * 200,
  overlap: (x1, w1, x2, w2, percent = 1) => {
    const half = percent / 2;
    const callerL = x1 - (w1 * half);
    const callerR = x1 + (w1 * half);
    const objL = x2 - (w2 * half);
    const objR = x2 + (w2 * half);
    return !((callerR < objL) || (callerL > objR));
  },
  calcCrashSpeed: (callerSpd, objSpd, objMult) => {
    if (!objMult) return 0;
    if (!objSpd) return ((callerSpd + objSpd) * 0.5) * objMult;
    if (callerSpd - objSpd <= 120) return callerSpd - 120;
    return Math.max(callerSpd - ((callerSpd - objSpd) * 1.6), 20);
  },
  // const pause = (e, state) => {
  //   const pauseState = state;
  //   const pauseBtn = document.querySelector('#pauseBtn');
  //   pauseBtn.classList.toggle('off');
  //   if (!window.navigator.maxTouchPoints && e.type !== 'keypress') {
  //     pauseState.p = !pauseState.p;
  //   }
  // };
  updateOpponentsCarOffset: (car, player, director, oppArr) => {
    const carParam = car;
    const playerParam = player;
    const oppArrParam = oppArr;
    const lookAhead = 40;
    const crash = 8;
    const { carSegments: carSeg } = director;
    const cSeg = (carSeg.find(({ name }) => name === carParam.opponentName));
    const arrObjSeg = carSeg.filter(({ pos }) => pos < cSeg.pos + lookAhead && pos > cSeg.pos);
    const objCrash = carSeg.find(({ pos }) => pos < cSeg.pos + crash && pos > cSeg.pos);
    let dir = carParam.opponentX;
    if (cSeg && cSeg.x <= -1.65) dir = 0.5;
    if (cSeg && cSeg.x >= 1.65) dir = -0.5;
    arrObjSeg.forEach((objSeg) => {
      if (objSeg && objSeg.name !== playerParam.name) {
        const isOverlapped = utils.overlap(cSeg.x, 0.663125, objSeg.x, 0.663125, 1);

        if (isOverlapped) {
          const changeX = 1;
          const diffCarsX = Math.abs(objSeg.x - cSeg.x);

          if (objSeg.x > 1 || (objSeg.x > 0 && diffCarsX < 0.3)) dir = -changeX;
          if (objSeg.x < -1 || (objSeg.x < 0 && diffCarsX < 0.3)) dir = changeX;
          if (objCrash && objCrash.name !== playerParam.name) {
            const opp = oppArrParam.findIndex(({ opponentName }) => opponentName === objCrash.name);
            oppArrParam[opp].actualSpeed *= 1.02;
            carParam.actualSpeed *= 0.98;
          }
        }
      }
      if (objSeg && objSeg.name === playerParam.name && !car.isCrashed) {
        const isOverlapped = utils.overlap(cSeg.x, 0.663125, objSeg.x, 0.8, 1.2);

        if (carParam.actualSpeed > playerParam.actualSpeed && isOverlapped) {
          const changeX = 5;
          const diffCarsX = Math.abs(objSeg.x - cSeg.x);
          if (objSeg.x > 0.95 || (objSeg.x > 0 && diffCarsX < 0.4)) dir = changeX * -1;
          else if (objSeg.x < -0.95 || (objSeg.x < 0 && diffCarsX < 0.4)) dir = changeX;

          if (objCrash) {
            const x = (carParam.actualSpeed - playerParam.actualSpeed) / 2;
            playerParam.actualSpeed += x * 1.8;
          }
        }
      }
    });
    return dir;
  },
  degToRad: (angle) => ((angle * Math.PI) / 180),
  speedToDeg: (speed, maxSpeed, startAngle, finalAngle) => {
    const angle = finalAngle - startAngle;
    const ratioSpeed = speed / maxSpeed;
    return -30 + ratioSpeed * angle;
  },
  playerFPS: (speed) => (Math.min((speed / 32 + 10), 40)),
};
