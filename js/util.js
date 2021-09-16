import HandleInput from './handleInput.js';
import Resource from './resource.js';

const {
  tan, sin, cos, round, floor, ceil, min, max, random, PI,
} = Math;

const canvas = document.querySelector('canvas');
const fieldOfView = (120 / 180) * PI;
const theta = fieldOfView * 0.5;

const handleInput = new HandleInput();
const resource = new Resource();

const addItens = (liId, text) => {
  const li = document.querySelector(liId);
  li.textContent = text;
};

const toggleMusic = (e, toggle, volume = '5') => {
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

const tracks = {
  brazil: {
    trackSize: 8632,
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
  },
  monaco: {
    trackSize: 6656,
    curves: [
      { min: 2500, max: 1500, curveInclination: -4 },
    ],
    hills: [
      { initialSegment: 1, size: 800, altimetry: -40 },
      { initialSegment: 1001, size: 800, altimetry: 40 },
      { initialSegment: 6656, size: 0, altimetry: 0 },
    ],
  },
  // test: {
  //   trackSize: 3000,
  //   curves: [
  //     { min: 50, max: 300, curveInclination: -2 },
  //     { min: 500, max: 750, curveInclination: 3 },
  //     { min: 900, max: 1150, curveInclination: -4 },
  //     { min: 1300, max: 1800, curveInclination: 6 },
  //     { min: 2000, max: 2300, curveInclination: 1 },
  //     { min: 2360, max: 2640, curveInclination: -2.5 },
  //   ],
  //   hills: [
  //     { initialSegment: 50, size: 300, altimetry: -40 },
  //     { initialSegment: 450, size: 150, altimetry: 25 },
  //     { initialSegment: 1000, size: 315, altimetry: 50 },
  //     { initialSegment: 3000, size: 0, altimetry: 0 },
  //   ],
  // },
};

const drivers = [
  {
    power: 1160, position: 1, trackSide: -1, image: 'opponents', name: 'Senna',
  },
  {
    power: 1140, position: 2, trackSide: 1, image: 'opponents', name: 'Schumacher',
  },
  {
    power: 1120, position: 3, trackSide: -1, image: 'opponents', name: 'Hamilton',
  },
  {
    power: 1100, position: 4, trackSide: 1, image: 'opponents', name: 'Fangio',
  },
  {
    power: 1080, position: 5, trackSide: -1, image: 'opponents', name: 'Fangio2',
  },
  {
    power: 1060, position: 6, trackSide: 1, image: 'opponents', name: 'Fangio3',
  },
  {
    power: 1040, position: 7, trackSide: -1, image: 'opponents', name: 'Fangio4',
  },
  {
    power: 1020, position: 8, trackSide: 1, image: 'opponents', name: 'Fangio5',
  },
  {
    power: 1000, position: 9, trackSide: -1, image: 'opponents', name: 'Fangio6',
  },
  {
    power: 980, position: 10, trackSide: 1, image: 'opponents', name: 'Fangio7',
  },
  {
    power: 960, position: 11, trackSide: -1, image: 'opponents', name: 'Fangio8',
  },
  {
    power: 940, position: 12, trackSide: 1, image: 'opponents', name: 'Fangio9',
  },
  {
    power: 920, position: 13, trackSide: -1, image: 'opponents', name: 'Fangio10',
  },
  {
    power: 900, position: 14, trackSide: 1, image: 'opponents', name: 'Fangio11',
  },
  {
    power: 920, position: 15, trackSide: -1, image: 'opponents', name: 'Fangio12',
  },
  {
    power: 940, position: 16, trackSide: 1, image: 'opponents', name: 'Fangio13',
  },
  {
    power: 960, position: 17, trackSide: -1, image: 'opponents', name: 'Fangio14',
  },
  {
    power: 980, position: 18, trackSide: 1, image: 'opponents', name: 'Fangio15',
  },
  {
    power: 1100, position: 19, trackSide: -1, image: 'opponents', name: 'Fangio16',
  },
];

const startPosition = (trackSize, position) => (trackSize - (position * 16)) * 200;

export {
  handleInput, resource,
  tan, sin, cos, round, floor, ceil, min, max, random, PI,
  canvas, fieldOfView, theta, addItens, toggleMusic, playMusic, formatTime,
  tracks, startPosition,
  drivers,
};
