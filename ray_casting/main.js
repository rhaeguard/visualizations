const point = (x, y) => ({
    x,
    y,
});

const line = (x1, y1, x2, y2) => ({
    p1: point(x1, y1),
    p2: point(x2, y2),
});

const rectLines = (x, y, w, h) => {
    const [x1, y1] = [x, y];
    const [x2, y2] = [x + w, y];
    const [x3, y3] = [x, y + h];
    const [x4, y4] = [x + w, y + h];

    return [
        line(x1, y1, x2, y2),
        line(x1, y1, x3, y3),
        line(x2, y2, x4, y4),
        line(x3, y3, x4, y4),
    ];
};

const HEIGHT = 574;
const WIDTH = 1024;

const canvas = document.getElementById("canvas");
canvas.height = HEIGHT;
canvas.width = WIDTH;

const ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0, 0, WIDTH, HEIGHT);

const boundaries = [
    line(0, 0, WIDTH, 0),
    line(0, 0, 0, HEIGHT),
    line(0, HEIGHT, WIDTH, HEIGHT),
    line(WIDTH, 0, WIDTH, HEIGHT),
];

const lines = [
    ...boundaries,
    line(555, 222, 200, 400),
    ...rectLines(400, 400, 150, 90),
    ...rectLines(900, 100, 100, 400),
    ...rectLines(400, 50, 250, 40),
    ...[
        line(50, 50, 350, 70),
        line(50, 50, 200, 200),
        line(200, 200, 350, 70)
    ]
];

function getAllPointsFromLines() {
    return new Set(lines.map((l) => [l.p1, l.p2]).flat());
}

function getCorners() {
    const seen = new Set();

    const all = new Set();
    for (let { p1, p2 } of lines.filter((l) => !boundaries.includes(l))) {
        if (!seen.has(JSON.stringify(p1))) {
            all.add(p1);
            seen.add(JSON.stringify(p1));
        }

        if (!seen.has(JSON.stringify(p2))) {
            all.add(p2);
            seen.add(JSON.stringify(p2));
        }
    }

    return all;
}

function distance(p1, p2) {
    return Math.sqrt(
        (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
    );
}

function intersects(L1, L2) {
    // Reference: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line_segment
    const x1 = L1.p1.x;
    const y1 = L1.p1.y;

    const x2 = L1.p2.x;
    const y2 = L1.p2.y;

    const x3 = L2.p1.x;
    const y3 = L2.p1.y;

    const x4 = L2.p2.x;
    const y4 = L2.p2.y;

    const t =
        ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    const u =
        ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return point(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
    }

    return null;
}

function findIntersectingPoints(line) {
    const points = [];
    for (let other of lines) {
        const r = intersects(line, other);
        if (r) {
            points.push(r);
        }
    }

    return points;
}

function renderAllLines() {
    for (let line of lines) {
        const { p1, p2 } = line;

        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
}

function drawDot(x, y, color = "red") {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, 5, 2 * Math.PI, 0, false);
    ctx.fill();
}

function getAngle(x, y, ptn) {
    const dx = ptn.x - x;
    const dy = ptn.y - y;
    return Math.atan2(dy, dx);
}

function sortByAngle(x, y, pts) {
    pts.sort((p1, p2) => {
        return getAngle(x, y, p1) - getAngle(x, y, p2);
    });
}

renderAllLines();

function drawTriangle([a, b, c]) {
    ctx.fillStyle = "rgba(255, 255, 255, 1)";

    ctx.beginPath();

    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);

    ctx.closePath();

    ctx.fill();
}

canvas.addEventListener("mousemove", (e) => {
    // get the mouse position
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x, y, 5, 2 * Math.PI, 0, false);
    ctx.fill();

    renderAllLines();

    const rays = [];
    const corners = getCorners();

    for (let { x: a, y: b } of getAllPointsFromLines()) {
        rays.push(line(x, y, a, b));
    }

    function getLineByAngle(x, y, angle) {
        const k = 2 * WIDTH * Math.cos(angle);
        const z = 2 * WIDTH * Math.sin(angle);

        const a = x + k;
        const b = y + z;

        return line(x, y, a, b);
    }

    for (let corner of corners) {
        let angle = getAngle(x, y, corner);
        rays.push(getLineByAngle(x, y, angle));
        rays.push(getLineByAngle(x, y, angle + 0.0001));
        rays.push(getLineByAngle(x, y, angle - 0.0001));
    }

    // drawing each dot and line
    const dots = [];
    rays.forEach((aLine) => {
        const pts = findIntersectingPoints(aLine);

        pts.sort((a, b) => {
            return distance(point(x, y), a) - distance(point(x, y), b);
        });

        if (pts.length > 0) {
            let ptn = pts[0];
            dots.push(ptn);
            const { x: _x, y: _y } = ptn;

            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(_x, _y);
            ctx.stroke();
        }
    });

    // triangle drawing...
    sortByAngle(x, y, dots);
    const top = point(x, y);
    dots.push(dots[0]);
    for (let i = 0; i < dots.length - 1; i++) {
        const triangle = [top, dots[i], dots[i + 1]];
        drawTriangle(triangle);
    }
});
