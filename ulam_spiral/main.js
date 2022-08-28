const WIDTH = 1000;
const HEIGHT = 1000;
const canvas = document.getElementById("canvas");
canvas.height = HEIGHT;
canvas.width = WIDTH;

const ctx = canvas.getContext("2d");

ctx.fillStyle = "#05CFF8";
ctx.fillRect(0, 0, WIDTH, HEIGHT);

ctx.fillStyle = "white";

class Generator {
    constructor() {
        this.current = 1;
        this.directions = ["right", "up", "left", "down"];
        this.currentDir = 0;
    }

    *next() {
        for (let i = 1; i <= 50; i++) {
            this.currentDir = this.currentDir % 4; // 4 directions
            for (let j = 1; j <= i; j++) {
                yield this.getNextValue();
            }
            this.currentDir++;
            for (let j = 1; j <= i; j++) {
                yield this.getNextValue();
            }
            this.currentDir++;
        }

        console.log(this.current)
    }

    getNextValue() {
        return [this.current++, this.directions[this.currentDir]];
    }
}

let x = WIDTH / 2;
let y = HEIGHT / 2;
const step = WIDTH / 40;

const circles = [];
let selectedCircle = {
    x: x + step,
    y: y,
    r: 10,
    val: 2,
}

canvas.addEventListener('click', (e) => {
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;

    for (let circle of circles) {
        const dist = Math.sqrt(
            (circle.x - x)*(circle.x - x) + (circle.y - y)*(circle.y - y)
        );

        if (dist <= circle.r) {
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, 10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'red';
            ctx.fill();
            document.getElementById('prime').innerText = circle.val;

            ctx.beginPath();
            ctx.arc(selectedCircle.x, selectedCircle.y, 10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'white';
            ctx.fill();

            selectedCircle = circle;
            break;
        }
    }
})


for (let vv of new Generator().next()) {
    const [value, dir] = vv;

    if (isPrime(value)) {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.fill();

        circles.push({
            x: x,
            y: y,
            r: 10,
            val: value,
        })
    }
    
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.moveTo(x, y);
    if (dir === "right") {
        x += step;
    } else if (dir === "up") {
        y -= step;
    } else if (dir === "left") {
        x -= step;
    } else if (dir === "down") {
        y += step;
    }
    ctx.lineTo(x, y);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

function isPrime(n) {
    if (n <= 1) return false;
    for (let i = 2; i < n; i++) if (n % i == 0) return false;
    return true;
}
