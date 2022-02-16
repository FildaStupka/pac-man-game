const message = document.getElementById("message")
const scoreDisplay = document.getElementById("score-display")
const board = document.getElementById("board")
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
    1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,3,1,
    1,0,1,1,1,1,0,1,2,2,2,2,2,1,0,1,1,1,1,0,1,
    4,0,0,0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,0,0,4,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,
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

// setup

createBoard = () => {
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
        board.appendChild(newSquare)
    }
}

createBoard()

createPacman = () => squares[pacmanCurrentIndex].classList.add("pac-man")

createPacman()

class Ghost {
    constructor (className, startIndex, speed) {
        this.className = className
        this.startIndex = startIndex
        this.speed = speed
        this.currentIdnex = startIndex
        this.isScared = false
        this.timerId = NaN
    }
}

const ghosts = [
    new Ghost("blinky", 218, 250),
    new Ghost("pinky", 219, 300),
    new Ghost("inky", 221, 400),
    new Ghost("clyde", 222, 500)
]

ghosts.forEach(ghost => squares[ghost.startIndex].classList.add(ghost.className, "ghost"))

// ghosts

moveGhost = ghost => {
    let direction
    let lastDirection
    
    ghost.timerId = setInterval(() => {
        const availableDirections = directions.filter(availableDirection => 
            availableDirection !== -lastDirection &&
            !squares[ghost.currentIdnex + availableDirection].classList.contains("wall") &&
            !squares[ghost.currentIdnex + availableDirection].classList.contains("ghost") &&
            !(!squares[ghost.currentIdnex].classList.contains("ghost-lair") &&
            squares[ghost.currentIdnex + availableDirection].classList.contains("ghost-lair"))
        )

        console.log(availableDirections)

        if (availableDirections.length) {
            direction = availableDirections[Math.floor(Math.random() * availableDirections.length)]
        } else direction = -lastDirection

        lastDirection = direction

        squares[ghost.currentIdnex].classList.remove("ghost", ghost.className)
        ghost.currentIdnex += direction
        squares[ghost.currentIdnex].classList.add("ghost", ghost.className)
    }, ghost.speed)
}

ghosts.forEach(ghost => moveGhost(ghost))

//pacman

