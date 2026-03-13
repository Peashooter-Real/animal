const fs = require('fs');
let content = fs.readFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', 'utf8');

// Fix Killshroud manual power addition
const killOld = 'card.dataset.turnEndBuffPower = (parseInt(card.dataset.turnEndBuffPower || "0") + 5000).toString();\r\n                                 card.dataset.turnEndBuffActive = "true";\r\n                                 syncPowerDisplay(card);';
const killNew = 'updateAllStaticBonuses();';

if (content.includes(killOld)) {
    content = content.replace(killOld, killNew);
    console.log("Killshroud fixed");
} else {
    // Try without \r
    const killOldNoR = 'card.dataset.turnEndBuffPower = (parseInt(card.dataset.turnEndBuffPower || "0") + 5000).toString();\n                                 card.dataset.turnEndBuffActive = "true";\n                                 syncPowerDisplay(card);';
    if (content.includes(killOldNoR)) {
        content = content.replace(killOldNoR, killNew);
        console.log("Killshroud fixed (no R)");
    } else {
        console.log("Killshroud NOT found");
    }
}

fs.writeFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', content, 'utf8');
