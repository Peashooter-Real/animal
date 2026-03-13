const fs = require('fs');
let content = fs.readFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', 'utf8');

// 1. Fix Hanada bonus in declareAttack
const hanadaOld = `                // Findanis / Hanada (Booster)
                if (boosterCardInfo && (boosterCardInfo.name.includes('Findanis') || boosterCardInfo.name.includes('Hanada'))) {
                    totalPower += 5000;
                    alert(\`\${boosterCardInfo.name}: [CONT] Boosting & Strategy Active, Power +5000!\`);
                }`;
const hanadaNew = `                // --- Avantgarda Attacker Skills ---
                // Findanis (CONT) - Handled in applyStaticBonuses for visibility`;

if (content.includes(hanadaOld)) {
    content = content.replace(hanadaOld, hanadaNew);
    console.log("Hanada fixed in declareAttack");
} else {
    console.log("Hanada NOT found in declareAttack");
}

// 2. Fix resetMyUnits flags
const flagsOld = "const flags = ['stoodByEffect', 'frBonusApplied', 'meganBuffed', 'edenCritApplied', 'burstBonusApplied', 'burstFrontBuffApplied', 'personaBuffed', 'julianUsed', 'elderBuffed', 'winnsapoohPlacedBuff', 'enpixBackBuffed', 'bojalcornActive', 'gabrestrict', 'alpinBindReady', 'goildoatRetireReady', 'stefanieBuffed', 'baurPwrAdded', 'baurDriveCheck', 'baurDriveUsed', 'killshroudDebuffApplied', 'killshroudGuardRestrict', 'shockCritApplied', 'strategyPowerBuffed', 'dustingBuffApplied', 'drive', 'avantStandReady', 'avantSkillPowerBuffed', 'turnEndBuffActive', 'turnEndBuffPower', 'actUsed', 'fromHand'];";
const flagsNew = `const flags = [
                'stoodByEffect', 'frBonusApplied', 'meganBuffed', 'edenCritApplied', 'burstBonusApplied', 
                'burstFrontBuffApplied', 'personaBuffed', 'julianUsed', 'elderBuffed', 'winnsapoohPlacedBuff', 
                'enpixBackBuffed', 'bojalcornActive', 'gabrestrict', 'alpinBindReady', 'goildoatRetireReady', 
                'stefanieBuffed', 'baurPwrAdded', 'baurDriveCheck', 'baurDriveUsed', 'killshroudDebuffApplied', 
                'killshroudGuardRestrict', 'shockCritApplied', 'strategyPowerBuffed', 'dustingBuffApplied', 
                'drive', 'avantStandReady', 'avantSkillPowerBuffed', 'turnEndBuffActive', 'turnEndBuffPower', 
                'actUsed', 'fromHand', 'asagiBonusApplied', 'avantSkillBuffApplied', 'killshroudPowerBuffApplied',
                'darkBonusApplied', 'majestyBonusApplied', 'maronBonusApplied', 'ordealBonusApplied',
                'findanisBonusApplied', 'otDarkStatesActiveBuff', 'otStoicheiaBuff', 'turnEndBuffApplied',
                'killshroudDebuffApplied', 'vilsXoverBuffed', 'garouXoverBuffed'
            ];`;

if (content.includes(flagsOld)) {
    content = content.replace(flagsOld, flagsNew);
    console.log("Flags fixed in resetMyUnits");
} else {
    console.log("Flags NOT found in resetMyUnits");
}

fs.writeFileSync('c:\\Users\\User\\Downloads\\vanguarad\\script.js', content, 'utf8');
