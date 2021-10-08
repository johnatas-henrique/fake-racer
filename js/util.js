import HandleInput from './handleInput.js';
import Resource from './resource.js';

const canvas = document.querySelector('canvas');
const fieldOfView = (120 / 180) * Math.PI;
const theta = fieldOfView * 0.5;

const handleInput = new HandleInput();
const resource = new Resource();

const addItens = (liId, text) => {
  const li = document.querySelector(liId);
  li.textContent = text;
};

const toggleMusic = (_e, toggle, volume = '5') => {
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
};

const playMusic = () => {
  const music = document.getElementById('music');
  const mute = document.getElementById('mute');
  music.loop = true;
  music.volume = 0.3;
  music.muted = 'true';
  mute.classList.toggle('off');
  mute.addEventListener('click', toggleMusic);
};

const formatTime = (dt) => {
  const time = Math.round(dt);
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor(time / 1000) - (minutes * 60);
  const tenths = time.toString().slice(-3);
  return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}.${time < 100 ? '000' : tenths}`;
};

const startPosition = (trackSize, position) => (trackSize - (position * 16)) * 200;

const overlap = (x1, w1, x2, w2, percent = 1) => {
  const half = percent / 2;
  const callerL = x1 - (w1 * half);
  const callerR = x1 + (w1 * half);
  const objL = x2 - (w2 * half);
  const objR = x2 + (w2 * half);
  return !((callerR < objL) || (callerL > objR));
};

const calcCrashSpeed = (callerSpd, objSpd, objMult) => {
  if (!objMult) return 0;
  if (!objSpd) return ((callerSpd + objSpd) * 0.5) * objMult;
  if (callerSpd - objSpd <= 120) return callerSpd - 120;
  return Math.max(callerSpd - ((callerSpd - objSpd) * 1.6), 20);
};

const tracks = {
  // straight track used in development
  // test: {
  //   trackSize: 6656,
  //   laps: 78,
  //   curves: [

  //     // { min: 628, max: 6656, curveInclination: 1 },
  //   ],
  //   hills: [
  //     { initialSegment: 665, size: 0, altimetry: 0 },
  //   ],
  //   tunnels: [
  //     {
  //       min: 0, max: 0, name: '', height: 12500,
  //     },
  //   ],
  // },
  monaco: {
    trackSize: 6656,
    laps: 78,
    curves: [
      { min: 0, max: 160, curveInclination: 1 },
      { min: 260, max: 400, curveInclination: 7 },
      { min: 510, max: 570, curveInclination: -2 },
      { min: 680, max: 740, curveInclination: 2 },
      { min: 790, max: 850, curveInclination: -2 },
      { min: 910, max: 970, curveInclination: 2 },
      { min: 1050, max: 1330, curveInclination: -2 },
      { min: 1420, max: 1600, curveInclination: 3 },
      { min: 1850, max: 2090, curveInclination: 5 },
      { min: 2130, max: 2190, curveInclination: -4 },
      { min: 2270, max: 2550, curveInclination: -7 },
      { min: 2690, max: 2780, curveInclination: 4 },
      { min: 2990, max: 3120, curveInclination: 3 },
      { min: 3310, max: 3640, curveInclination: 2 },
      { min: 3770, max: 3930, curveInclination: 1 },
      { min: 4020, max: 4120, curveInclination: -3 },
      { min: 4170, max: 4210, curveInclination: 3 },
      { min: 4230, max: 4290, curveInclination: 3 },
      { min: 4310, max: 4350, curveInclination: -3 },
      { min: 4710, max: 4790, curveInclination: -3 },
      { min: 4920, max: 4970, curveInclination: -3 },
      { min: 4980, max: 5020, curveInclination: 3 },
      { min: 5080, max: 5150, curveInclination: 3 },
      { min: 5200, max: 5260, curveInclination: -3 },
      { min: 5320, max: 5590, curveInclination: -1 },
      { min: 5670, max: 5850, curveInclination: 6 },
      { min: 6060, max: 6150, curveInclination: 5 },
      { min: 6150, max: 6240, curveInclination: -3 },
      { min: 6280, max: 6656, curveInclination: 1 },
    ],
    hills: [
      { initialSegment: 140, size: 175, altimetry: 20 },
      { initialSegment: 400, size: 600, altimetry: 50 },
      { initialSegment: 1020, size: 370, altimetry: -50 },
      { initialSegment: 1560, size: 1000, altimetry: -35 },
      { initialSegment: 2600, size: 500, altimetry: -45 },
      { initialSegment: 3870, size: 250, altimetry: -30 },
      { initialSegment: 4160, size: 1500, altimetry: 25 },
      { initialSegment: 5670, size: 340, altimetry: 50 },
      { initialSegment: 6050, size: 150, altimetry: -30 },
      { initialSegment: 6656, size: 0, altimetry: 0 },
    ],
    tunnels: [
      {
        min: 3250, max: 3900, name: '', height: 12500,
      },
    ],
  },
  brazil: {
    trackSize: 8632,
    laps: 71,
    curves: [
      { min: 200, max: 400, curveInclination: -4 },
      { min: 600, max: 800, curveInclination: 4 },
      { min: 900, max: 1500, curveInclination: -2 },
      { min: 2500, max: 2750, curveInclination: -5 },
      { min: 2950, max: 3200, curveInclination: -3 },
      { min: 3600, max: 3725, curveInclination: 4 },
      { min: 3850, max: 3975, curveInclination: 3 },
      { min: 4225, max: 4475, curveInclination: 5 },
      { min: 4600, max: 5100, curveInclination: -5 },
      { min: 5300, max: 5350, curveInclination: 2 },
      { min: 5475, max: 5675, curveInclination: 6 },
      { min: 6050, max: 6300, curveInclination: -4 },
      { min: 6800, max: 7000, curveInclination: -6 },
      { min: 7100, max: 7200, curveInclination: -3 },
      { min: 7575, max: 7700, curveInclination: -4 },
      { min: 8075, max: 8200, curveInclination: -3 },
    ],
    hills: [
      { initialSegment: 1, size: 800, altimetry: -40 },
      { initialSegment: 900, size: 600, altimetry: 15 },
      { initialSegment: 2500, size: 750, altimetry: -35 },
      { initialSegment: 3500, size: 500, altimetry: 20 },
      { initialSegment: 4200, size: 650, altimetry: -30 },
      { initialSegment: 5000, size: 650, altimetry: 35 },
      { initialSegment: 5700, size: 600, altimetry: -25 },
      { initialSegment: 6400, size: 400, altimetry: -15 },
      { initialSegment: 7000, size: 700, altimetry: 80 },
      { initialSegment: 7700, size: 300, altimetry: 20 },
      { initialSegment: 8100, size: 500, altimetry: -10 },
      { initialSegment: 8632, size: 0, altimetry: 0 },
    ],
    tunnels: [
      {
        min: 0, max: 0, name: '', height: 1,
      },
    ],
  },
};

const drivers = [
  {
    power: 1072, position: 1, trackSide: -1, name: 'Senna', carColor: 4,
  },
  {
    power: 1065, position: 2, trackSide: 1, name: 'Mansell', carColor: 7,
  },
  {
    power: 1060, position: 3, trackSide: -1, name: 'Prost', carColor: 3,
  },
  {
    power: 1050, position: 4, trackSide: 1, name: 'Piquet', carColor: 2,
  },
  {
    power: 1057, position: 5, trackSide: -1, name: 'Patrese', carColor: 7,
  },
  {
    power: 1052, position: 6, trackSide: 1, name: 'Berger', carColor: 4,
  },
  {
    power: 1050, position: 7, trackSide: -1, name: 'Alesi', carColor: 3,
  },
  {
    power: 1055, position: 8, trackSide: 1, name: 'Schumacher', carColor: 2,
  },
  {
    power: 1020, position: 9, trackSide: -1, name: 'Boutsen', carColor: 0,
  },
  {
    power: 1015, position: 10, trackSide: 1, name: 'Comas', carColor: 0,
  },
  {
    power: 1010, position: 11, trackSide: -1, name: 'Martini', carColor: 5,
  },
  {
    power: 1005, position: 12, trackSide: 1, name: 'Herbert', carColor: 5,
  },
  {
    power: 1000, position: 13, trackSide: -1, name: 'Lehto', carColor: 3,
  },
  {
    power: 990, position: 14, trackSide: 1, name: 'Gugelmin', carColor: 6,
  },
  {
    power: 985, position: 15, trackSide: -1, name: 'Morbidelli', carColor: 5,
  },
  {
    power: 995, position: 16, trackSide: 1, name: 'Capelli', carColor: 6,
  },
  {
    power: 975, position: 17, trackSide: -1, name: 'De Cesaris', carColor: 1,
  },
  {
    power: 970, position: 18, trackSide: 1, name: 'Pirro', carColor: 3,
  },
  {
    power: 975, position: 19, trackSide: -1, name: 'Gachot', carColor: 1,
  },
];

const updateOpponentsCarOffset = (car, player, director, oppArr) => {
  const carParam = car;
  const playerParam = player;
  const oppArrParam = oppArr;
  const lookAhead = 40;
  const crash = 6;
  const { carSegments: carSeg } = director;
  const cSeg = (carSeg.find(({ name }) => name === carParam.opponentName));
  const arrObjSeg = carSeg.filter(({ pos }) => pos < cSeg.pos + lookAhead && pos > cSeg.pos);
  const objCrash = carSeg.find(({ pos }) => pos < cSeg.pos + crash && pos > cSeg.pos);
  let dir = carParam.opponentX;

  if (cSeg && cSeg.x <= -1.65) dir = 0.5;
  if (cSeg && cSeg.x >= 1.65) dir = -0.5;
  arrObjSeg.forEach((objSeg) => {
    if (objSeg && objSeg.name !== playerParam.name) {
      const isOverlapped = overlap(cSeg.x, 0.663125, objSeg.x, 0.663125, 1);

      if (isOverlapped) {
        const changeX = 1;
        const diffCarsX = Math.abs(objSeg.x - cSeg.x);

        if (objSeg.x > 1 || (objSeg.x > 0 && diffCarsX < 0.3)) dir = -changeX;
        if (objSeg.x < -1 || (objSeg.x < 0 && diffCarsX < 0.3)) dir = changeX;
        if (objCrash && objCrash.name !== playerParam.name) {
          const opp = oppArrParam.findIndex(({ opponentName }) => opponentName === objCrash.name);
          oppArrParam[opp].runningPower *= 1.02;
          carParam.runningPower *= 0.98;
        }
      }
    }
    if (objSeg && objSeg.name === playerParam.name && !car.isCrashed) {
      const isOverlapped = overlap(cSeg.x, 0.663125, objSeg.x, 0.8, 1);

      if (carParam.runningPower > playerParam.runningPower && isOverlapped) {
        const changeX = 5;
        const diffCarsX = Math.abs(objSeg.x - cSeg.x);
        if (objSeg.x > 0.95 || (objSeg.x > 0 && diffCarsX < 0.4)) dir = changeX * -1;
        else if (objSeg.x < -0.95 || (objSeg.x < 0 && diffCarsX < 0.4)) dir = changeX;

        if (objCrash) {
          const x = (carParam.runningPower - playerParam.runningPower) / 2;
          playerParam.runningPower += x * 1.8;
          carParam.runningPower += x * -1.5;
        }
      }
    }
  });
  return dir;
};

export {
  handleInput, resource, canvas, fieldOfView, theta, addItens, toggleMusic, playMusic, formatTime,
  startPosition, overlap, calcCrashSpeed, updateOpponentsCarOffset, tracks, drivers,
};
