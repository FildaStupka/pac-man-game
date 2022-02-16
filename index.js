const message = document.getElementById("message")
const scoreDisplay = document.getElementById("score-display")
const board = document.getElementById("board")
const startDesk = document.getElementById("start-desk")
const startBtn = document.getElementById("start-btn")
const squares = []
const width = 21
const directions = [1, -1, width, -width]
const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,
    1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,
    1,0,1,1,0,0,0,1,0,0,0,0,3,1,0,0,0,1,1,0,1,
    1,0,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,0,1,
    1,3,0,0,0,1,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,
    1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,
    1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,
    1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,3,0,0,0,1,
    1,0,1,1,1,1,0,1,2,2,2,2,2,1,0,1,1,1,1,0,1,
    4,0,0,0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,0,0,4,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,3,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,
    1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,
    1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,
    1,0,0,0,0,1,0,1,0,1,1,1,0,1,0,1,0,0,0,3,1,
    1,0,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,0,1,
    1,0,1,1,0,0,0,1,3,0,0,0,0,1,0,0,0,1,1,0,1,
    1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,
    1,3,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
]

let pacmanCurrentIndex = 409
let newDirection = directions[2]
let currentDirection = newDirection
let score = 0
let unscareTimer = NaN
let moveTimer = NaN

class Ghost {
    constructor (className, startIndex, speed) {
        this.className = className
        this.startIndex = startIndex
        this.speed = speed
        this.currentIndex = startIndex
        this.isScared = false
        this.timerId = NaN
    }
}

const ghosts = [
    new Ghost("blinky", 218, 300),
    new Ghost("pinky", 219, 350),
    new Ghost("inky", 221, 400),
    new Ghost("clyde", 222, 450)
]

// setup
setup = () => {
    pacmanCurrentIndex = 409
    newDirection = directions[2]
    score = 0
    currentDirection = newDirection
    unscareTimer = NaN


    createBoard = () => {
        squares.length = 0
        board.innerHTML = ""
        for (const value of layout) {
            const newSquare = document.createElement("div")
            switch(value) {
                case 0:
                    newSquare.classList.add("pac-dot")
                break
                case 1:
                    newSquare.classList.add("wall")
                break
                case 2:
                    newSquare.classList.add("ghost-lair")
                break
                case 3:
                    newSquare.classList.add("power-pellet")
                break
            }
            squares.push(newSquare)
        }
        for (const square of squares) {
            board.appendChild(square)
        }
    }
    
    createBoard()
    
    createPacman = () => squares[pacmanCurrentIndex].classList.add("pac-man")
    
    createPacman()
    
    ghosts.forEach(ghost => squares[ghost.startIndex].classList.add(ghost.className, "ghost"))
}

setup()

// ghosts

moveGhost = ghost => {
    let direction
    let lastDirection
    
    ghost.timerId = setInterval(() => {
        const availableDirections = directions.filter(availableDirection => 
            availableDirection !== -lastDirection &&
            !squares[ghost.currentIndex + availableDirection].classList.contains("wall") &&
            !squares[ghost.currentIndex + availableDirection].classList.contains("ghost") &&
            !(!squares[ghost.currentIndex].classList.contains("ghost-lair") &&
            squares[ghost.currentIndex + availableDirection].classList.contains("ghost-lair"))
        )

        if (availableDirections.length) {
            direction = availableDirections[Math.floor(Math.random() * availableDirections.length)]
        } else direction = -lastDirection

        lastDirection = direction

        ghostEaten = ghost => {
            if (squares[ghost.currentIndex].classList.contains("pac-man") && ghost.isScared) {
                squares[ghost.currentIndex].classList.remove("scared-ghost", "ghost", ghost.className)
                ghost.isScared = false
                ghost.currentIndex = ghost.startIndex
                score += 100
                scoreDisplay.textContent = score
            }
        }

        ghostEaten(ghost)

        squares[ghost.currentIndex].classList.remove("ghost", ghost.className, "scared-ghost")
        ghost.currentIndex += direction
        squares[ghost.currentIndex].classList.add("ghost", ghost.className)

        ghostEaten(ghost)

        if (ghost.isScared) {
            squares[ghost.currentIndex].classList.add("scared-ghost")
        }
        
        gameOver()
    }, ghost.speed)
}

unscareGhosts = () => {
    ghosts.forEach(ghost => ghost.isScared = false)
}

//pacman

control = e => {
    switch(e.key) {
        case "ArrowRight":
            newDirection = directions[0]
        break
        case "ArrowLeft":
            newDirection = directions[1]
        break
        case "ArrowDown":
            newDirection = directions[2]
        break
        case "ArrowUp":
            newDirection = directions[3]
        break
    }
}

move = () => {
    moveTimer = setInterval(() => {
        squares[pacmanCurrentIndex].classList.remove("pac-man")
        if (!squares[pacmanCurrentIndex + newDirection].classList.contains("wall") &&
        !squares[pacmanCurrentIndex + newDirection].classList.contains("ghost-lair")) {
            currentDirection = newDirection
        }

        if (!squares[pacmanCurrentIndex + currentDirection].classList.contains("wall") &&
        !squares[pacmanCurrentIndex + currentDirection].classList.contains("ghost-lair") ||
        pacmanCurrentIndex === 210 ||
        pacmanCurrentIndex === 230) {
            pacmanCurrentIndex += currentDirection
            if (pacmanCurrentIndex === 209) {
                pacmanCurrentIndex = 230
            } else if (pacmanCurrentIndex === 231) {
                pacmanCurrentIndex= 210
            }
        }
        squares[pacmanCurrentIndex].classList.add("pac-man")
        pacdotEaten()
        gameOver()
        win()
    }, 500)
}

pacdotEaten = () => {
    if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
        squares[pacmanCurrentIndex].classList.remove("pac-dot")
        score++
        scoreDisplay.textContent = score
    } else if (squares[pacmanCurrentIndex].classList.contains("power-pellet")) {
        squares[pacmanCurrentIndex].classList.remove("power-pellet")
        score += 10
        scoreDisplay.textContent = score
        ghosts.forEach(ghost => ghost.isScared = true)
        clearTimeout(unscareTimer)
        unscareTimer = setTimeout(unscareGhosts, 10000)
    }
}

document.addEventListener("keydown", control)

// win and game over

gameOver = () => {
    if (squares[pacmanCurrentIndex].classList.contains("ghost") && !squares[pacmanCurrentIndex].classList.contains("scared-ghost")) {
        clearInterval(moveTimer)
        ghosts.forEach(ghost => {
            clearInterval(ghost.timerId)
            ghost.currentIndex = ghost.startIndex
        })
        message.textContent = "You lose!!! Wanna try again?"
        startDesk.style.display = "flex"
        setup()
    }
}

win = () => {
    if (!document.querySelectorAll(".power-pellet").length && !document.querySelectorAll(".pac-dot").length) {
        clearInterval(moveTimer)
        ghosts.forEach(ghost => {
            clearInterval(ghost.timerId)
            ghost.currentIndex = ghost.startIndex
        })
        message.textContent = "You win!!! Wanna try again?"
        startDesk.style.display = "flex"
        setup()
    }
}

// start

startGame = () => {
    startDesk.style.display = "none"
    message.textContent = "Pac-man"
    scoreDisplay.textContent = score
    ghosts.forEach(ghost => moveGhost(ghost))
    move()
}

startBtn.addEventListener("click", startGame)