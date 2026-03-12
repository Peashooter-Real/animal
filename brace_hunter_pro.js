
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', 'utf8');

let balance = 0;
let inString = false;
let stringChar = '';
let inComment = false;
let inMultiComment = false;
let inTemplate = false;

let lines = content.split('\n');
let currentLine = 1;
let globalTarget = 1; // within DOMContentLoaded

for (let i = 0; i < content.length; i++) {
    let char = content[i];
    if (char === '\n') currentLine++;
    let nextChar = content[i+1];
    let prevChar = content[i-1];

    if (inComment) {
        if (char === '\n') inComment = false;
        continue;
    }
    if (inMultiComment) {
        if (char === '*' && nextChar === '/') {
            inMultiComment = false;
            i++;
        }
        continue;
    }
    if (inString) {
        if (char === stringChar && prevChar !== '\\') inString = false;
        continue;
    }
    if (inTemplate) {
        if (char === '`' && prevChar !== '\\') inTemplate = false;
        continue;
    }

    if (char === '/' && nextChar === '/') { inComment = true; i++; continue; }
    if (char === '/' && nextChar === '*') { inMultiComment = true; i++; continue; }
    if (char === '"' || char === "'") { inString = true; stringChar = char; continue; }
    if (char === '`') { inTemplate = true; continue; }

    if (char === '{') balance++;
    if (char === '}') {
        balance--;
        if (balance < 1 && currentLine < lines.length) {
            console.log(`Potential premature close at line ${currentLine}: ${lines[currentLine-1].trim()} (Balance: ${balance})`);
        }
    }
}
