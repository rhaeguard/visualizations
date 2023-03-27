const canvas = document.getElementById("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext("2d")

function flock() {
    for (let boid of boids) {
        separation(boid, boids);
        alignment(boid, boids);
        cohesion(boid, boids);
    }
}

function handleTurns(dot) {
    if (dot.position.x > WIDTH) {
        dot.velocity.x -= PARAMETERS.TURN_FACTOR;
    }

    if (dot.position.x < 0) {
        dot.velocity.x += PARAMETERS.TURN_FACTOR;
    }

    if (dot.position.y > HEIGHT) {
        dot.velocity.y -= PARAMETERS.TURN_FACTOR;
    }

    if (dot.position.y < 0) {
        dot.velocity.y += PARAMETERS.TURN_FACTOR;
    }
}

function update() {
    for (let boid of boids) {
        boid.velocity = Vectors.limit(boid.velocity, PARAMETERS.MAX_VELOCITY);
        boid.position = Vectors.add(boid.position, boid.velocity);
        handleTurns(boid);
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

    for (let boid of boids) {
        drawDot(boid.position)
    }
}

function loop(time) {
    flock();
    update();
    draw();
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);