const HEIGHT = 500;
const WIDTH = 1000;

function randBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function randomSign() {
    return Math.random() > 0.5 ? 1 : -1;
}

function generateBoid() {
    return {
        position: { x: randBetween(0, WIDTH), y: randBetween(0, HEIGHT) },
        velocity: { x: randomSign() * randBetween(0, 1), y: randomSign() * randBetween(0, 1) },
        accelaration: { x: randomSign() * 0.001, y: randomSign() * 0.001 },
    }
}

function generateBoids(size) {
    return [...new Array(size)]
        .map(_ => generateBoid())
}

function distance(p1, p2) {
    return Math.sqrt(
        (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
    );
}
