
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', 'utf8');

let balance = 0;
let inString = false;
let stringChar = '';
let inComment = false; // single line //
let inMultiComment = false; // /* */
let inTemplate = false;

for (let i = 0; i < content.length; i++) {
    let char = content[i];
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
        else if (char === '$' && nextChar === '{') {
            // inside template expr, braces DO count
            // but we need to track nested templates... ugh.
            // for now, let's assume simple ${}
        }
        continue;
    }

    if (char === '/' && nextChar === '/') { inComment = true; i++; continue; }
    if (char === '/' && nextChar === '*') { inMultiComment = true; i++; continue; }
    if (char === '"' || char === "'") { inString = true; stringChar = char; continue; }
    if (char === '`') { inTemplate = true; continue; }

    if (char === '{') balance++;
    if (char === '}') balance--;
    
    if (balance < 0) {
        // find line number
        let lines = content.substring(0, i).split('\n');
        console.log(`Balance < 0 at line ${lines.length}: ${lines[lines.length-1].trim()}`);
    }
}
console.log(`Final balance: ${balance}`);
