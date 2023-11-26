const windowName = `n${Math.floor(Math.random() * 100)}`

const canvas = document.getElementById("canvas");
canvas.width = 1536;
canvas.height = 707;
// canvas.width = window.screen.availWidth;
// canvas.height = window.screen.availHeight;
const ctx = canvas.getContext("2d");

window.requestAnimationFrame(redraw)

function redraw() {
    // clear the canvas for redrawing...

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // offset from the top left of the screen
    const offsetX = window.screenX;
    const offsetY = window.screenY;
    // size of the actual webpage
    const sWidth = window.innerWidth;
    const sHeight = window.innerHeight;

    // out dot will always be in the middle of the screen
    const x = sWidth / 2;
    const y = sHeight / 2;

    // get the saved points
    let points = JSON.parse(localStorage.getItem("points"))
    // add the new position to the points
    if (points) {
        points[windowName] = [x+offsetX, y+offsetY]
    } else {
        points = {
            [windowName]: [x+offsetX, y+offsetY]
        }
    }
    // persist changes
    localStorage.setItem("points", JSON.stringify(points))

    // go over all points and copy them over to `pts` array
    const pts = []
    for (let k in points) {
        pts.push(points[k])
    }

    // find the convex hull of the polygon
    const outlinePoints = findConvexHullPoints(pts);

    ctx.beginPath()
    for (let i = 0; i < outlinePoints.length; i++) {
        let p = outlinePoints[i];
        if (i == 0) {
            ctx.moveTo(p[0]-offsetX, p[1]-offsetY)
        } else {
            ctx.lineTo(p[0]-offsetX, p[1]-offsetY)
        }

        // close the loop
        if (i == outlinePoints.length - 1) {
            p = outlinePoints[0]
            ctx.lineTo(p[0]-offsetX, p[1]-offsetY)
        }
    }
    
    ctx.strokeStyle = "black";
    ctx.stroke()

    // draw the dots
    for (let p of pts) {
        ctx.beginPath();
        ctx.arc(p[0]-offsetX, p[1]-offsetY, 10, 0, 2 * Math.PI);
        ctx.fillstyle = 'black'
        ctx.fill();
    }

    // redraw 
    window.requestAnimationFrame(redraw)
}

// reference: https://stackoverflow.com/a/3461533/9985287
function isToLeftOf(st, end, point) {
    return (end[0] - st[0])*(point[1] - st[1]) - (end[1] - st[1])*(point[0] - st[0]) > 0;
}

// reference: https://en.wikipedia.org/wiki/Gift_wrapping_algorithm
function findConvexHullPoints(allPoints) {
    let leftmost = allPoints[0]
    for (let p of allPoints) {
        if (p[0] < leftmost[0]) {
            leftmost = p
        }
    }

    let pointOnHull = leftmost

    let i = 0
    const convexHullPoints = []
    while (true) {
        convexHullPoints.push(pointOnHull)

        let endpoint = allPoints[0]

        for (let j=0;j<allPoints.length;j++) {
            let condition = endpoint == pointOnHull
            condition = condition || isToLeftOf(convexHullPoints[i], endpoint, allPoints[j])
            if (condition) {
                endpoint = allPoints[j]
            }
        }

        i += 1
        pointOnHull = endpoint

        if (endpoint == convexHullPoints[0] || i > allPoints.length) {
            break
        }
    };

    return convexHullPoints;
}