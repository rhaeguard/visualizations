/* Canvas parameters and setup */
const WIDTH = 1000;
const HEIGHT = 400;

const canvas = document.getElementById("canvas");
canvas.height = HEIGHT;
canvas.width = WIDTH;

/* get the context */
const ctx = canvas.getContext("2d");

/* array we want to sort */
const arr = [4, 2, 15, 9, 1, 3, 12, 8, 5, 7, 4, 2];
/* max element of the array so that we can normalize the values for drawing */
const maxElement = Math.max(...arr);

/* values for the visualization */
const len = arr.length;
const gap = 40;
const columnWidth = (WIDTH - 50) / len - gap;
const columnMaxHeight = HEIGHT - 100;

/* draw a single column */
function drawColElement(value, pos, number) {
    const x = (pos + 1) * gap + pos * columnWidth;
    const y = HEIGHT - value;

    ctx.fillStyle = "white";
    ctx.fillRect(x, y, columnWidth, value);

    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.fillText(number, x + 15, y - 20, columnWidth);
}

function drawWholeArray(array) {
    for (let i = 0; i < array.length; i++) {
        const value = (array[i] / maxElement) * columnMaxHeight;
        drawColElement(value, i, array[i]);
    }
}

/* the quicksort algorithm that returns every variation of the array till the last sorted one */
function quicksort(inputArray) {
    const phases = [];

    function quick(arr, start, end) {
        if (start >= end) return;

        let ix = partition(arr, start, end);

        quick(arr, start, ix - 1);
        quick(arr, ix + 1, end);
    }

    function swapPush(arr, a, b) {
        const t = arr[a];
        arr[a] = arr[b];
        arr[b] = t;
        phases.push([...arr]);
    }

    function partition(arr, start, end) {
        const pivot = arr[end];
        let pivotIx = start;
        for (let i = start; i < end; i++) {
            if (arr[i] < pivot) {
                swapPush(arr, i, pivotIx);
                pivotIx++;
            }
        }
        swapPush(arr, end, pivotIx);
        return pivotIx;
    }

    quick(inputArray, 0, inputArray.length - 1);
    return phases;
}

// sort the array
const phases = quicksort([...arr]);
/* draw original array */
drawWholeArray(arr);
document.getElementById(
    "array"
).innerText = `Original array: ${arr.toString()}`;
/* draw the phases */
setInterval(() => {
    if (phases.length > 0) {
        // "clear" everything
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        // draw the background "black"
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        drawWholeArray(phases.shift()); // arr.shift() pops the first element in the array, and returns it
    }
}, 200);
