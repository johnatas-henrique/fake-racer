import Sprite from './sprite.js';
import { resource, tracks } from './util.js';

class Opponent {
  constructor(
    maxSpeed = 600, trackPosition = 0, startPos = -1, image, opponentName = 'John Doe', carColor = 'random',
  ) {
    this.maxSpeed = maxSpeed;
    this.sprite = new Sprite();
    this.image = image;
    this.runningPower = 0;
    this.scale = 0;
    this.trackPosition = trackPosition;
    this.startPos = startPos;
    this.opponentName = opponentName;
    this.opponentX = 1;
    this.lap = 0;
    this.raceTime = [0];
    this.carColor = carColor;
  }

  create() {
    this.sprite.image = resource.get(this.image);
    this.sprite.offsetX = 0.5 * this.startPos;
    this.sprite.scaleX = 3;
    this.sprite.scaleY = 3;
    this.sprite.name = this.opponentName;
    this.sprite.spritesInX = 8;
    this.sprite.spritesInY = 1;
    this.sprite.sheetPositionX = this.carColor !== 'random'
      ? this.carColor
      : Math.floor(Math.random() * 7.99);
    this.sprite.sheetPositionY = 0;
    this.maxSpeed += Math.floor(Math.random() * 40);
  }

  update(road, director) {
    if (director.running) {
      const acceleration = (speed, mult) => ((this.maxSpeed + 300) / (speed + 300))
        * mult * (1.5 - (speed / this.maxSpeed));

      this.runningPower = this.runningPower >= this.maxSpeed
        ? this.maxSpeed : this.runningPower += acceleration(this.runningPower, 1.1);

      if (this.sprite.offsetX <= -0.8) this.opponentX = 1;
      if (this.sprite.offsetX >= 0.8) this.opponentX = -1;

      this.sprite.offsetX += Math.random() * 0.01 * this.opponentX;
      const oldSegment = road.getSegment(Math.round(this.trackPosition));
      this.trackPosition += this.runningPower;
      const actualSegment = road.getSegment(Math.round(this.trackPosition));

      oldSegment.sprites = oldSegment.sprites.filter(({ name }) => name !== this.sprite.name);
      actualSegment.sprites.push(this.sprite);

      const { trackSize } = tracks[road.trackName];
      const actualPosition = this.trackPosition / 200;
      const actualLap = Math.floor(actualPosition / trackSize);

      if (this.lap < actualLap) {
        this.raceTime.push(director.totalTime);
        this.lap += 1;
      }
    }
  }
}

export default Opponent;
