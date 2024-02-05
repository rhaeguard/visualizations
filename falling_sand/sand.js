function getSandColor() {
    const index = Math.ceil(Math.random() * 10) % 5
    return [
        "#f6d7b0",
        "#f2d2a9",
        "#eccca2",
        "#e7c496",
        "#e1bf92",
    ][index]
}

function generateSand() {
    return {
        value: 1,
        color: getSandColor(),
        type: 'sand'
    }
}

function updateSand(currentMatrix, newMatrix, r, c) {
    const me = newMatrix[r][c]

    const canMoveDown = (r, c) => {
        if (newMatrix[r][c].value === 0) {
            return true
        } else {
            if (newMatrix[r][c].type === 'water') {
                return true
            }
        }
        return false
    }

    if (r+1 < rowCount && canMoveDown(r+1, c)) {
        const t = newMatrix[r+1][c]
        const isWater = t.type === "water"
        newMatrix[r+1][c] = cell(me)
        newMatrix[r][c] = isWater ? t : cell()
    } else {
        let left = 1
        let right = 1
        if (r+1 < rowCount) {
            if (c+1 < colCount) {
                right = newMatrix[r+1][c+1].value
                if (canMoveDown(r+1, c+1)) {
                    right = 0
                }
            }

            if (c-1 >= 0) {
                left = newMatrix[r+1][c-1].value
                if (canMoveDown(r+1, c-1)) {
                    left = 0
                }
            }
        }
        
        if (right === 0 && left === 0) {
            if (Math.random() > 0.5) {
                right = 1
            } else {
                left = 1
            }
        }

        if (right === 0) {
            const t = newMatrix[r+1][c+1]
            const isWater = t.type === "water"
            newMatrix[r+1][c+1] = cell(me)
            newMatrix[r][c] = isWater ? t : cell()
        } else if (left === 0) {
            const t = newMatrix[r+1][c-1]
            const isWater = t.type === "water"
            newMatrix[r+1][c-1] = cell(me)
            newMatrix[r][c] = isWater ? t : cell()
        }
    }
}