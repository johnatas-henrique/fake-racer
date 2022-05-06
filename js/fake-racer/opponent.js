class Opponent {
  constructor(maxSpeed = 600, trackPosition = 0, startPos = -1, image, opponentName = 'John Doe', carColor = 'random') {
    this.maxSpeed = maxSpeed;
    this.sprite = new Sprite();
    this.image = image;
    this.actualSpeed = 0;
    this.scale = 0;
    this.trackPosition = trackPosition;
    this.startPos = startPos;
    this.opponentName = opponentName;
    this.opponentX = 1;
    this.lap = 0;
    this.raceTime = [0];
    this.carColor = carColor;
    this.isCrashed = 0;
  }

  create() {
    this.sprite.image = resource.get(this.image);
    this.sprite.name = `op${this.opponentName}`;
    this.sprite.offsetX = 0.5 * this.startPos;
    this.sprite.scaleX = 2;
    this.sprite.scaleY = 2;
    this.sprite.spritesInX = 8;
    this.sprite.spritesInY = 1;
    this.sprite.sheetPositionX = this.carColor !== 'random'
      ? this.carColor
      : Math.floor(Math.random() * 7.99);
    this.sprite.sheetPositionY = 0;
    this.sprite.actualSpeed.mult = 1;
    this.maxSpeed += Math.floor(Math.random() * 40);
    this.baseSpeed = this.maxSpeed;
  }

  * carSpeedCorrection() {
    while (this.maxSpeed >= this.baseSpeed) {
      this.maxSpeed -= 0.1;
      if (this.maxSpeed > this.baseSpeed * 1.6 || this.maxSpeed > 1260) {
        this.maxSpeed = Math.min(this.baseSpeed * 1.6, 1260);
      }
      yield this.maxSpeed;
    }
  }

  update(road, director, player, oppArr) {
    if (director.running) {
      // crash corrector
      const newMaxSpeed = this.carSpeedCorrection();
      newMaxSpeed.next();
      if (this.actualSpeed < 0) this.actualSpeed = 0;

      const acceleration = (speed, mult) => ((this.maxSpeed + 300) / (speed + 300))
        * mult * (1.5 - (speed / this.maxSpeed));

      this.actualSpeed = this.actualSpeed >= this.maxSpeed
        ? this.maxSpeed : this.actualSpeed += acceleration(this.actualSpeed, 0.9);

      // helper to stop opponent speeds
      // this.actualSpeed = 0;

      this.sprite.actualSpeed.speed = this.actualSpeed;
      const oldSegment = road.getSegment(Math.round(this.trackPosition));
      this.opponentX = updateOpponentsCarOffset(this, player, director, oppArr);

      this.sprite.offsetX += 0.008 * this.opponentX;
      this.trackPosition += this.actualSpeed;
      this.isCrashed = this.isCrashed > 0 ? this.isCrashed -= 0.1 : 0;
      const actualSegment = road.getSegment(Math.round(this.trackPosition));
      oldSegment.sprites = oldSegment.sprites.filter(({ name }) => name !== this.sprite.name);
      actualSegment.sprites.push(this.sprite);

      const { trackSize } = utils.tracks[road.trackName];
      const actualPosition = this.trackPosition / 200;
      const actualLap = Math.floor(actualPosition / trackSize);

      if (this.lap < actualLap) {
        this.raceTime.push(director.totalTime);
        this.lap += 1;
      }
    }
  }
}
