window.gameContent = {};

const utils = {
  pixelBase: 16,
  htmlElements: {
    gameContainer: () => document.querySelector('.game-container'),
    gameCanvas: () => document.querySelector('.game-canvas'),
    pauseMenu: () => document.querySelector('.keyboard-menu'),
    descriptionPauseMenu: () => document.querySelector('.description-box'),
    fps: () => document.querySelector('.fps'),
    fullScreenBtn: () => document.querySelector('.fullscreen-btn'),
    pauseBtn: () => document.querySelector('.pause-btn'),
    muteBtn: () => document.querySelector('.mute-btn'),
  },
  changeMode(newGameState, coreClass) {
    window.gameState.mode = newGameState;
    utils.keyUnbinder('Enter', coreClass);
    if (newGameState === 'menuScene') {
      utils.classRemover('gameCanvas', 'pixelated');
      utils.htmlElements.gameCanvas().width = 640;
      utils.htmlElements.gameCanvas().height = 360;
      coreClass.overworld.isInitOnce = false;
      coreClass.menu.init();
    }
    if (newGameState === 'singleRaceScene') {
      utils.classRemover('gameCanvas', 'pixelated');
      utils.htmlElements.gameCanvas().width = 640;
      utils.htmlElements.gameCanvas().height = 360;
      coreClass.singleRace = new coreClass.RaceClass({ core: coreClass });
      coreClass.singleRace.init();
    }
    if (newGameState === 'historyRaceScene') {
      utils.classRemover('gameCanvas', 'pixelated');
      utils.htmlElements.gameCanvas().width = 640;
      utils.htmlElements.gameCanvas().height = 360;
    }
    if (newGameState === 'RPGScene') {
      utils.classAdder('gameCanvas', 'pixelated');
      utils.htmlElements.gameCanvas().width = 320;
      utils.htmlElements.gameCanvas().height = 180;
      coreClass.overworld.init();
    }
    utils.emitEvent('canvasResized');
  },
  keyUnbinder: (keyToUnbind, coreClass) => {
    const callback = ({ keyCode }) => keyCode === keyToUnbind;
    coreClass.inputs.keyPressListeners.find(callback)?.unbind();
    const index = coreClass.inputs.keyPressListeners.findIndex(callback);

    if (index !== -1) {
      coreClass.inputs.keyPressListeners.splice(index, 1);
    }
  },
  keyInitializer: (keyToUnbind, coreClass) => {
    coreClass.inputs.keyPressListeners
      .find(({ keyCode }) => keyCode === keyToUnbind).init();
  },
  classToggler: (htmlEl, cssClass) => {
    utils.htmlElements[htmlEl]().classList.toggle(cssClass);
  },
  classRemover: (htmlEl, cssClass) => {
    utils.htmlElements[htmlEl]().classList.remove(cssClass);
  },
  classAdder: (htmlEl, cssClass) => {
    utils.htmlElements[htmlEl]().classList.add(cssClass);
  },
  resolutionChanger: () => {
    const { width, height } = utils.htmlElements.gameCanvas();
    window.gameState.canvasMidpoint.x = width / 2;
    window.gameState.canvasMidpoint.y = height / 2;
  },
  wait(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
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
  itemFunctions: {
    changeStatus: (type, value) => {
      window.playerState[`update${type.charAt(0).toUpperCase() + type.slice(1)}`](value);
    },
    nothing: () => {},
    history: () => { console.error('criar função para uso'); },
  },

  // Race Functions
  secondInMS: 1000,
  fieldOfView: (120 / 180) * Math.PI,
  theta: (120 / 180) * Math.PI * 0.5,
  addItens: (liId, text) => {
    const li = document.querySelector(liId);
    li.textContent = text;
  },
  changeMusic: () => {
    const nextPosition = Math.round(Math.random() * (window.musicList.length - 1));
    window.gameState.music = window.musicList[nextPosition];
    window.music[window.musicList[nextPosition]].play();
  },
  playMusic: (chosenMusic) => {
    window.music[chosenMusic].volume(window.gameState.menuSelectedOptions.musicVolume / 10);
    if (!window.music[chosenMusic].playing()) {
      window.music[chosenMusic].play();
      utils.htmlElements.muteBtn().classList.remove('off');
    }
  },
  stopMusic: (chosenMusic) => {
    const nextPosition = Math.round(Math.random() * (window.musicList.length - 1));
    window.music[chosenMusic].stop();
    window.gameState.music = window.musicList[nextPosition];
    utils.htmlElements.muteBtn().classList.add('off');
  },
  formatTime: (dt, minute = false) => {
    const time = Math.round(dt);
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor(time / 1000) - (minutes * 60);
    const tenths = time.toString().slice(-3);

    if (!minute) return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}.${time < 100 ? '000' : tenths}`;
    return `${seconds}.${time < 100 ? '000' : tenths}`;
  },
  startPosition: (trackSize, position) => (trackSize - (position * 24)) * 200,
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
  degToRad: (angle) => ((angle * Math.PI) / 180),
  rpmToDeg: (actual, minSpd, maxSpd, startAngle, finalAngle) => {
    const angle = finalAngle - startAngle;
    const x = ((maxSpd - actual) / (maxSpd - minSpd));
    const ratioRPM = Math.min(1, 1 - Math.min(x, 1));
    return startAngle + (ratioRPM * angle);
  },
  getCirclePoint(x, y, radius, angle, correction = 1) {
    const radian = (angle / 180) * Math.PI;
    return {
      x: x + radius * Math.cos(radian) * correction, y: y + radius * Math.sin(radian) * correction,
    };
  },
  playerFPS: (speed) => (Math.min((speed / 32 + 10), 40)),
};

export default utils;
