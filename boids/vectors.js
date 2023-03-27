const Vectors = {
    create: function () {
        return {
            x: 0,
            y: 0
        }
    },
    add: function (v1, v2) {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y
        }
    },
    sub: function (v1, v2) {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y
        }
    },
    multByScalar: function (v, scalar) {
        return {
            x: v.x * scalar,
            y: v.y * scalar
        }
    },
    divByScalar: function (v, scalar) {
        if (scalar === 0) return;
        return {
            x: v.x /= scalar,
            y: v.y /= scalar
        }
    },
    limit: function (v, limit) {
        return {
            x: v.x > 0 ? Math.min(v.x, limit) : Math.max(v.x, -limit),
            y: v.y > 0 ? Math.min(v.y, limit) : Math.max(v.y, -limit)
        }
    }
}