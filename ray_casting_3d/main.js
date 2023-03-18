const VERTICAL_LINES = 510;

const HEIGHT = 573.75;
const WIDTH = 1020;
const STEP = WIDTH / VERTICAL_LINES;

const worldCanvas = document.getElementById("canvas");
worldCanvas.height = HEIGHT;
worldCanvas.width = WIDTH;

const CELL_TO_COLOR = [
    "grey",
    "black",
    "red",
    "blue",
    "green"
];

const GAME_WORLD = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 3, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 0, 4, 4, 0, 1],
    [1, 0, 0, 0, 4, 0, 0, 1],
    [1, 0, 3, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
];

const ALL_LINES = getAllLines(); // will be populated during the drawing

const PLAYER = {
    x: 100,
    y: 100,
    rotationAngle: 20,
    fixedAngle: Math.PI / 3
};

function getAllLines() {
    const STEP = 50;

    const allLines = [];
    for (let i = 0; i < GAME_WORLD.length; i++) {
        for (let j = 0; j < GAME_WORLD.length; j++) {
            const cell = GAME_WORLD[i][j];
            let color = CELL_TO_COLOR[cell];

            if (cell !== 0) {
                const x = j * STEP;
                const y = i * STEP;

                const lTop = { line: line(x, y, x + STEP, y), color };
                const lBottom = { line: line(x, y + STEP, x + STEP, y + STEP), color };
                const lLeft = { line: line(x, y, x, y + STEP), color };
                const lRight = { line: line(x + STEP, y, x + STEP, y + STEP), color };

                allLines.push(lTop);
                allLines.push(lBottom);
                allLines.push(lLeft);
                allLines.push(lRight);
            }
        }
    }
    return allLines;
}

function drawMiniMap() {
    const HEIGHT = 400;
    const WIDTH = 400;
    const STEP = 50;

    const canvas = document.getElementById("mini-canvas");
    canvas.height = HEIGHT;
    canvas.width = WIDTH;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let i = 0; i < GAME_WORLD.length; i++) {
        for (let j = 0; j < GAME_WORLD.length; j++) {
            const cell = GAME_WORLD[i][j];
            ctx.fillStyle = CELL_TO_COLOR[cell];
            ctx.fillRect(j * STEP, i * STEP, STEP, STEP);
        }
    }

    // draw the player
    ctx.beginPath()
    ctx.fillStyle = "red"
    ctx.arc(PLAYER.x, PLAYER.y, 5, 2 * Math.PI, 0, false);
    ctx.fill();

    function drawRays() {
        const HIT_BOX = [];
        const step = PLAYER.fixedAngle / VERTICAL_LINES; // Math.PI / 360;
        for (let radian = -PLAYER.fixedAngle / 2; radian < PLAYER.fixedAngle / 2; radian += step) {
            const radianRotated = radian + PLAYER.rotationAngle;
            const line = getLineByAngle(PLAYER.x, PLAYER.y, radianRotated, WIDTH);

            const arr = ALL_LINES
                .map(target => {
                    let result = intersects(target.line, line)
                    return {
                        intersection: result,
                        color: target.color
                    }
                })
                .filter(result => result.intersection !== null)
                .map(result => {
                    return {
                        ...result,
                        distance: distance(result.intersection, PLAYER)
                    }
                });

            arr.sort((a, b) => a.distance - b.distance);

            const closest = arr[0].intersection;

            HIT_BOX.push(arr[0]);

            ctx.beginPath();
            ctx.moveTo(PLAYER.x, PLAYER.y);
            ctx.lineTo(closest.x, closest.y);
            ctx.strokeStyle = "yellow";
            ctx.stroke();
        }

        return HIT_BOX;
    }

    return drawRays();
}

function updateWorldView(HIT_BOX) {
    const ctx = worldCanvas.getContext("2d");
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, WIDTH, HEIGHT / 2);
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT / 2);

    let vFrame = 0; // vertical frame

    for (let line of HIT_BOX) {
        const { intersection, color, distance } = line;
        const height = (HEIGHT / distance) * 40;
        let x = vFrame * STEP;
        let y = (HEIGHT - height) / 2;
        
        let red = Math.max(255 - Math.min(distance, 255), 30);

        ctx.fillStyle = `rgb(${red}, 11, 11)` // isLeft ? "red" : "darkred"// color;
        ctx.fillRect(x, y, STEP, height);
        vFrame++;
    }
}

const HIT_BOX = drawMiniMap()
updateWorldView(HIT_BOX);

function nextPoint(p0, p1, t) {
    const btx = p0.x + t * (p1.x - p0.x);
    const bty = p0.y + t * (p1.y - p0.y);
    return point(btx, bty);
}

document.addEventListener('keydown', (ev) => {
    const key = ev.key;
    if (key === "ArrowRight") {
        PLAYER.rotationAngle += 0.05;
    } else if (key === "ArrowLeft") {
        PLAYER.rotationAngle -= 0.05;
    } else if (key === "ArrowUp" || key === "ArrowDown") {
        const forwardLine = getLineByAngle(PLAYER.x, PLAYER.y, PLAYER.rotationAngle, WIDTH * 2);
        const t = key === "ArrowUp" ? 0.0005 : -0.0005;
        const {x, y} = nextPoint(forwardLine.p1, forwardLine.p2, t);

        const blockX = Math.floor(x / 50);
        const blockY = Math.floor(y / 50);
        if (GAME_WORLD[blockY][blockX] === 0) {
            PLAYER.x = x;
            PLAYER.y = y;
        }
    }

    if (key.startsWith("Arrow")) {
        const HIT_BOX = drawMiniMap()
        updateWorldView(HIT_BOX);
    }
})