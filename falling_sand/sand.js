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
    if (newMatrix[r+1][c].value === 0 || Math.random > 0.2) {
        newMatrix[r+1][c] = cell(me)
        newMatrix[r][c] = cell()
    } else {
        let right = c+1 < colCount ? newMatrix[r+1][c+1].value : 1
        let left = c-1 >= 0 ? newMatrix[r+1][c-1].value : 1
        
        
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
        }
    }
}