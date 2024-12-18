const VERTICAL_LINES = 1020;

const HEIGHT = 573.75;
const WIDTH = 1020;
const STEP = WIDTH / VERTICAL_LINES;

const ROTATION_ANGLE_STEP = 0.05
const PLAYER_MOVEMENT_STEP = 0.001

const worldCanvas = document.getElementById("canvas");
worldCanvas.height = HEIGHT;
worldCanvas.width = WIDTH;

const BRICK_IMG = document.getElementById("brick");

const CELL_TO_COLOR = [
    "grey",
    "black",
    "red",
    "blue",
    "green"
];

// const COLOR_TO_RGB_INTENSITY = {
//     "red": intensity => `rgb(${intensity}, 11, 11)`,
//     "black": intensity => `rgb(${intensity}, 11, 11)`,
//     "green": intensity => `rgb(11, ${intensity}, 11)`,
//     "blue": intensity => `rgb(11, 11, ${intensity})`,
// }

const COLOR_TO_RGB_INTENSITY = {
    "red": t => `rgb(${t * 255}, 0, 0)`,
    "black": t => `rgb(${t * 255}, 0, 0)`,
    "green": t => `rgb(0, ${t * 255}, 0)`,
    "blue": t => `rgb(0, 0, ${t * 255})`,
}

const GAME_WORLD = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
];

const ALL_LINES = getAllLines();

const PLAYER = {
    x: 100,
    y: 200,
    rotationAngle: 0,
    fieldOfView: Math.PI / 3,
    keys: {
        "ArrowRight": false,
        "ArrowLeft": false,
        "ArrowUp": false,
        "ArrowDown": false,
    }
};

let lastRenderTime = 0

function getAllLines() {
    const STEP = 50;

    const allLines = [];
    const seen = new Set();
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

                for (let line of [lTop, lBottom, lLeft, lRight]) {
                    const s = JSON.stringify(line);
                    if (!seen.has(s)) {
                        allLines.push(line);
                        seen.add(s);
                    }
                }
                
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
        const step = PLAYER.fieldOfView / VERTICAL_LINES;
        for (let radian = -PLAYER.fieldOfView / 2; radian < PLAYER.fieldOfView / 2; radian += step) {
            const radianRotated = radian + PLAYER.rotationAngle;
            const line = getLineByAngle(PLAYER.x, PLAYER.y, radianRotated, WIDTH * 2);

            const arr = ALL_LINES
                .map(target => {
                    let result = intersects(target.line, line)
                    if (result !== null) {
                        const [point, t] = result;
                        return {
                            intersection: point,
                            t: t,
                            color: target.color
                        }
                    }
                    return null
                })
                .filter(result => result !== null)
                .map(result => {
                    return {
                        ...result,
                        distance: distance(result.intersection, PLAYER)
                    }
                });

            arr.sort((a, b) => a.distance - b.distance);

            if (arr.length == 0) {
                continue;
            }

            const closest = arr[0].intersection;
            arr[0].distance *= Math.cos(radian);

            HIT_BOX.push(arr[0]);

            ctx.beginPath();
            ctx.moveTo(PLAYER.x, PLAYER.y);
            ctx.lineTo(closest.x, closest.y);
            ctx.strokeStyle = "rgba(255,255,224, 0.5)";
            ctx.stroke();
        }
        // simply an array
        // where items are ordered in the way the rays progress from one border to the other
        // each item has {intersection, color, distance}
        return HIT_BOX;
    }

    return drawRays();
}

function updateWorldView(HIT_BOX) {
    const ctx = worldCanvas.getContext("2d");
    ctx.fillStyle = "grey"; // sky
    ctx.fillRect(0, 0, WIDTH, HEIGHT / 2);
    ctx.fillStyle = "lightgrey"; // ground
    ctx.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT / 2);

    let verticalStripe = 0;

    for (let { distance, color, t } of HIT_BOX) {
        const height = (HEIGHT / distance) * 40;
        let x = verticalStripe * STEP;
        let y = (HEIGHT - height) / 2;
       
        let intensity = Math.max(255 - Math.min(distance, 255), 30);

        // ctx.fillStyle = COLOR_TO_RGB_INTENSITY[color](t)
        // ctx.fillRect(x, y, STEP, height);
        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImage(
            BRICK_IMG,
            t*128, 0,
            50 / 128, 128, // swidth is not right
            x, y, 
            STEP, height
        )
        verticalStripe++;
    }
}

const HIT_BOX = drawMiniMap()
updateWorldView(HIT_BOX);

// linear interpolation
function lerp(p0, p1, t) {
    const btx = p0.x + t * (p1.x - p0.x);
    const bty = p0.y + t * (p1.y - p0.y);
    return point(btx, bty);
}

document.addEventListener('keydown', ({key}) => {
    PLAYER.keys[key] = key && key.startsWith("Arrow");
}, false);

document.addEventListener('keyup', ({key}) => {
    PLAYER.keys[key] = !(key && key.startsWith("Arrow"));
});

function gameloop(timePassed) {
    const deltaTimeMs = timePassed - lastRenderTime;
    
    // lock the framerate to 60
    if (deltaTimeMs < (1000 / 60)) {
        window.requestAnimationFrame(gameloop)
        return;
    }

    PLAYER.rotationAngle += (PLAYER.keys["ArrowRight"] - PLAYER.keys["ArrowLeft"]) * ROTATION_ANGLE_STEP
    
    if (PLAYER.keys["ArrowUp"] || PLAYER.keys["ArrowDown"]) {
        const forwardLine = getLineByAngle(PLAYER.x, PLAYER.y, PLAYER.rotationAngle, WIDTH * 2);
        const t = PLAYER.keys["ArrowUp"] ? PLAYER_MOVEMENT_STEP : -PLAYER_MOVEMENT_STEP;
        const {x, y} = lerp(forwardLine.p1, forwardLine.p2, t);

        const blockX = Math.floor(x / 50);
        const blockY = Math.floor(y / 50);
        if (GAME_WORLD[blockY][blockX] === 0) {
            PLAYER.x = x;
            PLAYER.y = y;
        }
    }

    const HIT_BOX = drawMiniMap()
    updateWorldView(HIT_BOX);
    lastRenderTime = timePassed
    window.requestAnimationFrame(gameloop)
}

window.requestAnimationFrame(gameloop);

