import Ball from './Ball.js'
import Paddle from './Paddle.js';

const ball = new Ball(document.getElementById("ball"))
const playerPaddle = new Paddle(document.getElementById("player-paddle"))
const computerPaddle = new Paddle(document.getElementById("computer-paddle"))
const playerScoreElem = document.getElementById("player-score");
const computerScoreElem = document.getElementById("computer-score");
const startText = document.getElementById("start-text");

let gameTick = false;
let lastTime;

function gameCycle() {
  ball.reset();
  function update(time) {
    if(lastTime != null) {
      const delta = time - lastTime;
      ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()])
      computerPaddle.update(delta, ball.y)

      const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hue"))
      document.documentElement.style.setProperty("--hue", hue + delta * .01)

      if (isLose()) {
        handleLose();
      }
      console.log(gameTick);
    }

    lastTime = time;
    if (!gameTick){
      return
    } else {
      window.requestAnimationFrame(update);
    }
  }

  function isLose() {
    const rect = ball.rect();
    return rect.left >= window.innerWidth || rect.left <= 0
  }

  function handleLose() {
    const rect = ball.rect();

    if (rect.right >= window.innerWidth) {
      playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1
    } else {
      computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1
    }
    ball.stop();
    computerPaddle.reset();
    startText.style.visibility = "visible"
    gameTick = false;
    document.body.style.cursor = "pointer";
    return;
  }

  document.addEventListener("mousemove", e => {
    playerPaddle.position = (e.y / window.innerHeight) * 100;
  })

  if (!gameTick){
    return
  } else {
    window.requestAnimationFrame(update);
  }

}

if (!gameTick) {
  document.addEventListener("click", ()=> {
    gameTick = true;
    document.body.style.cursor = "none";
    startText.style.visibility = "hidden";
    gameCycle();
  }
)};