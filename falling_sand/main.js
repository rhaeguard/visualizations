const HEIGHT = 600
const WIDTH = 600
const STEP = 5
const rowCount = HEIGHT / STEP
const colCount = WIDTH / STEP

const canvas = document.getElementById("canvas")

canvas.height = HEIGHT
canvas.width = WIDTH

function createMatrix() {
    return Array.from(Array(rowCount), () => new Array(colCount).fill(0));
}

const ctx = canvas.getContext("2d");
let matrix = createMatrix()

function rotate(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

let isMousePressed = false

canvas.addEventListener('mousedown', (ev) => {
    isMousePressed = true
})

canvas.addEventListener('mouseup', (ev) => {
    isMousePressed = false
})

canvas.addEventListener('mousemove', (ev) => {
    if (isMousePressed) {
        const rect = canvas.getBoundingClientRect();
        const c = Math.floor((ev.clientX - rect.left) / STEP);
        const r = Math.floor((ev.clientY - rect.top) / STEP);

        // a is the top left corner
        const ax = c-2
        const ay = r-2

        // how many sand particles to generate
        const count = Math.floor(Math.random() * 10) + 1 // max is 11

        for (let i=0; i<count; i++) {
            const offsetX = Math.floor(Math.random() * 10) % 5
            const offsetY = Math.floor(Math.random() * 10) % 5

            const xx = ax + offsetX
            const yy = ay + offsetY

            if (matrix[yy][xx] === 0) {
                matrix[yy][xx] = 1
            }
        }
    }

})

function drawGrid() {
    const gradient = ctx.createLinearGradient(WIDTH / 2, 0, WIDTH / 2, 0.5*HEIGHT);

    // Add three color stops
    gradient.addColorStop(0, "skyblue");
    gradient.addColorStop(1, "white");
    
    // Set the fill style and draw a rectangle
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

function update() {
    for (let r = rowCount - 1; r >= 0; r--) {
        for (let c = 0; c < colCount; c++) {
            // neighbors
            if (r + 1 < rowCount) {
                let me = matrix[r][c]
                let down = matrix[r+1][c]
                if (down === 0 || Math.random > 0.2) {
                    matrix[r+1][c] = me
                    matrix[r][c] = 0
                } else {
                    let right = c+1 < colCount ? matrix[r+1][c+1] : 1
                    let left = c-1 >= 0 ? matrix[r+1][c-1] : 1
                    
                    
                    if (right === 0 && left === 0) {
                        if (Math.random() > 0.5) {
                            right = 1
                        } else {
                            left = 1
                        }
                    }

                    if (right === 0) {
                        matrix[r+1][c+1] = me
                        matrix[r][c] = 0
                    } else if (left === 0) {
                        matrix[r+1][c-1] = me
                        matrix[r][c] = 0
                    }
                }
            }
        }
    }
}

function drawMatrix() {
    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            if (matrix[r][c] === 1) {
                ctx.fillStyle = '#C2B280'
                ctx.fillRect(c*STEP, r*STEP, STEP, STEP);
            }
        }
    }
}

let lastUpdateTime = 0

function loop(time) {
    if (time - lastUpdateTime > 10) {
        update()
        lastUpdateTime = time
    }
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    drawGrid()
    drawMatrix()
    window.requestAnimationFrame(loop)
}

window.requestAnimationFrame(loop)


