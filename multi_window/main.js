window.addEventListener("beforeunload", function (e){
    window.sessionStorage.tabId = window.tabId;
});

window.addEventListener("load", function (){
    if (window.sessionStorage.tabId){
        window.tabId = window.sessionStorage.tabId;
        window.sessionStorage.removeItem("tabId");
    } else {
        window.tabId = `n${Math.floor(Math.random() * 1000000)}`
    }

    window.requestAnimationFrame(redraw)
});

const canvas = document.getElementById("canvas");
canvas.width = window.screen.availWidth;
canvas.height = window.screen.availHeight;
const ctx = canvas.getContext("2d");

function dot(x, y) {
    return {
        x: x,
        y: y,
        last: Date.now()
    }
}

function fetchAndUpdateLocalStorage(offsetX, offsetY) {
    // size of the actual webpage
    const sWidth = window.innerWidth;
    const sHeight = window.innerHeight;

    // out dot will always be in the middle of the screen
    const x = sWidth / 2;
    const y = sHeight / 2;

    // get the saved points
    let points = JSON.parse(localStorage.getItem("points")) ?? {}
    // add the new position to the points
    points[window.tabId] = dot(x+offsetX, y+offsetY)

    const now = Date.now()
    points = Object.fromEntries(Object.entries(points).filter(([_, value]) => now - value.last <= 500))

    // persist changes
    localStorage.setItem("points", JSON.stringify(points))

    return points
}

function redraw() {
    // clear the canvas for redrawing...

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // offset from the top left of the screen
    const offsetX = window.screenX;
    const offsetY = window.screenY;

    const points = fetchAndUpdateLocalStorage(offsetX, offsetY)

    // go over all points and copy them over to `pts` array
    const pts = []
    for (let k in points) {
        pts.push({
            x: points[k].x,
            y: points[k].y
        })
    }

    // find the convex hull of the polygon
    const outlinePoints = findConvexHullPoints(pts);

    ctx.beginPath()
    for (let i = 0; i < outlinePoints.length; i++) {
        let p = outlinePoints[i];
        if (i == 0) {
            ctx.moveTo(p.x-offsetX, p.y-offsetY)
        } else {
            ctx.lineTo(p.x-offsetX, p.y-offsetY)
        }

        // close the loop
        if (i == outlinePoints.length - 1) {
            p = outlinePoints[0]
            ctx.lineTo(p.x-offsetX, p.y-offsetY)
        }
    }
    
    ctx.strokeStyle = "black";
    ctx.stroke()

    // draw the dots
    for (let p of pts) {
        ctx.beginPath();
        ctx.arc(p.x-offsetX, p.y-offsetY, 10, 0, 2 * Math.PI);
        ctx.fillstyle = 'black'
        ctx.fill();
    }

    // redraw 
    window.requestAnimationFrame(redraw)
}

// reference: https://stackoverflow.com/a/3461533/9985287
function isToLeftOf(st, end, point) {
    return (end.x - st.x)*(point.y - st.y) - (end.y - st.y)*(point.x - st.x) > 0;
}

// reference: https://en.wikipedia.org/wiki/Gift_wrapping_algorithm
function findConvexHullPoints(allPoints) {
    let leftmost = allPoints[0]
    for (let p of allPoints) {
        if (p.x < leftmost.x) {
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