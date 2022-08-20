// Reference: https://www.youtube.com/watch?v=qhbuKbxJsk8
function drawTimesTable(N, times) {
    const WIDTH = 800;

    const canvas = document.getElementById("canvas");
    canvas.height = canvas.width = WIDTH;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const R = 350;
    const HALF_WIDTH = Math.floor(WIDTH / 2);

    ctx.beginPath();
    ctx.arc(HALF_WIDTH, HALF_WIDTH, R, 0, Math.PI * 2, false);
    ctx.stroke();

    function generateCoords(context) {
        const map = new Map();

        const degIncrement = Math.floor(360 / N);

        for (let deg = 0; deg <= 360; deg += degIncrement) {
            const x = R * Math.sin((deg * Math.PI) / 180) + HALF_WIDTH;
            const y = R * Math.cos((deg * Math.PI) / 180) + HALF_WIDTH;

            context.beginPath();
            context.arc(x, y, 10, Math.PI * 2, 0, false);
            context.stroke();

            map.set(Math.floor(deg / degIncrement), [x, y]);
        }

        return map;
    }

    const pos = generateCoords(ctx);

    for (const [number, coord] of pos.entries()) {
        const [x, y] = coord;

        const target = (number * times) % N;

        const [xx, yy] = pos.get(target);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xx, yy);
        ctx.stroke();
    }
}

function draw() {
    const till = parseInt(document.getElementById("till").value)
    const times = parseInt(document.getElementById("times").value)
    drawTimesTable(till, times)
}

document.getElementById("times").addEventListener('change', (e) => {
    draw();
})

document.getElementById("till").addEventListener('change', (e) => {
    draw();
})

draw();