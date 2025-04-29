// Game buttons for mobiles
const up = document.querySelector("#up")
const down = document.querySelector("#down")
const left = document.querySelector("#left")
const right = document.querySelector("#right")
const board = document.querySelector("#board")
const scoreBox = document.querySelector("#scoreBox")
const hiscoreBox = document.querySelector("#hiscoreBox")
const gameOverModal = document.querySelector("#gameOverModal")
const finalScore = document.querySelector("#finalScore")
const finalHiScore = document.querySelector("#finalHiScore")
const playAgainBtn = document.querySelector("#playAgainBtn")

// Game Constants & Variables
let inputDir = { x: 0, y: 0 }
let lastInputDir = { x: 0, y: 0 }
const foodSound = new Audio("food.mp3")
const gameOverSound = new Audio("gameover.mp3")
const moveSound = new Audio("move.mp3")
const musicSound = new Audio("")
let speed = 7
let score = 0
let lastPaintTime = 0
let snakeArr = [{ x: 13, y: 15 }]
let isGameOver = false
let gameActive = true

let food = { x: 6, y: 7 }
let hiscoreval = 0
let snakeElement
let foodElement

// Game Functions
function main(ctime) {
  window.requestAnimationFrame(main)
  if ((ctime - lastPaintTime) / 1000 < 1 / speed || !gameActive) {
    return
  }
  lastPaintTime = ctime
  gameEngine()
}

function isCollide(snake) {
  // If you bump into yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true
    }
  }
  // If you bump into the wall
  if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
    return true
  }

  return false
}

function showGameOverModal() {
  finalScore.textContent = score
  finalHiScore.textContent = hiscoreval
  gameOverModal.classList.add("active")
}

function resetGame() {
  gameOverModal.classList.remove("active")
  inputDir = { x: 0, y: 0 }
  lastInputDir = { x: 0, y: 0 }
  snakeArr = [{ x: 13, y: 15 }]
  score = 0
  scoreBox.innerHTML = "Score: " + score
  gameActive = true
  isGameOver = false
}

function gameEngine() {
  // Part 1: Updating the snake array & Food
  if (isCollide(snakeArr)) {
    gameOverSound.play()
    musicSound.pause()
    inputDir = { x: 0, y: 0 }
    lastInputDir = { x: 0, y: 0 }
    isGameOver = true
    gameActive = false
    showGameOverModal()
    return
  }

  // If you have eaten the food, increment the score and regenerate the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play()
    score += 1

    // Flash the score
    scoreBox.classList.add("score-flash")
    setTimeout(() => {
      scoreBox.classList.remove("score-flash")
    }, 500)

    if (score > hiscoreval) {
      hiscoreval = score
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
      hiscoreBox.innerHTML = "HiScore: " + hiscoreval

      // Flash the high score
      hiscoreBox.classList.add("score-flash")
      setTimeout(() => {
        hiscoreBox.classList.remove("score-flash")
      }, 500)
    }
    scoreBox.innerHTML = "Score: " + score

    // Increase speed slightly with each food eaten
    if (score % 5 === 0 && speed < 15) {
      speed += 0.5
    }

    snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y })
    const a = 2
    const b = 16
    food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }

    // Make sure food doesn't spawn on snake
    let foodOnSnake = true
    while (foodOnSnake) {
      foodOnSnake = false
      for (const segment of snakeArr) {
        if (segment.x === food.x && segment.y === food.y) {
          food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
          foodOnSnake = true
          break
        }
      }
    }
  }

  // Moving the snake
  lastInputDir = { ...inputDir }
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] }
  }

  snakeArr[0].x += inputDir.x
  snakeArr[0].y += inputDir.y

  // Part 2: Display the snake and Food
  // Display the snake
  board.innerHTML = ""
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div")
    snakeElement.style.gridRowStart = e.y
    snakeElement.style.gridColumnStart = e.x

    if (index === 0) {
      snakeElement.classList.add("head")

      // Add direction to head
      if (inputDir.x === 1) snakeElement.style.transform = "rotate(0deg)"
      else if (inputDir.x === -1) snakeElement.style.transform = "rotate(180deg)"
      else if (inputDir.y === -1) snakeElement.style.transform = "rotate(270deg)"
      else if (inputDir.y === 1) snakeElement.style.transform = "rotate(90deg)"
    } else {
      snakeElement.classList.add("snake")
    }
    board.appendChild(snakeElement)
  })

  // Display the food
  foodElement = document.createElement("div")
  foodElement.style.gridRowStart = food.y
  foodElement.style.gridColumnStart = food.x
  foodElement.classList.add("food")
  board.appendChild(foodElement)
}

// Main logic starts here
const hiscore = localStorage.getItem("hiscore")
if (hiscore === null) {
  hiscoreval = 0
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
} else {
  hiscoreval = JSON.parse(hiscore)
  hiscoreBox.innerHTML = "HiScore: " + hiscore
}

// Play Again button
playAgainBtn.addEventListener("click", resetGame)

window.requestAnimationFrame(main)

// Mobile controls with visual feedback
up.addEventListener("click", () => {
  if (lastInputDir.y !== 1) {
    // Prevent moving in opposite direction
    moveSound.play()
    inputDir.x = 0
    inputDir.y = -1

    // Add visual feedback
    up.style.backgroundColor = "rgba(78, 204, 163, 0.6)"
    setTimeout(() => {
      up.style.backgroundColor = "rgba(78, 204, 163, 0.2)"
    }, 100)
  }
})

