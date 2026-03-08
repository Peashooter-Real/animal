const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// Replace standard alerts (except window.alert overrides)
code = code.replace(/window\.alert\(/g, 'alert('); 
// We already replaced confirm( with await vgConfirm( via powershell earlier, so let's check
if (!code.includes('await vgConfirm')) {
    code = code.replace(/confirm\(/g, 'await vgConfirm(');
}

// Write alert implementations block (must be at the top level or global object)
const alertCode = \
window.alert = function(msg) {
    const box = document.createElement('div');
    box.className = 'vanguard-alert-box fade-in';
    box.innerHTML = \\\
        <div class="vanguard-alert-content">
            <h3 style="color:var(--accent-vanguard); margin-bottom:10px; font-family:'Orbitron', sans-serif; text-shadow:0 0 5px var(--accent-vanguard);">SYSTEM NOTICE</h3>
            <p style="color: white; font-size: 1.1rem;">\</p>
        </div>
    \\\;
    document.body.appendChild(box);
    setTimeout(() => {
        box.classList.remove('fade-in');
        box.classList.add('fade-out');
        setTimeout(() => box.remove(), 500);
    }, 3500);
};

window.vgConfirm = function(msg) {
    return new Promise(resolve => {
        const overlay = document.createElement('div');
        overlay.className = 'column-selection-overlay glass-panel';
        overlay.innerHTML = \\\
            <div class="mobile-guard-box" style="width: 90%; max-width: 450px; text-align: center; padding: 2rem; background: rgba(15, 15, 25, 0.95); border: 2px solid var(--accent-vanguard); border-radius: 20px; box-shadow: 0 0 30px rgba(255, 42, 109, 0.5); font-family: 'Orbitron', sans-serif;">
                <h3 style="color: var(--accent-vanguard); margin-bottom: 20px; font-size: 1.4rem; text-shadow:0 0 10px #f00;">ACTION REQUIRED</h3>
                <p style="color: white; font-size: 1.2rem; margin-bottom: 30px; font-family: sans-serif;">\</p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="vg-confirm-yes" class="glass-btn highlight-btn" style="flex: 1; padding: 1rem; background: var(--accent-vanguard); border: none; font-size: 1.1rem; color: #fff;">CONFIRM</button>
                    <button id="vg-confirm-no" class="glass-btn" style="flex: 1; padding: 1rem; background: rgba(255, 255, 255, 0.1); color: #ccc; border: 1px solid #555; font-size: 1.1rem;">CANCEL</button>
                </div>
            </div>
        \\\;
        document.body.appendChild(overlay);
        
        document.getElementById('vg-confirm-yes').onclick = () => {
            overlay.remove();
            resolve(true);
        };
        document.getElementById('vg-confirm-no').onclick = () => {
            overlay.remove();
            resolve(false);
        };
    });
};

\;

code = code.replace(/document\.addEventListener\('DOMContentLoaded', \(\) => \{/, 'document.addEventListener(\\'DOMContentLoaded\\', () => {\\n' + alertCode);

// Fix async functions
// 1. checkRichardSkill
code = code.replace(/function checkRichardSkill\(card\) \{/, 'async function checkRichardSkill(card) {');
code = code.replace(/card\.ondblclick = \(\) => \{/g, 'card.ondblclick = async () => {');

// 2. performAttack
code = code.replace(/function performAttack\(attacker, target\) \{/, 'async function performAttack(attacker, target) {');

// 3. validateAndMoveCard
code = code.replace(/function validateAndMoveCard\(card, zone\) \{/, 'async function validateAndMoveCard(card, zone) {');
code = code.replace(/el\.addEventListener\('drop', \(e\) => \{/, 'el.addEventListener(\\'drop\\', async (e) => {');
code = code.replace(/el\.addEventListener\('click', \(e\) => \{/, 'el.addEventListener(\\'click\\', async (e) => {');
code = code.replace(/const moved = validateAndMoveCard\(/, 'const moved = await validateAndMoveCard(');
code = code.replace(/validateAndMoveCard\(draggedCard, el\);/, 'await validateAndMoveCard(draggedCard, el);');

// 4. setTimeouts that contain await vgConfirm need async callbacks
code = code.replace(/setTimeout\(\(\) => \{(\s+)if \(await vgConfirm/g, 'setTimeout(async () => { (await vgConfirm');

// Jamil doesn't have "await vgConfirm" directly after bracket, let's catch it manually:
// From ride checking
code = code.replace(/setTimeout\(\(\) => \{(\s+)const vg = document\.querySelector/g, 'setTimeout(async () => { vg = document.querySelector');

fs.writeFileSync('script.js', code);
console.log('Script updated');
