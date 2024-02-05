const ALL_WATER_COLORS = [
    "#0f5e9c",
    "#0980df",
    "#2389da",
]

function getWaterColor() {
    const index = Math.ceil(Math.random() * 10) % 3
    return ALL_WATER_COLORS[index]
}

function generateWater() {
    return {
        value: 1,
        color: getWaterColor(),
        type: 'water'
    }
}

function updateWater(currentMatrix, newMatrix, r, c) {
    const me = currentMatrix[r][c]
    if (r+1 < rowCount && newMatrix[r+1][c].value === 0) {
        newMatrix[r+1][c] = cell(me)
        newMatrix[r][c] = cell()
    } else {
        let left = 1
        let right = 1
        if (r+1 < rowCount) {
            right = c+1 < colCount ? newMatrix[r+1][c+1].value : 1
            left = c-1 >= 0 ? newMatrix[r+1][c-1].value : 1
        }
        
        if (right === 0 && left === 0) {
            if (Math.random() > 0.5) {
                right = 1
            } else {
                left = 1
            }
        }

        if (right === 0) {
            newMatrix[r+1][c+1] = cell(me)
            newMatrix[r][c] = cell()
        } else if (left === 0) {
            newMatrix[r+1][c-1] = cell(me)
            newMatrix[r][c] = cell()
        } else {
            right = c+1 < colCount ? newMatrix[r][c+1].value : 1
            left = c-1 >= 0 ? currentMatrix[r][c-1].value : 1

            if (right === 0 && left === 0) {
                if (Math.random() > 0.5) {
                    right = 1
                } else {
                    left = 1
                }
            }

            if (right === 0) {
                newMatrix[r][c+1] = cell(me)
                newMatrix[r][c] = cell()
            } else if (left === 0) {
                newMatrix[r][c-1] = cell(me)
                newMatrix[r][c] = cell()
            }
        }
    }
}