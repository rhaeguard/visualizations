const WIDTH = 640;
const HEIGHT = 480;

const DENSITY = `$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^\`'. `;

const canvas = document.getElementById('canvas');
canvas.style.display = 'none';
const ctx = canvas.getContext('2d');

function onload() {
    const imgUrl = "./image.jpg";

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imgUrl;
    img.onload = function () {
        // Use the intrinsic size of image in CSS pixels for the canvas element
        const w = Math.round(this.naturalWidth / 3);
        const h = Math.round(this.naturalHeight / 3);

        canvas.width = w;
        canvas.height = h;

        // To use the custom size we'll have to specify the scale parameters
        // using the element's width and height properties - lets draw one
        // on top in the corner:
        ctx.drawImage(this, 0, 0, w, h);
        this.style.display = 'none';

        const start = performance.now();
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
}

onload();