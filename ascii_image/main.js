const WIDTH = 640;
const HEIGHT = 480;

const DENSITY = `$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^\`'. `;

const canvas = document.getElementById('canvas');
canvas.style.display = 'none';
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext('2d');

function drawAscii(w, h) {
    document.getElementById("result").innerText = "";
    for (let y = 0; y < h; y += 6) {
        let line = "";
        for (let x = 0; x < w; x += 3) {
            const pixel = ctx.getImageData(x, y, 1, 1);
            const [r, g, b, a] = pixel.data;
            const grey = Math.ceil((r + g + b) / 3);

            const pos = Math.floor(grey / 3.8);
            const ch = DENSITY.charAt(pos);
            line += ch;
        }
        document.getElementById("result").innerText += line + "\n";
    }
}

function cameraStuff() {
    const player = document.getElementById('player');
    player.width = WIDTH;
    player.height = HEIGHT;
    player.style.display = "none";


    const constraints = {
        video: true,
    };

    const intervalHandle = setInterval(() => {
        ctx.drawImage(player, 0, 0, WIDTH / 1.5, HEIGHT / 1.5);
        drawAscii(WIDTH / 1.5, HEIGHT / 1.5);
    }, 100);

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        // Attach the video stream to the video element and autoplay.
        player.srcObject = stream;
    });
}

cameraStuff();