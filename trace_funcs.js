
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', 'utf8');

let balance = 0;
let lines = content.split('\n');
let inString = false;
let stringChar = '';
let inComment = false;
let inMultiComment = false;
let inTemplate = false;

for (let i = 0; i < content.length; i++) {
    let char = content[i];
    let nextChar = content[i+1];
    let prevChar = content[i-1];
    
    // ... ignoring logic ...
    if (inComment) { if (char === '\n') inComment = false; continue; }
    if (inMultiComment) { if (char === '*' && nextChar === '/') { inMultiComment = false; i++; } continue; }
    if (inString) { if (char === stringChar && prevChar !== '\\') inString = false; continue; }
    if (inTemplate) { if (char === '`' && prevChar !== '\\') inTemplate = false; continue; }
    if (char === '/' && nextChar === '/') { inComment = true; i++; continue; }
    if (char === '/' && nextChar === '*') { inMultiComment = true; i++; continue; }
    if (char === '"' || char === "'") { inString = true; stringChar = char; continue; }
    if (char === '`') { inTemplate = true; continue; }

    if (char === '{') {
        balance++;
    }
    if (char === '}') {
        balance--;
    }
    
    // find index of line start
    let lineNum = content.substring(0, i).split('\n').length;
    let lineText = lines[lineNum-1];
    
    if (lineText.includes('function') && char === '{') {
        console.log(`Function at line ${lineNum} starts with balance ${balance}`);
    }
}
