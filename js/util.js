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

export {
  handleInput, resource,
  tan, sin, cos, round, floor, ceil, max, random, PI,
  canvas, fieldOfView, theta, addItens, playMusic, formatTime,
};