down.addEventListener("click", () => {
  if (lastInputDir.y !== -1) {
    // Prevent moving in opposite direction
    moveSound.play()
    inputDir.x = 0
    inputDir.y = 1

    // Add visual feedback
    down.style.backgroundColor = "rgba(78, 204, 163, 0.6)"
    setTimeout(() => {
      down.style.backgroundColor = "rgba(78, 204, 163, 0.2)"
    }, 100)
  }
})

left.addEventListener("click", () => {
  if (lastInputDir.x !== 1) {
    // Prevent moving in opposite direction
    moveSound.play()
    inputDir.x = -1
    inputDir.y = 0

    // Add visual feedback
    left.style.backgroundColor = "rgba(78, 204, 163, 0.6)"
    setTimeout(() => {
      left.style.backgroundColor = "rgba(78, 204, 163, 0.2)"
    }, 100)
  }
})

right.addEventListener("click", () => {
  if (lastInputDir.x !== -1) {
    // Prevent moving in opposite direction
    moveSound.play()
    inputDir.x = 1
    inputDir.y = 0

    // Add visual feedback
    right.style.backgroundColor = "rgba(78, 204, 163, 0.6)"
    setTimeout(() => {
      right.style.backgroundColor = "rgba(78, 204, 163, 0.2)"
    }, 100)
  }
})

// Keyboard controls
window.addEventListener("keydown", (e) => {
  if (isGameOver) return

  moveSound.play()
  switch (e.key) {
    case "ArrowUp":
      if (lastInputDir.y !== 1) {
        // Prevent moving in opposite direction
        inputDir.x = 0
        inputDir.y = -1

        // Add visual feedback to button
        up.style.backgroundColor = "rgba(78, 204, 163, 0.6)"
        setTimeout(() => {
          up.style.backgroundColor = "rgba(78, 204, 163, 0.2)"
        }, 100)
      }
      break

    case "ArrowDown":
      if (lastInputDir.y !== -1) {
        // Prevent moving in opposite direction
        inputDir.x = 0
        inputDir.y = 1

        // Add visual feedback to button
        down.style.backgroundColor = "rgba(78, 204, 163, 0.6)"
        setTimeout(() => {
          down.style.backgroundColor = "rgba(78, 204, 163, 0.2)"
        }, 100)
      }
      break

    case "ArrowLeft":
      if (lastInputDir.x !== 1) {
        // Prevent moving in opposite direction
        inputDir.x = -1
        inputDir.y = 0

        // Add visual feedback to button
        left.style.backgroundColor = "rgba(78, 204, 163, 0.6)"
        setTimeout(() => {
          left.style.backgroundColor = "rgba(78, 204, 163, 0.2)"
        }, 100)
      }
      break

    case "ArrowRight":
      if (lastInputDir.x !== -1) {
        // Prevent moving in opposite direction
        inputDir.x = 1
        inputDir.y = 0

        // Add visual feedback to button
        right.style.backgroundColor = "rgba(78, 204, 163, 0.6)"
        setTimeout(() => {
          right.style.backgroundColor = "rgba(78, 204, 163, 0.2)"
        }, 100)
      }
      break
    default:
      break
  }
})

// Swipe controls for mobile
let touchStartX = 0
let touchStartY = 0
let touchEndX = 0
let touchEndY = 0

board.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX
    touchStartY = e.changedTouches[0].screenY
  },
  false,
)

board.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX
    touchEndY = e.changedTouches[0].screenY
    handleSwipe()
  },
  false,
)

function handleSwipe() {
  const xDiff = touchStartX - touchEndX
  const yDiff = touchStartY - touchEndY

  // Determine which direction has the greater movement
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      // Swipe left
      if (lastInputDir.x !== 1) {
        // Prevent moving in opposite direction
        moveSound.play()
        inputDir.x = -1
        inputDir.y = 0

        // Add visual feedback
        left.style.backgroundColor = "rgba(78, 204, 163, 0.6)"
        setTimeout(() => {
          left.style.backgroundColor = "rgba(78, 204, 163, 0.2)"
        }, 100)
      }
    } else {
      // Swipe right
      if (lastInputDir.x !== -1) {
        // Prevent moving in opposite direction
        moveSound.play()
        inputDir.x = 1
        inputDir.y = 0

        // Add visual feedback
        right.style.backgroundColor = "rgba(78, 204, 163, 0.6)"
        setTimeout(() => {
          right.style.backgroundColor = "rgba(78, 204, 163, 0.2)"
        }, 100)
      }
    }
  } else {
    if (yDiff > 0) {
      // Swipe up
      if (lastInputDir.y !== 1) {
        // Prevent moving in opposite direction
        moveSound.play()
        inputDir.x = 0
        inputDir.y = -1

        // Add visual feedback
        up.style.backgroundColor = "rgba(78, 204, 163, 0.6)"
        setTimeout(() => {
          up.style.backgroundColor = "rgba(78, 204, 163, 0.2)"
        }, 100)
      }
    } else {
      // Swipe down
      if (lastInputDir.y !== -1) {
        // Prevent moving in opposite direction
        moveSound.play()
        inputDir.x = 0
        inputDir.y = 1

        // Add visual feedback
        down.style.backgroundColor = "rgba(78, 204, 163, 0.6)"
        setTimeout(() => {
          down.style.backgroundColor = "rgba(78, 204, 163, 0.2)"
        }, 100)
      }
    }
  }
}
