
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', 'utf8').split('\n');
let balance = 0;
for (let i = 2280; i < 2700; i++) {
    let line = content[i];
    if (line === undefined) break;
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    // We need to know the initial balance too.
}
// Better: full run but only print 2600-2700
balance = 0;
for (let i = 0; i < content.length; i++) {
    let line = content[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (i >= 2630 && i <= 2680) {
        console.log(`Line ${i + 1}: balance = ${balance} | "${line.trim()}"`);
    }
}
