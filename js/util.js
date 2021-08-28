import Keyboard from "./keyboard.js";

const { tan, sin, cos, round, floor, ceil, max, random, PI } = Math;

const canvas = document.querySelector('canvas');
const fieldOfView = (120 / 180) * PI;
const theta = fieldOfView * 0.5;

const keyboard = new Keyboard();

const resource = new class {
  #cache = new Map;
  #list = [];

  add(name, url) {
    if (arguments.length === 2) {
      this.#list.push({ name, url })
    } else if (arguments.length === 1) {
      this.#list.push({ name, url: name })
    }
    return this;
  }

  get cache() {
    return this.#cache;
  }

  get(res) {
    return this.cache.get(res) || null;
  }

  load(callback) {
    if (this.#list.length > 0) {
      const res = this.#list.pop();
      const image = new Image;
      image.onload = () => {
        this.cache.set(res.name, image);
        this.load(callback);
      };
      image.src = res.url;
    } else {
      if (callback) {
        callback(this);
      }
    }
  }
}

const addItens = (liId, text) => {
  const li = document.querySelector(liId);
  li.textContent = text;
};

const playMusic = () => {
  const music = document.getElementById('music');
  const mute = document.getElementById('mute');
  music.loop = true;
  music.volume = 0.05;
  music.muted = "true";
  mute.classList.toggle('off');
  mute.addEventListener('click', () => {
    music.play();
    mute.classList.toggle('off');
    music.muted = !music.muted;
  });
}

const formatTime = (dt) => {
  const time = round(dt);
  console.log('sec', Math.floor(time / 60000), 'sec', Math.floor(time / 1000), 'tenths', time);
  var minutes = Math.floor(time / 60000);
  var seconds = Math.floor(time / 1000) - (minutes * 60);
  var tenths = time.toString().slice(-3);
  if (minutes > 0)
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds + "." + tenths;
  else
    return seconds + "." + tenths;
}

export {
  tan, sin, cos, round, floor, ceil, max, random, PI,
  canvas,
  fieldOfView,
  theta,
  keyboard,
  resource,
  addItens,
  playMusic,
  formatTime
};
