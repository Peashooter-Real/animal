const fs = require('fs');
let content = fs.readFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', 'utf8');

const targetLine = 'card.dataset.turnEndBuffPower = (parseInt(card.dataset.turnEndBuffPower || "0") + 5000).toString();';

let lines = content.split('\n');
let found = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(targetLine)) {
        console.log("Found at line " + (i+1));
        // Replace this line and the next two
        lines[i] = '                                 updateAllStaticBonuses();';
        lines[i+1] = '';
        lines[i+2] = '';
        found = true;
        break;
    }
}

if (found) {
    fs.writeFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', lines.join('\n'), 'utf8');
    console.log("Patched!");
} else {
    console.log("NOT FOUND");
}
