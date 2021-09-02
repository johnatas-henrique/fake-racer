import HandleInput from './handleInput.js';
import Resource from './resource.js';

const {
  tan, sin, cos, round, floor, ceil, max, random, PI,
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

const playMusic = () => {
  const music = document.getElementById('music');
  const mute = document.getElementById('mute');
  music.loop = true;
  music.volume = 0.05;
  music.muted = 'true';
  mute.classList.toggle('off');
  mute.addEventListener('click', () => {
    music.play();
    mute.classList.toggle('off');
    music.muted = !music.muted;
  });
};

const formatTime = (dt) => {
  const time = round(dt);
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor(time / 1000) - (minutes * 60);
  const tenths = time.toString().slice(-3);
  return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}.${tenths}`;
};

const tracks = {
  testTrack: {
    segmentLength: 3000,
    curves: [
      { min: 50, max: 300, curveInclination: -2 },
      { min: 500, max: 750, curveInclination: 3 },
      { min: 900, max: 1150, curveInclination: -4 },
      { min: 1300, max: 1800, curveInclination: 6 },
      { min: 2000, max: 2300, curveInclination: 1 },
      { min: 2360, max: 2640, curveInclination: -2.5 },
    ],
  },
  interlagos: {
    segmentLength: 8700,
    curves: [
      { min: 200, max: 400, curveInclination: -4 },
      { min: 600, max: 800, curveInclination: 4 },
      { min: 900, max: 1500, curveInclination: -2 },
      { min: 2500, max: 2700, curveInclination: -5 },
      { min: 2850, max: 3050, curveInclination: -3 },
      { min: 3600, max: 3725, curveInclination: 4 },
      { min: 3850, max: 3975, curveInclination: 3 },
      { min: 4225, max: 4475, curveInclination: 5 },
      { min: 4600, max: 5100, curveInclination: -5 },
      { min: 5300, max: 5350, curveInclination: 2 },
      { min: 5475, max: 5675, curveInclination: 6 },
      { min: 6050, max: 6300, curveInclination: -4 },
      { min: 6800, max: 7000, curveInclination: -6 },
      { min: 7125, max: 7200, curveInclination: -2 },
      { min: 7575, max: 7700, curveInclination: -4 },
      { min: 8075, max: 8200, curveInclination: -3 },
    ],
  },
};

export {
  handleInput, resource,
  tan, sin, cos, round, floor, ceil, max, random, PI,
  canvas, fieldOfView, theta, addItens, playMusic, formatTime,
  tracks,
};
