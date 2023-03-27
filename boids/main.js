const HEIGHT = 500;
const WIDTH = 1000;

const canvas = document.getElementById("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext("2d")

const ALIGNMENT = 0.3;
const COHESION = 0.9;
const SEPARATION = 0.8;

function addVectors(v1, v2) {
    v1.x += v2.x;
    v1.y += v2.y;
}

function subVectorsNew(v1, v2) {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y
    }
}

function divVector(v, scalar) {
    if (scalar === 0) return;
    v.x /= scalar;
    v.y /= scalar;
}

function multVector(v, scalar) {
    return {
        x: v.x * scalar,
        y: v.y * scalar
    }
}

const Vectors = {
    create: function() {
        return {
            x: 0,
            y: 0
        }
    },
    add: function (v1, v2) {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y
        }
    },
    sub: function (v1, v2) {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y
        }
    },
    multByScalar: function (v, scalar) {
        return {
            x: v.x * scalar,
            y: v.y * scalar
        }
    },
    divByScalar: function (v, scalar) {
        if (scalar === 0) return;
        return {
            x: v.x /= scalar,
            y: v.y /= scalar
        }
    }
}

function clamp(v1, limit) {
    v1.x = v1.x > 0 ? Math.min(v1.x, limit) : Math.max(v1.x, -limit);
    v1.y = v1.y > 0 ? Math.min(v1.y, limit) : Math.max(v1.y, -limit);
}

const boids = generateBoids()

function randBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function sign() {
    return Math.random() > 0.5 ? 1 : -1;
}

function generateBoids() {
    const size = 20;
    return [...new Array(size)]
        .map(_ => {
            return {
                position: { x: randBetween(0, WIDTH), y: randBetween(0, HEIGHT) },
                velocity: { x: sign() * randBetween(0, 1), y: sign() * randBetween(0, 1) },
                accelaration: { x: sign() * 0.001, y: sign() * 0.001 },
            }
        })
}

function distance(p1, p2) {
    return Math.sqrt(
        (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
    );
}

function separation(dot) {
    const protectiveRange = 10;

    const close = {
        dx: 0,
        dy: 0
    }

    for (let other of boids) {
        if (dot === other) continue;
        const dist = distance(dot.position, other.position);

        if (dist < protectiveRange) {
            close.dx += dot.position.x - other.position.x
            close.dy += dot.position.y - other.position.y
        }
    }

    const AVOID_FACTOR = 0.05;
    dot.velocity.x += close.dx * AVOID_FACTOR;
    dot.velocity.y += close.dy * AVOID_FACTOR;
}

function alignment(dot) {
    const perceptionDist = 25;
    const totalVelocity = {
        x: 0,
        y: 0
    }

    let total = 0;
    for (let other of boids) {
        if (dot === other) continue;
        const dist = distance(dot.position, other.position);
        if (dist < perceptionDist) {
            totalVelocity.x += other.velocity.x;
            totalVelocity.y += other.velocity.y;
            total += 1;
        }
    }

    const MATCHING_FACTOR = 0.05;

    if (total > 0) {
        const xAvg = totalVelocity.x / total;
        const yAvg = totalVelocity.y / total;

        dot.velocity.x += (xAvg - dot.velocity.x) * MATCHING_FACTOR;
        dot.velocity.y += (yAvg - dot.velocity.y) * MATCHING_FACTOR;
    }
}

function cohesion(dot) {
    const perceptionDist = 25;
    const totalPosition = {
        x: 0,
        y: 0
    }

    let total = 0;
    for (let other of boids) {
        if (dot === other) continue;
        const dist = distance(dot.position, other.position);
        if (dist < perceptionDist) {
            totalPosition.x += other.position.x;
            totalPosition.y += other.position.y;
            total += 1;
        }
    }

    const CENTERING_FACTOR = 0.0005;

    if (total > 0) {
        const xAvg = totalPosition.x / total;
        const yAvg = totalPosition.y / total;

        dot.velocity.x += (xAvg - dot.position.x) * CENTERING_FACTOR;
        dot.velocity.y += (yAvg - dot.position.y) * CENTERING_FACTOR;
    }
}

function flock() {
    for (let dot of boids) {
        separation(dot);
        alignment(dot);
        cohesion(dot);
    }
}

function update() {
    for (let dot of boids) {
        clamp(dot.velocity, 1.2);
        addVectors(dot.position, dot.velocity);

        if (dot.position.x > WIDTH) {
            dot.position.x = 0;
        } else if (dot.position.x < 0) {
            dot.position.x = WIDTH;
        }
        if (dot.position.y > HEIGHT) {
            dot.position.y = 0;
        } else if (dot.position.y < 0) {
            dot.position.y = HEIGHT;
        }
    }
}

function drawDot({ x, y }) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 2 * Math.PI, 0);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let dot of boids) {
        drawDot(dot.position)
    }
}

function loop(time) {
    flock();
    update();
    draw();
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);