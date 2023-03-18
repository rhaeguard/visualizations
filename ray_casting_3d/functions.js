const point = (x, y) => ({
    x,
    y,
});

const line = (x1, y1, x2, y2) => ({
    p1: point(x1, y1),
    p2: point(x2, y2),
});

function intersects(L1, L2) {
    // Reference: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line_segment
    const x1 = L1.p1.x;
    const y1 = L1.p1.y;

    const x2 = L1.p2.x;
    const y2 = L1.p2.y;

    const x3 = L2.p1.x;
    const y3 = L2.p1.y;

    const x4 = L2.p2.x;
    const y4 = L2.p2.y;

    const t =
        ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    const u =
        ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return point(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
    }

    return null;
}

function distance(p1, p2) {
    return Math.sqrt(
        (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
    );
}

function getLineByAngle(x, y, angle, WIDTH) {
    const k = 2 * WIDTH * Math.cos(angle);
    const z = 2 * WIDTH * Math.sin(angle);

    const a = x + k;
    const b = y + z;

    return line(x, y, a, b);
}