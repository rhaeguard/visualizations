const SIZE = 800;
const step = 20;
const cellSize = Math.floor(SIZE / step);
const canvas = document.getElementById("canvas");
canvas.width = SIZE;
canvas.height = SIZE;

const ctx = canvas.getContext("2d");

// create a 2D array of cellSize x cellSize elements
// each cell is dead initially
let cells = Array.from(Array(cellSize), () => new Array(cellSize).fill(false));

// load previously known configuration
let selectedConfig = [
    [10, 16],
    [11, 14],
    [11, 16],
    [11, 17],
    [12, 14],
    [12, 16],
    [13, 14],
    [14, 12],
    [15, 10],
    [15, 12],
];

selectedConfig.forEach(([row, col]) => {
    cells[row][col] = true;
});

// end predefined config

// is the position valid
function checkPosValidity([row, col]) {
    return row >= 0 && row < cellSize && col >= 0 && col < cellSize;
}

// is the cell alive
function isAlive([row, col]) {
    return cells[row][col];
}

// find how many neighbors are alive
function neighborStats(row, col) {
    const [left, right] = [
        [row, col - 1],
        [row, col + 1],
    ];
    const [up, down] = [
        [row - 1, col],
        [row + 1, col],
    ];
    const [lu, ru] = [
        [row - 1, col - 1],
        [row - 1, col + 1],
    ];
    const [ld, rd] = [
        [row + 1, col - 1],
        [row + 1, col + 1],
    ];

    const neighbors = [left, right, up, down, lu, ru, ld, rd];
    return neighbors.filter(checkPosValidity).filter(isAlive).length;
}

// compute the next generation
function nextGen() {
    // allocate new space
    const newCells = Array.from(Array(cellSize), () =>
        new Array(cellSize).fill(false)
    );
    // for each cell
    for (let row = 0; row < cellSize; row++) {
        for (let col = 0; col < cellSize; col++) {
            let amLive = cells[row][col];
            const live = neighborStats(row, col);
            // a cell is alive if
            // it is currently alive with 2 or 3 live neighbors
            // or it is dead with exactly 3 live neighbors
            newCells[row][col] =
                (amLive && (live === 2 || live === 3)) ||
                (!amLive && live === 3);
        }
    }
    // save the new board into the original board
    cells = newCells;
}

// drawing the grid
function drawGrid() {
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, SIZE, SIZE);
    // vertical lines
    for (let x = 0; x <= SIZE - step; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, SIZE);
        ctx.strokeStyle = "white";
        ctx.stroke();
    }

    // horizontal lines
    for (let y = 0; y <= SIZE - step; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(SIZE, y);
        ctx.strokeStyle = "white";
        ctx.stroke();
    }
}

// drawing each cell in the board to the canvas screen 
function drawCells() {
    for (let row = 0; row < cellSize; row++) {
        for (let col = 0; col < cellSize; col++) {
            let amLive = cells[row][col];
            if (amLive === true) {
                ctx.fillStyle = "yellow";
                ctx.fillRect(col * step, row * step, step, step);
            }
        }
    }
}

// flag to stop/continue the process
let stopped = false;
drawGrid();
drawCells();

// to mimic the delay, we use the setTimeout in a loop
function gameOfLife() {
    if (!stopped) {
        setTimeout(() => {
            // clear the screen
            ctx.clearRect(0, 0, SIZE, SIZE);
            // generate the next set of cells
            nextGen();
            // draw the grid
            drawGrid();
            // draw the updated cells
            drawCells();
            // move on to the next iteration
            gameOfLife();
        }, 100);
    }
}

// bind an action to the start button
document.getElementById("startBtn").addEventListener("click", (evt) => {
    evt.preventDefault();
    // Drawing the initial state
    drawCells();
    gameOfLife();
});

// bind an action to the stop button
document.getElementById("stopBtn").addEventListener("click", (evt) => {
    evt.preventDefault();
    // basically switching between Stop and Pause
    const isStop = document.getElementById("stopBtn").innerText === "Stop"
    stopped = isStop
    document.getElementById("stopBtn").innerText = isStop ? "Pause" : "Stop"
    if (!stopped) {
        gameOfLife()
    }
});

// check if the config contains the selected cell
function configContains(row, col) {
    for (let c of selectedConfig) {
        const [a, b] = c;
        if (a === row && b === col) {
            return true;
        }
    }
    return false;
}

// removing the selected cell from the current configuration object
// and kills the cell in the board
function removeSelectedCell(row, col) {
    selectedConfig = selectedConfig.filter(
        ([a, b]) => !(a === row && b === col)
    );
    cells[row][col] = false
}

// adding the selected cell into the current configuration object
// and activates the cell in the board
function addSelectedCell(row, col) {
    selectedConfig.push([row, col]);
    cells[row][col] = true
}

// Event listener for selecting a particular cell
canvas.addEventListener("click", (e) => {
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;

    let col = Math.floor(x / step);
    let row = Math.floor(y / step);

    if (configContains(row, col)) {
        ctx.fillStyle = "grey";
        removeSelectedCell(row, col);
    } else {
        ctx.fillStyle = "yellow";
        addSelectedCell(row, col);
    }
    ctx.fillRect(col * step, row * step, step, step);
});
