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
let circleTurn

const clickSoundSrc = 'music/click.wav'
const winSound = new Audio('music/victoria.wav')
const drawSound = new Audio('music/empate.wav')
let clickSound

startGame()

restartButton.addEventListener('click', startGame)
restartButtonMessage.addEventListener('click', startGame)
themeSwitcher.addEventListener('click', toggleTheme)

function startGame() {
    circleTurn = false
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
    if (clickSound) {
        clickSound.pause()
        clickSound.currentTime = 0
    }
    clickSound = new Audio(clickSoundSrc) // Create a new Audio instance
    clickSound.play() // Play click sound

    const cell = e.target
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
    placeMark(cell, currentClass)
    if (checkWin(currentClass)) {
        if (clickSound) {
            clickSound.pause()
            clickSound.currentTime = 0
        }
        endGame(false)
        winSound.play() // Play win sound
    } else if (isDraw()) {
        if (clickSound) {
            clickSound.pause()
            clickSound.currentTime = 0
        }
        endGame(true)
        drawSound.play() // Play draw sound
    } else {
        swapTurns()
        setBoardHoverClass()
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = '¡Empate!'
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} ¡Ha Ganado!`
    }
    winningMessageElement.classList.add('show')
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
    circleTurn = !circleTurn
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS)
    } else {
        board.classList.add(X_CLASS)
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

function toggleTheme() {
    document.body.classList.toggle('dark')
    if (document.body.classList.contains('dark')) {
        themeIcon.src = 'images/half-moon.png'
    } else {
        themeIcon.src = 'images/sun.png'
    }
}
