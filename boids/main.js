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
    const size = 200;
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

function alignment(dot) {
    const perceptionDist = 25;
    const steering = { x: 0, y: 0 }
    let total = 0;
    for (let otherDot of boids) {
        if (dot === otherDot) continue;
        const dist = distance(dot.position, otherDot.position);
        if (dist < perceptionDist) {
            addVectors(steering, otherDot.velocity);
            total += 1;
        }
    }

    divVector(steering, total)

    return steering;
}

function separation(dot) {
    const protectiveRange = 10;
    const steering = { x: 0, y: 0 }
    let total = 0;
    for (let otherDot of boids) {
        if (dot === otherDot) continue;
        const dist = distance(dot.position, otherDot.position);
        if (dist < protectiveRange) {
            addVectors(steering, multVector(subVectorsNew(dot.position, otherDot.position), 2));
            total += 1;
        }
    }
    divVector(steering, total)
    return steering;
}

function cohesion(dot) {
    const protectiveRange = 50;
    const steering = { x: 0, y: 0 }
    let total = 0;
    for (let otherDot of boids) {
        if (dot === otherDot) continue;
        const dist = distance(dot.position, otherDot.position);
        if (dist < protectiveRange) {
            addVectors(steering, otherDot.velocity);
            total += 1;
        }
    }
    divVector(steering, total);
    return steering;
}

function flock() {
    for (let dot of boids) {
        const align = multVector(alignment(dot), ALIGNMENT);
        const separate = multVector(separation(dot), SEPARATION);
        const coh = multVector(cohesion(dot), COHESION);

        addVectors(dot.accelaration, align);
        addVectors(dot.accelaration, separate);
        addVectors(dot.accelaration, coh);
    }
}

function update() {
    for (let dot of boids) {
        addVectors(dot.velocity, dot.accelaration);
        clamp(dot.velocity, 1.2);
        addVectors(dot.position, dot.velocity);

        dot.accelaration = {
            x: 0,
            y: 0
        }

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

    for (let dot of boids) {
        drawDot(dot.position)
    }

}

function loop(time) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    flock();
    update();
    draw();

    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);