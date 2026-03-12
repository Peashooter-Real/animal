
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', 'utf8').split('\n');
let balance = 0;
for (let i = 0; i < content.length; i++) {
    let line = content[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (i >= 7200) {
        console.log(`Line ${i + 1}: balance = ${balance} | "${line.trim()}"`);
    }
}
