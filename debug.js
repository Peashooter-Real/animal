const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', 'utf8');
const lines = content.split('\n');
const targetLine = lines[5716]; // 5717 in 1-indexed
console.log(JSON.stringify(targetLine));
