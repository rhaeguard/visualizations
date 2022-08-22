// Reference: https://www.chegg.com/homework-help/questions-and-answers/diastic-machine-poetry-algorithm-create-jacskon-max-big-picture-file-text-story-something--q37755137
function getWords(v) {
    return v.replace(/[^A-Za-z0-9-']/gi, ' ').split(" ")
}

var allSeed = "projects makers stuff without relying on zig";

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

allSeed.split(" ").map(genLine).forEach(x => appendLine(x))
