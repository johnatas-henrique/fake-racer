class Opponent {
  constructor(config) {
    this.race = config.race;
    this.maxSpeed = config.maxSpeed || 600;
    this.trackPosition = config.trackPosition || 1;
    this.startPos = config.startPos || -1;
    this.opponentName = config.opponentName || 'Desconhecido';
    this.carColor = config.carColor ?? 'random';
    this.image = config.image || '../images/sprites/other/f1Y91Opponents.png';
    this.sprite = new SpriteRace();
    this.actualSpeed = 0;
    this.scale = 0;
    this.opponentX = 1;
    this.lap = 0;
    this.raceTime = [0];
    this.isCrashed = 0;
    this.images = {};
    this.road = null;
    this.director = null;
    this.player = null;
    this.opponents = null;
  }

  init() {
    this.road = this.race.road;
    this.director = this.race.director;
    this.player = this.race.player;
    this.opponents = this.race.opponents;
    this.images.opponents = new Image();
    this.images.opponents.src = this.image;
    this.sprite.image = this.images.opponents;
    this.sprite.name = `op${this.opponentName}`;
    this.sprite.offsetX = 0.5 * this.startPos;
    this.sprite.scaleX = 2;
    this.sprite.scaleY = 2;
    this.sprite.spritesInX = 8;
    this.sprite.spritesInY = 1;
    this.sprite.sheetPositionX = this.carColor !== 'random' ? this.carColor : Math.floor(Math.random() * 7.99);
    this.sprite.sheetPositionY = 0;
    this.sprite.actualSpeed.mult = 1;
    this.maxSpeed += Math.floor(Math.random() * 20);
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

  findFinishedCars(driver) {
    return this.director.raceFinishedCars.find(({ name }) => name === driver);
  }

  update() {
    if (this.director.running) {
      const newMaxSpeed = this.carSpeedCorrection();
      newMaxSpeed.next();
      if (this.actualSpeed < 0) this.actualSpeed = 0;

      const acceleration = (speed, mult) => ((this.maxSpeed + 300) / (speed + 300))
        * mult * (1.5 - (speed / this.maxSpeed));

      this.actualSpeed = this.actualSpeed >= this.maxSpeed
        ? this.maxSpeed : this.actualSpeed += acceleration(this.actualSpeed, 0.9);

      this.sprite.actualSpeed.speed = this.actualSpeed;
      const oldSegment = this.road.getSegment(Math.round(this.trackPosition));
      this.opponentX = utils
        .updateOpponentsCarOffset(this, this.player, this.director, this.opponents);

      this.sprite.offsetX += 0.008 * this.opponentX;
      this.trackPosition += this.actualSpeed;
      this.isCrashed = this.isCrashed > 0 ? this.isCrashed -= 0.1 : 0;
      const actualSegment = this.road.getSegment(Math.round(this.trackPosition));
      oldSegment.sprites = oldSegment.sprites.filter(({ name }) => name !== this.sprite.name);
      actualSegment.sprites.push(this.sprite);

      const { trackSize } = window.tracks.f1Y91[this.road.trackName];
      const actualPosition = this.trackPosition / 200;
      const actualLap = Math.floor(actualPosition / trackSize);

      if (this.lap < actualLap) {
        this.raceTime.push(this.director.totalTime);
        const raceLeader = this.director.positions[0].name;
        const leaderHasFinished = this.findFinishedCars(raceLeader)?.finished === true;

        if (leaderHasFinished) {
          this.findFinishedCars(this.opponentName).finished = true;
        }
        this.lap += 1;
      }
      if (this.lap > this.director.raceLaps) {
        this.findFinishedCars(this.opponentName).finished = true;
      }
    }
  }
}
