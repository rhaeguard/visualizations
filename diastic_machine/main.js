function getWords(v) {
    return v.replace(/[^A-Za-z0-9-']/gi, ' ').split(" ")
}

const words = getWords(text);

function genLine(seed) {
    let startFrom = 0;
    const pieces = []
    for (let i = 0; i < seed.length; i++) {
        for (let j = startFrom; j < words.length; j++) {
            const word = words[j];
            if (word.charAt(i) == seed.charAt(i)) {
                pieces.push(word)
                startFrom = j + 1;
                break;
            }
        }
    }
    return pieces.join(" ");
}

function appendLine(line) {
    const div = document.getElementById("poem");
    const p = document.createElement("p")
    p.innerText = line;
    div.appendChild(p);
}

function generatePoem(seed) {
    if (seed.trim().length === 0) return;

    document.getElementById("poem").innerHTML = "";
    seed.split(" ").map(genLine).forEach(x => appendLine(x))
}

document.getElementById("textInput").addEventListener('keydown', function (e) {
    generatePoem(e.target.value);
})
