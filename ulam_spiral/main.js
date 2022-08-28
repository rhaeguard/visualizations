const WIDTH = 1000;
const HEIGHT = 1000;
const canvas = document.getElementById("canvas");
canvas.height = HEIGHT;
canvas.width = WIDTH;

const ctx = canvas.getContext("2d");

// set background
ctx.fillStyle = "#05CFF8";
ctx.fillRect(0, 0, WIDTH, HEIGHT);

function isPrime(n) {
    if (n <= 1) return false;
    for (let i = 2; i < n; i++) if (n % i == 0) return false;
    return true;
}

function* allInstructions() {
    let current = 1;
    let directions = ["right", "up", "left", "down"];
    let currentDir = 0;

    const nextValue = () => [current++, directions[currentDir]];

    for (let i = 1; i <= 50; i++) {
        currentDir = currentDir % 4; // 4 directions
        for (let j = 1; j <= i; j++) {
            yield nextValue();
        }
        currentDir++;
        for (let j = 1; j <= i; j++) {
            yield nextValue();
        }
        currentDir++;
    }
}

function drawCircle(x, y, color = "white") {
    // default radius is 10 for all circles
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}

// create initial (x, y) position which is the center of the canvas
let x = WIDTH / 2;
let y = HEIGHT / 2;
// the step between two points
const step = WIDTH / 40;

// the circles representing the prime numbers
const circles = [];

// the circle that has been selected, i.e. it is red
let selectedCircle = {
    x: x + step,
    y: y,
    r: 10,
    val: 2,
};

canvas.addEventListener("click", (e) => {
    // get the mouse position
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;

    // for each circle in the canvas
    for (let circle of circles) {
        // check if mouse is clicking on it
        // basic idea: if the (x, y) is inside the circle, 
        // then it is clicking on it
        const dist = Math.sqrt(
            (circle.x - x) * (circle.x - x) + (circle.y - y) * (circle.y - y)
        );
        
        // if the distance to (x, y) is less than the radius, 
        // then the mouse is on the circle
        if (dist <= circle.r) {
            // make the circle red
            drawCircle(circle.x, circle.y, "red");
            // put its value in the HTML, showing
            // which number has been selected
            document.getElementById("prime").innerText = circle.val;

            // make the previously selected circle white
            drawCircle(selectedCircle.x, selectedCircle.y);
            // current circle is now the selected circle
            selectedCircle = circle;
            // do not proceed any further
            break;
        }
    }
});

function drawUlamSpiral() {
    for (const [value, dir] of allInstructions()) {
        if (isPrime(value)) {
            drawCircle(x, y);

            circles.push({
                x: x,
                y: y,
                r: 10,
                val: value,
            });
        }

        ctx.beginPath();
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
        ctx.strokeStyle = "white";
        ctx.stroke();
    }
}

drawUlamSpiral();
drawCircle(selectedCircle.x, selectedCircle.y, "red");
