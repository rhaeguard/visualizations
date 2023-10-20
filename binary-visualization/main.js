const canvas = document.getElementById("canvas")
const statusSpan = document.getElementById("status")

const createFrequencyMap = (array) => {
    statusSpan.innerText = "creating frequency map..."
    let result = new Array(256);

    for (let i = 0; i < 256; i++) {
        result[i] = new Array(256).fill(0);
    }

    let max = 0

    for (let i = 0; i < array.length - 1; i++) {
        const x = array[i]
        const y = array[i + 1]
        result[y][x] += 1
        max = Math.max(max, result[y][x])
    }

    for (let y = 0; y < 256; y++) {
        for (let x = 0; x < 256; x++) {
            result[y][x] = (result[y][x] / max) * 256
        }
    }

    statusSpan.innerText = "creating frequency map...done!"

    return result
}

const drawFrequencyMap = (fmap) => {
    statusSpan.innerText = "visualizing..."

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, 512, 512)

    for (let y = 0; y < 256; y++) {
        for (let x = 0; x < 256; x++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${fmap[y][x]})`
            ctx.fillRect(x*2, y*2, 2, 2) // just to scale the image up
        }
    }

    statusSpan.innerText = "ready!"
} 

document.getElementById("file-upload")
    .addEventListener('change', async (event) => {
        const buff = await event.target.files[0].arrayBuffer()
        const arr = new Uint8Array(buff)
        const fmap = createFrequencyMap(arr)
        drawFrequencyMap(fmap)
    });