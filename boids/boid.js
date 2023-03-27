function separation(boid, boids) {
    let closeness = Vectors.create();
    for (let other of boids) {
        if (boid === other) continue;
        const dist = distance(boid.position, other.position);

        if (dist < PARAMETERS.PROTECTED_RANGE) {
            closeness = Vectors.add(
                closeness,
                Vectors.sub(boid.position, other.position)
            );
        }
    }

    closeness = Vectors.multByScalar(closeness, PARAMETERS.AVOID_FACTOR);
    boid.velocity = Vectors.add(boid.velocity, closeness);
}

function alignment(boid, boids) {
    let velocity = Vectors.create();
    let total = 0;
    for (let other of boids) {
        if (boid === other) continue;
        const dist = distance(boid.position, other.position);
        if (dist < PARAMETERS.VISIBLE_RANGE) {
            velocity = Vectors.add(velocity, other.velocity);
            total++;
        }
    }

    if (total > 0) {
        velocity = Vectors.divByScalar(velocity, total);
        velocity = Vectors.sub(velocity, boid.velocity);
        velocity = Vectors.multByScalar(velocity, PARAMETERS.MATCHING_FACTOR);
        boid.velocity = Vectors.add(boid.velocity, velocity);
    }
}

function cohesion(boid, boids) {
    let position = Vectors.create()

    let total = 0;
    for (let other of boids) {
        if (boid === other) continue;
        const dist = distance(boid.position, other.position);
        if (dist < PARAMETERS.VISIBLE_RANGE) {
            position = Vectors.add(position, other.position);
            total += 1;
        }
    }

    if (total > 0) {
        position = Vectors.divByScalar(position, total);
        position = Vectors.sub(position, boid.position);
        position = Vectors.multByScalar(position, PARAMETERS.CENTERING_FACTOR);
        boid.velocity = Vectors.add(boid.velocity, position);
    }
}