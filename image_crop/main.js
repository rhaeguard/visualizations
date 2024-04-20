const width = 1000;
const height = 1000;

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

redraw();

let drawing = false;

let start = null;
let end = null;

let current = null;

function getParams(end) {
    const [ax, ay] = start;
    const [bx, by] = end;
    const w = Math.abs(ax - bx)
    const h = Math.abs(ay - by)
    const x = ax <= bx ? ax : bx; 
    const y = ay <= by ? ay : by;
    return [w, h, [x, y]]
}

function crop() {
    const [w, h, top] = current;
    const [x, y] = top;


    // Use the intrinsic size of image in CSS pixels for the canvas element
    const image = new Image(60, 45); // Using optional size for image
    image.onload = function () {
        canvas.width = w;
        canvas.height = h;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(this, x, y, w, h, 0, 0, w, h)

        const imageTag = document.createElement("img");
        imageTag.src = ctx.canvas.toDataURL();
        imageTag.style.width = "100%";

        const column = document.querySelectorAll("#collage img").length % 2 == 0 ? 1 : 2;
        document.querySelector(`#collage > .column:nth-child(${column})`).prepend(imageTag)

        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(this, 0, 0);
    };
    image.setAttribute('crossorigin', 'anonymous');
    // Draw when image has loaded
    // Load an image of intrinsic size 300x227 in CSS pixels
    image.src = SOURCE_IMAGE;

}

document.getElementById("crop").addEventListener('click', (e) => {
    crop();
})

function redraw() {
    // Use the intrinsic size of image in CSS pixels for the canvas element
    const image = new Image(60, 45); // Using optional size for image
    image.onload = function () {
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(this, 0, 0);
        if (start != null) {            
            let copyEnd = end;
            if (end == null) {
                copyEnd = start
            }
            current = getParams(copyEnd);
            const [w, h, top] = current;
            const [x, y] = top
            ctx.rect(x, y, w, h);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    };
    // Draw when image has loaded
    // Load an image of intrinsic size 300x227 in CSS pixels
    image.src = SOURCE_IMAGE;
}

canvas.addEventListener("click", (e) => {
    // get the mouse position
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;

    drawing = !drawing;

    if (drawing) {
        start = [x, y]
        redraw();
    } else {
        start = null;
        end = null;
    }
});

canvas.addEventListener("mousemove", (e) => {
    // get the mouse position
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;
    if (drawing) {
        end = [x, y]
        redraw();
    }
});
