// default canvas dimensions
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

// set up the canvas
const canvas = document.getElementById("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext("2d");

// load the image
const img = new Image();
img.crossOrigin = "anonymous";
// Markus Trienke, CC BY-SA 2.0 <https://creativecommons.org/licenses/by-sa/2.0>, via Wikimedia Commons
img.src =
    "https://upload.wikimedia.org/wikipedia/commons/d/d5/Greenland_467_%2835130903436%29_%28cropped%29.jpg";

img.onload = () => {
    original();
};

// listen to the changes made to the input field
document.getElementById("image_source").addEventListener("change", (event) => {
    img.src = event.target.value;
});

/**
 * The pixel buffer is a one-dimension unsigned integer array.
 * We need to convert the (x, y) position to a singular index on that array.
 * In addition to that, each 4 adjacent entry represents the RGBA value for a single pixel (4 array elements per pixel)
 * @returns the index on the flat array
 */
const cartesianToFlat = (x, y) => 4 * (x + CANVAS_WIDTH * y);

/**
 * Given the indices, finds the weighted average for each color.
 * Returns a Uint8Array of RGB
 */
const findNewRGBValue = (pixelBuffer, ...indices) => {
    let r = 0;
    let g = 0;
    let b = 0;

    let weightSum = 0;

    for (let i = 0; i < indices.length; i++) {
        weightSum += indices[i].weight;
        r += pixelBuffer[indices[i].pos + 0] * indices[i].weight;
        g += pixelBuffer[indices[i].pos + 1] * indices[i].weight;
        b += pixelBuffer[indices[i].pos + 2] * indices[i].weight;
    }

    r = Math.round(r / weightSum);
    g = Math.round(g / weightSum);
    b = Math.round(b / weightSum);

    return new Uint8Array([r, g, b]);
};

// Reference: https://en.wikipedia.org/wiki/Box_blur
const boxBlur = () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const newImageData = ctx.createImageData(imageData);

    const start = performance.now();

    const KERNEL_RADIUS = 1;

    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const fitsKernel = x >= KERNEL_RADIUS &&
                x < canvas.width - KERNEL_RADIUS && y >= KERNEL_RADIUS &&
                y < canvas.height - KERNEL_RADIUS;

            let r, g, b;
            const pos = cartesianToFlat(x, y);

            if (fitsKernel) {
                const indices = [];
                // takes all the relevant indices into account
                for (let xx = -KERNEL_RADIUS; xx <= KERNEL_RADIUS; xx++) {
                    for (let yy = -KERNEL_RADIUS; yy <= KERNEL_RADIUS; yy++) {
                        indices.push(
                            {
                                pos: cartesianToFlat(x + xx, y + yy),
                                weight: 1,
                            },
                        );
                    }
                }

                [r, g, b] = findNewRGBValue(data, ...indices);
            } else {
                r = data[pos];
                g = data[pos + 1];
                b = data[pos + 2];
            }

            newImageData.data[pos] = r;
            newImageData.data[pos + 1] = g;
            newImageData.data[pos + 2] = b;
            newImageData.data[pos + 3] = data[pos + 3];
        }
    }
    const total = performance.now() - start;

    console.log("BoxBlur:", total, "ms");
    ctx.putImageData(newImageData, 0, 0);
};

// https://en.wikipedia.org/wiki/Gaussian_blur
const gaussian = () => {
    // the gaussian function
    const gaussianWeight = (x, y) => {
        const SIGMA = 1.85089642; // no real reason for this
        const stDevSq = Math.pow(SIGMA, 2);

        const A = 1 / (2 * Math.PI * stDevSq);
        const B = (x * x + y * y) / (2 * stDevSq);

        return A * Math.pow(Math.E, -B);
    };

    const KERNEL_RADIUS = 2;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const newImageData = ctx.createImageData(imageData);

    const start = performance.now();
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const fitsKernel = x >= KERNEL_RADIUS &&
                x < canvas.width - KERNEL_RADIUS && y >= KERNEL_RADIUS &&
                y < canvas.height - KERNEL_RADIUS;

            let r, g, b;
            const pos = cartesianToFlat(x, y);

            if (fitsKernel) {
                const indices = [];
                // this ensures that the currently processed pixel is centered at position (0, 0)
                // and the neighbors are also adjusted appropriately
                for (let xx = -KERNEL_RADIUS; xx <= KERNEL_RADIUS; xx++) {
                    for (let yy = -KERNEL_RADIUS; yy <= KERNEL_RADIUS; yy++) {
                        indices.push(
                            {
                                pos: cartesianToFlat(x + xx, y + yy),
                                weight: gaussianWeight(xx, yy),
                            },
                        );
                    }
                }

                [r, g, b] = findNewRGBValue(data, ...indices);
            } else {
                r = data[pos];
                g = data[pos + 1];
                b = data[pos + 2];
            }

            newImageData.data[pos] = r;
            newImageData.data[pos + 1] = g;
            newImageData.data[pos + 2] = b;
            newImageData.data[pos + 3] = data[pos + 3];
        }
    }
    const total = performance.now() - start;

    console.log("GaussianBlur:", total, "ms");
    ctx.putImageData(newImageData, 0, 0);
};

const original = () => {
    const adjustedCanvasHeight = (img.naturalHeight / img.naturalWidth) *
        CANVAS_WIDTH;
    canvas.height = adjustedCanvasHeight;
    ctx.drawImage(
        img,
        0,
        0,
        img.naturalWidth,
        img.naturalHeight,
        0,
        0,
        CANVAS_WIDTH,
        adjustedCanvasHeight,
    );
};
