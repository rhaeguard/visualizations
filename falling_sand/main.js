const canvas = document.getElementById("canvas")

canvas.height = HEIGHT
canvas.width = WIDTH

function createMatrix() {
    return Array.from(Array(rowCount), () => new Array(colCount).fill(cell()));
}

const ctx = canvas.getContext("2d");
let matrix = createMatrix()

let isMousePressed = false

canvas.addEventListener('mousedown', (ev) => { isMousePressed = true })
canvas.addEventListener('mouseup', (ev) => { isMousePressed = false })

canvas.addEventListener('mousemove', (ev) => {
    if (isMousePressed) {
        const rect = canvas.getBoundingClientRect();
        const c = Math.floor((ev.clientX - rect.left) / STEP);
        const r = Math.floor((ev.clientY - rect.top) / STEP);

        // a is the top left corner
        const ax = c - 2
        const ay = r - 2

        // how many sand particles to generate
        const count = 1 // Math.floor(Math.random() * 10) + 1 // max is 11

        for (let i = 0; i < count; i++) {
            const offsetX = Math.floor(Math.random() * 10) % 5
            const offsetY = Math.floor(Math.random() * 10) % 5

            const xx = ax + offsetX
            const yy = ay + offsetY

            if (matrix[yy][xx].value === 0) {
                matrix[yy][xx] = generateWater()
            }
        }
    }

})

function drawGrid() {
    const gradient = ctx.createLinearGradient(WIDTH / 2, 0, WIDTH / 2, 0.5 * HEIGHT);

    // Add three color stops
    gradient.addColorStop(0, "skyblue");
    gradient.addColorStop(1, "white");

    // Set the fill style and draw a rectangle
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

function update() {
    let copyMatrix = JSON.parse(JSON.stringify(matrix))
    for (let r = rowCount - 1; r >= 0; r--) {
        for (let c = colCount - 1; c >= 0; c--) {
            let me = matrix[r][c]
            if (me.type === 'sand') {
                updateSand(matrix, copyMatrix, r, c)
            } else if (me.type === 'water') {
                updateWater(matrix, copyMatrix, r, c)
            }
        }
    }
    matrix = copyMatrix
}

function drawMatrix() {
    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            if (matrix[r][c].value === 1) {
                ctx.fillStyle = getColor(matrix[r][c])
                ctx.fillRect(c * STEP, r * STEP, STEP, STEP);
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