const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

redraw();

setInterval(redraw, 100);

function redraw() {
    // Use the intrinsic size of image in CSS pixels for the canvas element
    const image = new Image(60, 45); // Using optional size for image
    image.onload = function () {
        canvas.width = 1536;
        canvas.height = 707;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // ctx.drawImage(this, 0, 0);
        
        const sx = window.screenX;
        const sy = window.screenY;
        const sWidth = window.innerWidth;
        const sHeight = window.innerHeight;

        ctx.drawImage(this, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)
    };
    // Draw when image has loaded
    // Load an image of intrinsic size 300x227 in CSS pixels
    image.src =
        "https://images.unsplash.com/photo-1682686581663-179efad3cd2f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=neom-I5j46lqAo-o-unsplash.jpg&w=1920";
}