const getObstacleInfo = () => ({
  position: { x: 1000, y: 0 },
  height: 50,
  width: 30,
  speed: 15
});

class Game {
  constructor(dino) {
    this.dino = dino
    this.obstacles = [];
    this.score = 0;
  }

  #canJump(key) {
    const { position: { y }, jumpHeight } = this.dino;
    return (key === 32 || key === 38) && y < jumpHeight;
  };

  dinoJump({ keyCode }) {
    let { position, jumpHeight } = this.dino;
    if (this.#canJump(keyCode)) {
      position.y += jumpHeight;
      setTimeout(() => {
        position.y -= jumpHeight;
      }, 300)
    }
  }

  addScore() {
    this.score++;
  }

  get info() {
    return {
      dino: this.dino,
      score: this.score,
    }
  }

}

class Obstacle {
  constructor({ position, height, width, speed }) {
    this.x = position.x;
    this.y = position.y;
    this.height = height;
    this.width = width;
    this.speed = speed;
  }

  move() {
    this.x -= this.speed;
  }

  hasReachedEnd() {
    return this.x + this.width <= 0;
  }

  hasHit(dino) {
    const { position: { x, y }, height, width } = dino;
    return x + width >= this.x &&
      x <= this.x + this.width &&
      y <= this.y + this.height;
  }

  get info() {
    return {
      height: this.height,
      width: this.width,
      position: { x: this.x, y: this.y }
    };
  }
}

const drawDino = (dino) => {
  const dinoElement = document.getElementById('dino');
  dinoElement.style.height = dino.height;
  dinoElement.style.width = dino.width;
  dinoElement.style.bottom = dino.position.y;
  dinoElement.style.left = dino.position.x;
};

const styleObstacle = (obstacleElement, obstacle) => {
  const { height, width } = obstacle.info;
  obstacleElement.id = 'obstacle';
  obstacleElement.style.height = height;
  obstacleElement.style.width = width;
};

const addObstacle = (obstacleElement, canvas) => {
  const image = document.createElement('img');
  image.src = 'images/obstacle.webp';
  obstacleElement.appendChild(image);
  canvas.appendChild(obstacleElement);
};

const createObstacle = (obstacle) => {
  const canvas = document.getElementById('canvas');
  const obstacleElement = document.createElement('div');
  addObstacle(obstacleElement, canvas);
  styleObstacle(obstacleElement, obstacle);
};

const updateScore = (score) => {
  const scoreElement = document.getElementById('score');
  scoreElement.innerText = score;
};

const drawObstacle = (obstacle) => {
  const { position: { x, y } } = obstacle.info;
  const obstacleElement = document.getElementById('obstacle');
  obstacleElement.style.bottom = y;
  obstacleElement.style.left = x;
};

const hasReachedEnd = (obstacle) => {
  return obstacle.position.x + obstacle.width <= 0;
};

const removeObstacle = (obstacle) => {
  const obstacleElement = document.getElementById('obstacle');
  obstacleElement.remove();
};

const maintainObstacle = (obstacle, obstacleInfo) => {
  removeObstacle(obstacle);
  obstacle = new Obstacle(obstacleInfo);
  createObstacle(obstacle);
  return obstacle;
};

const startGame = () => {
  const dino = {
    position: { x: 60, y: 0 },
    height: 60,
    width: 40,
    jumpHeight: 100
  }

  const game = new Game(dino);
  const obstacleInfo = getObstacleInfo();

  let obstacle = new Obstacle(obstacleInfo);
  createObstacle(obstacle);
  const intervalId = setInterval(() => {
    if (obstacle.hasReachedEnd()) {
      game.addScore();
      updateScore(game.info.score);
      obstacle = maintainObstacle(obstacle, obstacleInfo);
    }
    drawDino(game.info.dino);
    if (obstacle.hasHit(game.info.dino)) {
      clearInterval(intervalId);
      return;
    }
    obstacle.move();
    drawObstacle(obstacle);
  }, 40);

  window.addEventListener('keydown', (event) => {
    game.dinoJump(event);
  });
};

window.onload = startGame;
