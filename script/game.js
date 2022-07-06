class Game {
  #dino; #obstacleFreq; #obstacles; #currentFreq; #score; #obstaclesCount;
  constructor(dino, freq) {
    this.#dino = dino;
    this.#obstacleFreq = freq;
    this.#obstacles = [];
    this.#currentFreq = 0;
    this.#score = 0;
    this.#obstaclesCount = 1;
  }

  #canJump(key) {
    const { position: { y }, jumpHeight } = this.#dino;
    return (key === 32 || key === 38) && y < jumpHeight;
  };

  dinoJump({ keyCode }) {
    let { position, jumpHeight } = this.#dino;
    if (this.#canJump(keyCode)) {
      position.y += jumpHeight;
      setTimeout(() => {
        position.y -= jumpHeight;
      }, 300);
    }
  }

  addScore() {
    this.#score++;
  }

  #isFreqMet() {
    return !(this.#currentFreq % this.#obstacleFreq);
  }

  #addObstacle() {
    const obstacle = new Obstacle({ ...getObstacleInfo(), id: this.#obstaclesCount });
    this.#obstaclesCount++;
    this.#obstacles.push(obstacle);
  }

  #updateObs(obstacle, index) {
    if (obstacle.hasReachedEnd()) {
      this.#obstacles.splice(index, 1);
      this.addScore();
    }
  }

  #updateObstacles() {
    if (this.#isFreqMet()) {
      this.#addObstacle();
    }
    this.#currentFreq++;
    this.#obstacles.forEach((obstacle, index) => {
      this.#updateObs(obstacle, index);
    });
  }

  update(intervalId) {
    this.#updateObstacles();
    for (const obstacle of this.#obstacles) {
      if (obstacle.hasHit(this.#dino)) {
        clearInterval(intervalId);
        return;
      }
      obstacle.move();
    }
  }

  get info() {
    return {
      dino: this.#dino,
      score: this.#score,
      obstacles: this.#obstacles
    };
  }

}
