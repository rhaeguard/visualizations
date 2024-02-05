function cell(data) {
    if (data != undefined) {
        return { ...data }
    }

    return {
        value: 0,
        color: '',
        type: 'none'
    }
}

function getColor(cell) {
    if (cell.type === "sand") {
        return cell.color
    } else if (cell.type === "water") {
        return getWaterColor()
    }
    return ""
}

function handleMaterialChange(ev) {
    generatedObject = ev.value
}