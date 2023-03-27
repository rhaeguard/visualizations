function getValueOf(id) {
    return parseFloat(document.getElementById(id).value);
}

const PARAMETERS = {
    AVOID_FACTOR: getValueOf("avoid_factor"),
    MATCHING_FACTOR: getValueOf("matching_factor"),
    CENTERING_FACTOR: getValueOf("centering_factor"),
    VISIBLE_RANGE: 40,
    PROTECTED_RANGE: 8,
    MAX_VELOCITY: 1.5,
    TURN_FACTOR: 0.2,
}

const boids = generateBoids(100);

function registerListeners() {
    const ids = [
        "avoid_factor",
        "matching_factor",
        "centering_factor"
    ];

    for (let id of ids) {
        document.getElementById(id).addEventListener("change", (ev) => {
            const value = parseFloat(ev.target.value);
            PARAMETERS[id.toUpperCase()] = value;
        })
    }

    document.getElementById("total_boids").addEventListener("change", (ev) => {
        const count = parseInt(ev.target.value);

        if (count >= boids.length) {
            const diff = count - boids.length;
            generateBoids(diff).forEach(boid => boids.push(boid));
        } else {
            const diff = boids.length - count;
            boids.splice(boids.length - diff, diff);
        }
    })
}

registerListeners();