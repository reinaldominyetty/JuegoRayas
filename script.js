const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.getElementById('winningMessageText')
const restartButton = document.getElementById('restartButton')
const restartButtonMessage = document.getElementById('restartButtonMessage')
const themeSwitcher = document.getElementById('themeSwitcher')
const themeIcon = document.getElementById('themeIcon')
const gameModeSelect = document.getElementById('gameMode')
let isUserTurn = true

const clickSoundSrc = 'music/click.wav'
const winSound = new Audio('music/victoria.wav')
const drawSound = new Audio('music/empate.wav')
let clickSound

startGame()

restartButton.addEventListener('click', startGame)
restartButtonMessage.addEventListener('click', startGame)
themeSwitcher.addEventListener('click', toggleTheme)
gameModeSelect.addEventListener('change', handleGameModeChange)

function startGame() {
    isUserTurn = true
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
    })
    setBoardHoverClass()
    winningMessageElement.classList.remove('show')
}

function handleClick(e) {
    const cell = e.target
    const currentClass = isUserTurn ? X_CLASS : CIRCLE_CLASS
    placeMark(cell, currentClass)

    if (clickSound) {
        clickSound.pause()
        clickSound.currentTime = 0
    }
    clickSound = new Audio(clickSoundSrc)
    clickSound.play()

    if (checkWin(currentClass)) {
        if (clickSound) {
            clickSound.pause()
            clickSound.currentTime = 0
        }
        endGame(false)
        winSound.play()
    } else if (isDraw()) {
        if (clickSound) {
            clickSound.pause()
            clickSound.currentTime = 0
        }
        endGame(true)
        drawSound.play()
    } else {
        swapTurns()
        setBoardHoverClass()
        if (!isUserTurn && gameModeSelect.value === 'ai') {
            setTimeout(systemMove, 500) // Add a delay for the system's move
        }
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = '¡Empate!'
    } else {
        winningMessageTextElement.innerText = `${isUserTurn ? "X's" : "O's"} ¡Ha Ganado!`
    }
    winningMessageElement.classList.add('show')
    updateScoreboard(draw ? null : isUserTurn ? 'x' : 'o')
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
}

function swapTurns() {
    isUserTurn = !isUserTurn
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
    if (isUserTurn) {
        board.classList.add(X_CLASS)
    } else {
        board.classList.add(CIRCLE_CLASS)
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

function systemMove() {
    const bestMove = minimax(cellElements, CIRCLE_CLASS).index
    if (bestMove !== undefined) {
        const cell = cellElements[bestMove]
        placeMark(cell, CIRCLE_CLASS)
        if (checkWin(CIRCLE_CLASS)) {
            endGame(false)
            winSound.play()
        } else if (isDraw()) {
            endGame(true)
            drawSound.play()
        } else {
            swapTurns()
            setBoardHoverClass()
        }
    }
}

function minimax(newBoard, player) {
    const availSpots = [...newBoard].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS))

    if (checkWin(X_CLASS)) {
        return { score: -10 }
    } else if (checkWin(CIRCLE_CLASS)) {
        return { score: 10 }
    } else if (availSpots.length === 0) {
        return { score: 0 }
    }

    const moves = []

    for (let i = 0; i < availSpots.length; i++) {
        const move = {}
        move.index = [...cellElements].indexOf(availSpots[i])
        newBoard[move.index].classList.add(player)

        if (player === CIRCLE_CLASS) {
            const result = minimax(newBoard, X_CLASS)
            move.score = result.score
        } else {
            const result = minimax(newBoard, CIRCLE_CLASS)
            move.score = result.score
        }

        newBoard[move.index].classList.remove(player)

        moves.push(move)
    }

    let bestMove
    if (player === CIRCLE_CLASS) {
        let bestScore = -10000
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score
                bestMove = i
            }
        }
    } else {
        let bestScore = 10000
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score
                bestMove = i
            }
        }
    }

    return moves[bestMove]
}

function toggleTheme() {
    document.body.classList.toggle('dark')
    if (document.body.classList.contains('dark')) {
        themeIcon.src = 'images/half-moon.png'
    } else {
        themeIcon.src = 'images/sun.png'
    }
}

function handleGameModeChange() {
    startGame() // Limpia el tablero cada vez que cambia el modo de juego
}

function updateScoreboard(winner) {
    if (winner === 'x') {
        const xWinsElement = document.getElementById('xWins')
        xWinsElement.textContent = parseInt(xWinsElement.textContent) + 1
    } else if (winner === 'o') {
        const oWinsElement = document.getElementById('oWins')
        oWinsElement.textContent = parseInt(oWinsElement.textContent) + 1
    }
}
