document.addEventListener('DOMContentLoaded', () => {
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const gridContainer = document.querySelector('.grid-container')
    const previewContainer = document.querySelector('.preview-container')
    const width = 10
    const height = 20
    const previewWidth = 4
    createGrid()
    let squares = Array.from(document.querySelectorAll('.grid-container div'))
    const previewSquares = document.querySelectorAll('.preview-container div')
    console.log(previewSquares)

    let timerId
    
    // Create Game Grid
    function createGrid() {
        // Visible div grid cells
        for (let gridIndex = 0; gridIndex < width*height; gridIndex++) {
            let gridCell = document.createElement("div")
            gridCell.classList.add('cell')
            gridContainer.appendChild(gridCell)        
        }
        // Non-visible div grid cells at bottom of game board for floor
        for (let gridIndex = 0; gridIndex < width; gridIndex++) {
            let gridCell = document.createElement("div")
            gridCell.classList.add('taken')
            gridContainer.appendChild(gridCell)        
        }
        // Preview grid
        for (let gridIndex = 0; gridIndex < previewWidth*previewWidth; gridIndex++) {
            let gridCell = document.createElement("div")
            gridCell.classList.add('preview-cell')
            previewContainer.appendChild(gridCell) 
            
        }
    }

    // The Tetriminoes
    const lTetromino = [
        [1, width+1, width*2+1, 0],
        [width, width+1, width+2, width*2],
        [0, width, width+1, width*2+1],
        [width+2, width*2, width*2+1, width*2+2]
    ]

    const jTetromino = [
        [0, width, width*2, 1],
        [width*2, width*2+1, width*2+2, width],
        [1, width+1, width*2+1, width*2],
        [width, width+1, width+2, width*2+2]
    ]
    
    const sTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const zTetromino = [
        [1, width, width+1, width*2],
        [width, width+1, width*2+1, width*2+2]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominos = [lTetromino, jTetromino, sTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    const previewTetrominos = [
        [1, previewWidth+1, previewWidth*2+1, 0],                   // lTetromino
        [1, previewWidth+1, previewWidth*2+1, 2],                   // jTetromino    
        [0, previewWidth, previewWidth+1, previewWidth*2+1],        // sTetromino
        [1, previewWidth, previewWidth+1, previewWidth*2],          // zTetromino
        [1, previewWidth, previewWidth+1, previewWidth+2],          // tTetromino
        [0, 1, previewWidth, previewWidth+1],                       // oTetromino
        [1, previewWidth+1, previewWidth*2+1, previewWidth*3+1]     // iTetromino
    ]

    let gameSpeed = 300
    let nextTetromino = getRandomTetromino()
    let current
    let currentTetromino 
    let score = 0
    getnewTetromino()

    // Get a new random Tetromino
    function getRandomTetromino() {
        return Math.floor(Math.random() * theTetrominos.length)
    }

    // Draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    // Undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }


    // Assign functions to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keydown', control)

    // Move Tetromino down function
    function moveDown() {
        undraw()
        const isAtBottom = current.some(index => 
            squares[currentPosition + index + width].classList.contains('taken'))
        if (isAtBottom) {
            freeze()
            getnewTetromino()
        }
        else currentPosition += width
        draw()
    }
    
    // Freeze tetromino function
    function freeze() {
        const isAtBottom = current.some(index => 
            squares[currentPosition + index + width].classList.contains('taken'))
        if (isAtBottom) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            draw()
            addScore()
        }
    }

    // Make the next Tetromino start falling
    function getnewTetromino() {
        currentRotation = 0
        currentPosition = 4
        currentTetromino = nextTetromino
        nextTetromino = getRandomTetromino()
        current = theTetrominos[currentTetromino][currentRotation]
        generatePreview()        
    }

    // Create preview of next Tetromino
    function generatePreview() {
        previewSquares.forEach(square => {
            square.classList.remove('tetromino')
        })
        previewTetrominos[nextTetromino].forEach( index => {
            previewSquares[index].classList.add("tetromino")
        })
    }

    // Move the tetromino left if possible
    function moveLeft() {
        undraw()
        // Check if current position is at edge
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge) currentPosition -= 1
        // Check if move is not obscured by another tetromino
        const isInvalidMove = current.some(index => 
            squares[currentPosition + index].classList.contains('taken'))
        if (isInvalidMove) currentPosition += 1
        draw()
    }

    // Move the tetromino right if possible
    function moveRight() {
        undraw()
        // Check if current position is at edge
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1)
        if (!isAtRightEdge) currentPosition += 1
        // Check if move is not obscured by another tetromino
        const isInvalidMove = current.some(index => 
            squares[currentPosition + index].classList.contains('taken'))
        if (isInvalidMove) currentPosition -= 1
        draw()
    }
    
    // Rotate the Tetromino
    function rotate() {
        undraw()
        // Get next rotation for the current tetromino
        currentRotation = (currentRotation +1) % theTetrominos[currentTetromino].length
        current = theTetrominos[currentTetromino][currentRotation]
        draw()
    }

    // Start and Pause button functionality
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            // Make the tetromino move down every interval
            timerId = setInterval(moveDown, gameSpeed)

        }
    })

    // Add Score Function
    function addScore() {
        for (let i = 0; i < height; i++) {
            let row = new Array(width)
            for (let j = 0; j < row.length; j++) {
                row[j] = i*width + j
            }

            let isFullRow = row.every(index => squares[index].classList.contains('taken'))
            if (isFullRow) {
                console.log("it worked")
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken', 'tetromino')
                })
                const squaresRemoved = squares.splice(i*width, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => gridContainer.appendChild(cell))
            }
        }
    }


})