const fs = require('fs');
let content = fs.readFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', 'utf8');

const lines = content.split('\n');
let patched = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('// Findanis / Hanada (Booster)')) {
        console.log("Found Hanada section at line " + (i+1));
        // Remove the next 4 lines
        lines[i] = '                // Findanis (CONT) - Handled in applyStaticBonuses for visibility';
        lines[i+1] = '';
        lines[i+2] = '';
        lines[i+3] = '';
        lines[i+4] = '';
        patched = true;
        break;
    }
}

// 3. Add Findanis to applyStaticBonuses
let patchedApplied = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('// --- Avantgarda ACT Skill Power (+5000) ---')) {
        console.log("Found Avantgarda section at line " + (i+1));
        lines[i-1] += `
        // --- Blue Deathster, "Dark Verdict" Findanis [CONT] ---
        if (name.includes('Findanis') && zone.startsWith('rc')) {
            if (isMyTurn && strategyPutToOrderZoneThisTurn) {
                if (card.dataset.findanisBonusApplied !== "true") {
                    card.dataset.power = (parseInt(card.dataset.power || card.dataset.basePower || "0") + 5000).toString();
                    card.dataset.findanisBonusApplied = "true";
                    syncPowerDisplay(card);
                }
            } else if (card.dataset.findanisBonusApplied === "true") {
                card.dataset.power = (parseInt(card.dataset.power || card.dataset.basePower || "0") - 5000).toString();
                card.dataset.findanisBonusApplied = "false";
                syncPowerDisplay(card);
            }
        }
`;
        patchedApplied = true;
        break;
    }
}

if (patched || patchedApplied) {
    fs.writeFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', lines.join('\n'), 'utf8');
    console.log("Patched Hanada and Findanis!");
}
