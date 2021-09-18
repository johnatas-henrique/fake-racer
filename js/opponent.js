import Sprite from './sprite.js';
import { resource } from './util.js';

class Opponent {
  constructor(
    maxSpeed = 600, trackPosition = 0, startPos = -1, image, opponentName = 'John Doe',
  ) {
    this.maxSpeed = maxSpeed;
    this.sprite = new Sprite();
    this.image = image;
    this.runningPower = 0;
    this.scale = 0;
    this.trackPosition = trackPosition;
    this.actualPosition = trackPosition;
    this.startPos = startPos;
    this.opponentName = opponentName;
    this.opponentX = 1;
  }

  create() {
    this.sprite.image = resource.get(this.image);
    this.sprite.offsetX = 0.5 * this.startPos;
    this.sprite.scaleX = 3;
    this.sprite.scaleY = 3;
    this.sprite.name = this.opponentName;
    this.sprite.spritesInX = 6;
    this.sprite.spritesInY = 1;
    this.sprite.sheetPositionX = Math.floor(Math.random() * 5.99);
    this.sprite.sheetPositionY = 0;
  }

  update(road) {
    const acceleration = (speed, mult) => ((this.maxSpeed + 300) / (speed + 300))
      * mult * (1.5 - (speed / this.maxSpeed));

    this.runningPower = this.runningPower >= this.maxSpeed
      ? this.maxSpeed : this.runningPower += acceleration(this.runningPower, 0.9);

    if (this.sprite.offsetX <= -0.8) {
      this.opponentX = 1;
    }
    if (this.sprite.offsetX >= 0.8) {
      this.opponentX = -1;
    }
    this.sprite.offsetX += Math.random() * 0.01 * this.opponentX;
    const oldSegment = road.getSegment(Math.round(this.trackPosition));
    this.trackPosition += this.runningPower;
    const actualSegment = road.getSegment(Math.round(this.trackPosition));

    oldSegment.sprites = oldSegment.sprites.filter(({ name }) => name !== this.sprite.name);
    actualSegment.sprites.push(this.sprite);
  }
}

export default Opponent;
