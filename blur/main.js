const img = new Image();
img.crossOrigin = "anonymous"
img.src = "./Greenland_467_(35130903436)_(cropped).jpg"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

img.onload = () => {
    ctx.drawImage(img, 0, 0, 3772, 3772, 0, 0, 800, 800)
};

const grayscale = () => {
    ctx.drawImage(img, 0, 0, 3772, 3772, 0, 0, 800, 800)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);
};

const cartesianToFlat = (x, y) => 4 * (y + 800 * x)

const sumUint8ClampedArray = (...arrays) => {
    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = 0; i < arrays.length; i++) {
        r += arrays[i][0]
        g += arrays[i][1]
        b += arrays[i][2]
    }

    r = Math.round(r / 9)
    g = Math.round(g / 9)
    b = Math.round(b / 9)

    return new Uint8Array([r, g, b])
}

const boxBlur = () => {
    ctx.drawImage(img, 0, 0, 3772, 3772, 0, 0, 800, 800)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let x = 1; x < 800-1; x++) {
        for (let y = 1; y < 800-1; y++) {
            const left = data.slice(cartesianToFlat(x - 1, y), cartesianToFlat(x - 1, y) + 3)
            const right = data.slice(cartesianToFlat(x + 1, y), cartesianToFlat(x + 1, y) + 3)
            const up = data.slice(cartesianToFlat(x, y - 1), cartesianToFlat(x, y - 1) + 3)
            const down = data.slice(cartesianToFlat(x, y + 1), cartesianToFlat(x, y + 1) + 3)

            const tl = data.slice(cartesianToFlat(x - 1, y - 1), cartesianToFlat(x - 1, y - 1) + 3)
            const tr = data.slice(cartesianToFlat(x + 1, y - 1), cartesianToFlat(x + 1, y - 1) + 3)
            const bl = data.slice(cartesianToFlat(x - 1, y + 1), cartesianToFlat(x - 1, y + 1) + 3)
            const br = data.slice(cartesianToFlat(x + 1, y + 1), cartesianToFlat(x + 1, y + 1) + 3)

            const current = data.slice(cartesianToFlat(x, y), cartesianToFlat(x, y) + 3)

            const [r, g, b] = sumUint8ClampedArray(
                left, right, up, down, current, tl, tr, bl, br
            )

            const pos = cartesianToFlat(x, y)
            data[pos] = r
            data[pos+1] = g
            data[pos+2] = b
        }
    }
    ctx.putImageData(imageData, 0, 0);
}