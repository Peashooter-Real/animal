document.addEventListener('DOMContentLoaded', () => {







    let alertContainer = document.getElementById('vanguard-alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'vanguard-alert-container';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '10%';
        alertContainer.style.left = '50%';
        alertContainer.style.transform = 'translateX(-50%)';
        alertContainer.style.display = 'flex';
        alertContainer.style.flexDirection = 'column';
        alertContainer.style.gap = '8px';
        alertContainer.style.zIndex = '999999';
        alertContainer.style.pointerEvents = 'none';
        alertContainer.style.alignItems = 'center';
        document.body.appendChild(alertContainer);
    }

    window.alert = function (msg) {
        const box = document.createElement('div');
        box.className = 'vanguard-alert-box fade-in';
        box.style.position = 'static';
        box.style.transform = 'none';
        box.style.width = 'fit-content';
        box.style.maxWidth = '90vw';
        box.style.padding = '8px 15px';
        box.style.boxShadow = '0 0 15px rgba(255, 42, 109, 0.4)';
        box.innerHTML = `
        <div class="vanguard-alert-content" style="text-align: center;">
            <p style="color: white; font-size: 0.95rem; margin: 0; text-shadow: 0 0 3px black;">${msg}</p>
        </div>
    `;
        alertContainer.appendChild(box);
        setTimeout(() => {
            box.classList.remove('fade-in');
            box.classList.add('fade-out');
            setTimeout(() => box.remove(), 500);
        }, 2000); // Shorter duration
    };

    window.vgConfirm = function (msg) {
        return new Promise(resolve => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.style.zIndex = '999999';
            overlay.innerHTML = `
            <div class="modal-content glass-panel" style="width: 90%; max-width: 400px; text-align: center; padding: 2rem; background: rgba(15, 15, 25, 0.95); border: 2px solid var(--accent-vanguard); border-radius: 20px; box-shadow: 0 0 30px rgba(255, 42, 109, 0.5); font-family: 'Orbitron', sans-serif;">
                <h3 style="color: var(--accent-vanguard); margin-top: 0; margin-bottom: 15px; font-size: 1.3rem; text-shadow:0 0 10px #f00;">ACTION REQUIRED</h3>
                <p style="color: white; font-size: 1.1rem; margin-bottom: 25px; font-family: sans-serif; line-height: 1.4;">${msg}</p>
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button id="vg-confirm-yes" class="glass-btn highlight-btn" style="flex: 1; padding: 0.9rem; background: var(--accent-vanguard); border: none; font-size: 1rem; color: #fff; cursor:pointer; font-weight: bold;">CONFIRM</button>
                    <button id="vg-confirm-no" class="glass-btn" style="flex: 1; padding: 0.9rem; background: rgba(255, 255, 255, 0.05); color: #aaa; border: 1px solid #444; font-size: 1rem; cursor:pointer;">CANCEL</button>
                </div>
            </div>
        `;
            document.body.appendChild(overlay);

            overlay.querySelector('#vg-confirm-yes').onclick = () => {
                overlay.remove();
                resolve(true);
            };
            overlay.querySelector('#vg-confirm-no').onclick = () => {
                overlay.remove();
                resolve(false);
            };
        });
    };


    // --- UI Elements ---
    const playerHand = document.getElementById('player-hand');
    const handCountNum = document.getElementById('hand-count-num');
    const boardAreas = document.querySelectorAll('.circle, .zone, .guardian-circle');
    const phaseSteps = document.querySelectorAll('.phase-step');
    const turnIndicator = document.getElementById('turn-indicator');
    const nextPhaseBtn = document.getElementById('next-phase-btn');
    const nextTurnBtn = document.getElementById('next-turn-btn');
    const soulCounter = document.getElementById('soul-counter');
    const handleSoulView = (e) => {
        if (e) e.stopPropagation();
        if (soulPool.length === 0) {
            alert("Soul is empty.");
            return;
        }
        openViewer("Soul Content", soulPool);
    };
    if (soulCounter) soulCounter.addEventListener('click', handleSoulView);
    const dropCountNum = document.getElementById('drop-count-num');
    const viewDropBtn = document.getElementById('view-drop-btn');
    const viewDamageBtn = document.getElementById('view-damage-btn');
    const damageCountNum = document.getElementById('damage-count-num');
    const deckCountNum = document.getElementById('deck-count-num');
    const zoneViewer = document.getElementById('zone-viewer');
    const viewerTitle = document.getElementById('viewer-title');
    const viewerGrid = document.getElementById('viewer-grid');
    const closeViewerBtn = document.getElementById('close-viewer-btn');

    // Skill Viewer
    const skillViewer = document.getElementById('skill-viewer');
    const skillCardName = document.getElementById('skill-card-name');
    const skillCardGrade = document.getElementById('skill-card-grade');
    const skillCardPower = document.getElementById('skill-card-power');
    const skillCardShield = document.getElementById('skill-card-shield');
    const skillText = document.getElementById('skill-text');
    const closeSkillBtn = document.getElementById('close-skill-btn');

    // Opponent info
    const oppHandCountNum = document.getElementById('opp-hand-count');
    const oppDeckCountNum = document.getElementById('opp-deck-count-num');
    const oppDropCountNum = document.getElementById('opp-drop-count-num');
    const oppDamageCountNum = document.getElementById('opp-damage-count-num');
    const oppSoulBadge = document.getElementById('opp-soul-counter');
    window.oppSoulPool = [];
    if (oppSoulBadge) {
        oppSoulBadge.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!window.oppSoulPool || window.oppSoulPool.length === 0) {
                alert("Opponent's Soul is empty.");
                return;
            }
            openViewer("Opponent's Soul", window.oppSoulPool.map(c => createCardElement(c)));
        });
    }
    const oppViewDropBtn = document.getElementById('opp-view-drop-btn');
    const oppViewDamageBtn = document.getElementById('opp-view-damage-btn');

    // Matchmaking / Overlay Elements
    const matchmakingOverlay = document.getElementById('matchmaking-overlay');
    const matchmakingSubtitle = document.getElementById('matchmaking-subtitle');
    const idDisplayBox = document.getElementById('id-display-box');
    const gamePeerIdDisplay = document.getElementById('game-peer-id');
    const copyGameIdBtn = document.getElementById('copy-game-id-btn');
    const gameStatusText = document.getElementById('game-status-text');
    const networkInfo = document.getElementById('network-info');
    const gameContainer = document.getElementById('game-container');

    // --- State Variables ---
    let cardIdCounter = 0;
    let draggedCard = null;
    let attackingCard = null;
    let deckPool = [];
    let currentTurn = 1;
    let isFirstPlayer = true; // Host defaults to true, Guest will set to false
    window.isFirstPlayer = true; // Global mirror for easier debugging
    const phases = ['stand', 'draw', 'ride', 'main', 'battle', 'end'];
    let currentPhaseIndex = 0;
    let hasRiddenThisTurn = false;
    let hasDiscardedThisTurn = false;
    let hasDrawnThisTurn = false;
    let soulPool = [];
    let bindPool = [];
    window.oppBindPool = [];

    // --- Multiplayer State ---
    let peer = null;
    let conn = null;
    let isHost = false;
    let isMyTurn = false;
    let gameStarted = false; // Add flag to track if game has actually begun
    let isGuarding = false; // Add guard checking state
    let isWaitingForGuard = false;
    let pendingPowerIncrease = 0;
    let pendingCriticalIncrease = 0;
    let targetingType = null; // 'power' or 'critical' or 'both'
    let pendingDamageChecks = 0; // Queue damage until drive checks finish
    let currentAttackData = null; // Store for recalculation after buffs
    let selectedCard = null; // Track selected card for tap-to-move
    let personaRideActive = false;
    let isOpponentPersonaRide = false;
    let isFinalRush = false;
    let isFinalBurst = false;
    let finalRushTurnLimit = 0;
    let isOpponentFinalRush = false;
    let isOpponentFinalBurst = false;
    let turnAttackCount = 0;
    let orderPlayedThisTurn = false;
    let ordersPlayedCount = 0;
    let maxOrdersPerTurn = 1;
    let nextSetOrderFree = false;
    let lastStrategyPutIntoSoulName = "";
    let strategyPutToOrderZoneThisTurn = false;
    let bomberDustingPowerBuff = false;
    let bomberDustingNoIntercept = false;
    let bomberDustingNoBlitz = false;
    let myRpsChoice = null;
    let oppRpsChoice = null;
    let hasConfirmedMulligan = false;
    let oppConfirmedMulligan = false;
    let rpsResolved = false;
    window.myRGRetiredThisTurn = false;
    let strategyActivatedThisTurn = false;
    let shockStrategyActive = false;
    let strategyActivatedCount = 0;

    // --- Card Image Database ---
    const cardImages = {
        // Bruce Deck
        'Diabolos, "Innocent" Matt': 'picture/grade0_bruce.jpg',
        'Diabolos, "Bad" Steve': 'picture/grade1_bruce.jpg',
        'Diabolos, "Anger" Richard': 'picture/grade2_bruce.jpg',
        'Diabolos, "Viamance" Bruce': 'picture/grade3_bruce.jpg',
        'Diabolos Diver, Julian': 'picture/julian.jpg',
        'Diabolos Madonna, Megan': 'picture/megan.jpg',
        'Diabolos Boys, Eden': 'picture/eden.jpg',
        'Diabolos Buckler, Jamil': 'picture/jamil.jpg',
        'Recusal Hate Dragon (Perfect Guard)': 'picture/recusal.jpg',
        'Diabolos Girls, Stefanie': 'picture/stefani.jpg',
        'Diabolos Madonna, Mabel': 'picture/mabel.jpg',
        'Diabolos Girls, Ivanka': 'picture/ivanka.jpg',

        // Triggers - Dark States (Bruce)
        'Critical Trigger (Dark States)': 'picture/bruce_crit.png',
        'Draw Trigger (Dark States)': 'picture/bruce_draw.png',
        'Front Trigger (Dark States)': 'picture/bruce_front.png',
        'Heal Trigger (Dark States)': 'picture/bruce_heal.png',
        'Hades Dragon Deity, Gallmageveld': 'https://cf-vanguard.com/wordpress/wp-content/images/cardlist/d-bt01/d-bt01_005.png',

        // Magnolia Deck
        'Sylvan Horned Beast, Lotte': 'picture/grade0_magnolia.jpg',
        'Sylvan Horned Beast, Charis': 'picture/grade1_magnolia.jpg',
        'Sylvan Horned Beast, Lattice': 'picture/grade2_magnolia.jpg',
        'Sylvan Horned Beast King, Magnolia': 'picture/grade3_magnolia.jpg',
        'Sylvan Horned Beast Emperor, Magnolia Elder': 'picture/grade4_magnolia.jpg',
        'Blue Artillery Dragon, Inlet Pulse Dragon': 'picture/fly.jpg',
        'Sylvan Horned Beast, Giunosla': 'picture/giunosla.jpg',
        'Sylvan Horned Beast, Enpix': 'picture/enpix.jpg',
        'Sylvan Horned Beast, Goildoat': 'picture/golidoat.jpg',
        'Sylvan Horned Beast, Alpin': 'picture/alpin.jpg',
        'Sylvan Horned Beast, Winnsapooh': 'picture/winnsapooh.jpg',
        'Sylvan Horned Beast, Gabregg': 'picture/gabregg.jpg',
        'Sylvan Horned Beast, Bojalcorn': 'picture/bojalcorn.jpg',
        'Spiritual Body Condensation': 'picture/spirit.jpg',
        'In the Dim Darkness, the Frozen Resentment': 'picture/dark.jpg',

        // Triggers - Stoicheia (Magnolia)
        'Critical Trigger (Stoicheia)': 'picture/stoicheia_crit.png',
        'Draw Trigger (Stoicheia)': 'https://cf-vanguard.com/wordpress/wp-content/images/cardlist/d-sd04/d-sd04_012.png',
        'Front Trigger (Stoicheia)': 'https://cf-vanguard.com/wordpress/wp-content/images/cardlist/d-sd04/d-sd04_014.png',
        'Heal Trigger (Stoicheia)': 'https://cf-vanguard.com/wordpress/wp-content/images/cardlist/d-sd04/d-sd04_013.png',
        'Source Dragon Deity, Blessfavor': 'https://cf-vanguard.com/wordpress/wp-content/images/cardlist/d-bt01/d-bt01_006.png',

        // Nirvana Jheva Deck
        'Sunrise Egg': 'picnirvana/0nir.jpg',
        'Heart-pounding Blaze Maiden, Rino': 'picnirvana/1nir.jpg',
        'Snuggling Blaze Maiden, Reiyu': 'picnirvana/reiyu.png',
        'Chakrabarthi Pheonix Dragon, Nirvana Jheva': 'picnirvana/nirvana_jheva.png',
        'Trickstar': 'picnirvana/star.jpg',
        'Sparkle Rejector Dragon (Perfect Guard)': 'picnirvana/sparkle_rejector.png',
        'Illuminate Equip Dragon, Graillumirror': 'picnirvana/graillumirror.png',
        'Strike Equip Dragon, Stragallio': 'picnirvana/stragallio.png',
        'Sword Equip Dragon, Galondight': 'picnirvana/galondight.png',
        'Mirror Reflection Equip, Mirrors Vairina': 'picnirvana/mirrors.png',
        'Jeweled Sword Equip, Garou Vairina': 'picnirvana/garou.png',
        'Sturdy Wall Equip, Vils Vairina': 'picnirvana/vils.png',
        'Brilliant Equip, Bram Vairina': 'picnirvana/bram.png',
        'Flaring Cannon Equip, Baur Vairina': 'picnirvana/baur.png',
        'Vairina Arcs': 'picnirvana/arcs.png',

        // Triggers - Dragon Empire
        'Critical Trigger (Dragon Empire)': 'https://cf-vanguard.com/wordpress/wp-content/images/cardlist/d-sd01/d-sd01_011.png',
        'Draw Trigger (Dragon Empire)': 'https://cf-vanguard.com/wordpress/wp-content/images/cardlist/d-sd01/d-sd01_012.png',
        'Heal Trigger (Dragon Empire)': 'https://cf-vanguard.com/wordpress/wp-content/images/cardlist/d-sd01/d-sd01_013.png',

        // Keter Sanctuary Deck
        'Wingul Brave': 'majes/wingul_brave.png',
        'Little Sage, Maron': 'majes/maron.png',
        'Blaster Blade': 'majes/blaster_blade.png',
        'Blaster Dark': 'majes/blaster_dark.png',
        'Majesty Lord Blaster': 'majes/majesty_lord_blaster.png',
        'Knight of Inheritance, Emmeline': 'majes/emmeline.png',
        'Palladium Zeal Dragon (PG)': 'majes/palladium_zeal.png',
        'Ordeal Dragon': 'majes/ordeal_dragon.png',
        'Knight of Old Fate, Cordiela': 'majes/cordiela.png',
        'Painkiller Angel': 'majes/painkiller_angel.png',
        'Departure Towards the Dawn': 'majes/departure_dawn.png',

        'Critical Trigger (Keter)': 'majes/critical_keter.png',
        'Front Trigger (Keter)': 'majes/front_keter.png',
        'Heal Trigger (Keter)': 'majes/heal_keter.png',
        'Light Dragon Deity of Honors, Amartinoa': 'majes/amartinoa.png',

        // Brandt Gate - Avantgarda
        'Blue Deathster, Sora Period': 'avantgarda/sora.png',
        'Blue Deathster, "Dark Verdict" Findanis': 'avantgarda/findanis.png',
        'Blue Deathster, "Heavenly Death Ray" Stelvane': 'avantgarda/stelvane.png',
        'Blue Deathster, "Skyrender" Avantgarda': 'avantgarda/avant_original.png',
        'Blue Deathster, "Skyrendriver" Avantgarda Richter': 'avantgarda/richter.png',
        'Shock Strategy: Death Winds': 'avantgarda/death_winds.png',
        'Bomber Strategy: Dusting': 'avantgarda/bomber_dusting.png',
        'Disruption Strategy: Killshroud': 'avantgarda/killshroud.png',
        'Ala Dargente': 'avantgarda/ala_dargente.png',
        'Sickle Blade of Inquest, Habitable Zone': 'avantgarda/habitable_zone.png',
        'Blue Deathster, Asagi Milestone': 'avantgarda/asagi.png',
        'Blue Deathster, Hanada Halfway': 'avantgarda/hanada_halfway.png',
        'Automated Belstul (Perfect Guard)': 'avantgarda/belstul_pg.png',

        'Critical Trigger (Brandt Gate)': 'avantgarda/brandt_crit.png',
        'Draw Trigger (Brandt Gate)': 'avantgarda/brandt_draw.png',
        'Heal Trigger (Brandt Gate)': 'avantgarda/brandt_heal.png',
        'Star Dragon Deity of Infinitude, Eldobreath': 'avantgarda/eldobreath.png'
    };

    // --- Deck Definitions ---
    const bruceDeck = {
        rideDeck: [
            { name: 'Diabolos, "Innocent" Matt', grade: 0, power: 6000, shield: 10000, skill: '[AUTO]: เมื่อถูกไรด์ทับ ถ้าคุณเริ่มเป็นคนที่สอง จั่วการ์ด 1 ใบ' },
            { name: 'Diabolos, "Bad" Steve', grade: 1, power: 8000, shield: 5000, skill: '[AUTO]: เมื่อยูนิทนี้วางบน (VC) เลือกการ์ด 1 ใบจากโซลของคุณ คอลลงช่อง (RC) แถวหลังตรงกลาง และ [Soul-Charge 1]\n[CONT](RC): ถ้าอยู่ในสถานะ "Final Rush" ยูนิทนี้ได้รับพลัง +5000' },
            { name: 'Diabolos, "Anger" Richard', grade: 2, power: 10000, shield: 5000, skill: '[AUTO]: เมื่อยูนิทนี้วางบน (VC) [คอสต์][นำเรียร์การ์ด 1 ใบเข้าสู่โซล] จั่วการ์ด 1 ใบ\n[CONT](RC): ถ้าอยู่ในสถานะ "Final Rush" ยูนิทนี้ได้รับพลัง +5000' },
            { name: "Diabolos, \"Viamance\" Bruce", grade: 3, power: 13000, persona: true, skill: "[AUTO](V): เมื่อเริ่มแบทเทิลเฟสของคุณ ถ้ายูนิททั้งหมดของคุณมีคำว่า \"เดียโบลอส\" คุณจะเข้าสู่สถานะ \"พลังบุกชั่วอึดใจ\" จนจบเทิร์นถัดไปของคู่แข่ง และถ้าแวนการ์ดคู่แข่งเป็นเกรด 3 หรือสูงกว่า จะเข้าสู่สถานะ \"พลังระเบิกเฮือกสุดท้าย\"\n[AUTO](V): เมื่อยูนิทนี้โจมตี ในสถานะพลังระเบิดเฮือกสุดท้าย [CB1] เลือกแถวแนวตั้ง 1 แถว Stand เรียร์การ์ดเดียโบลอสทั้งหมดในแถวนั้น และได้รับพลัง +5000" }
        ],
        mainDeck: [
            // G3 (6 cards total - excluding ride deck Bruce)
            ...Array(3).fill({ name: 'Diabolos, "Viamance" Bruce', grade: 3, power: 13000, persona: true, skill: 'Persona Ride: Front row +10000\n[AUTO](V): เมื่อเริ่มแบทเทิลเฟส... (เหมือนตัว Ride Deck)' }),
            ...Array(3).fill({ name: 'Diabolos Diver, Julian', grade: 3, power: 13000, skill: '[AUTO](RC)[1/turn]: เมื่อยูนิทนี้โจมตีแวนการ์ด, [คอสต์][Counter-Blast 1], ยูนิทนี้ได้รับพลัง+2000 จนจบเทิร์น ต่อการ์ดทุกๆ 1 ใบในดาเมจโซนของคุณ หากคุณมีแวนการ์ดที่มีชื่อ "Bruce", และทำการ [Soul-Charge 1] ต่อดาเมจทุกๆ 2 ใบ เลือกการ์ดในโซลของคุณสูงสุดตามจำนวนที่ [Soul-Charge] ด้วยผลนี้ คอลลง (RC) ที่ว่างอยู่' }),

            // G2 (15 cards total)
            ...Array(4).fill({ name: 'Diabolos Madonna, Megan', grade: 2, power: 10000, shield: 5000, skill: '[AUTO](R): เมื่อยูนิทนี้โจมตี ในสถานะพลังบุกชั่วอึดใจ ยูนิทนี้ได้รับพลัง+10000 จนจบเทิร์น' }),
            ...Array(4).fill({ name: 'Diabolos Boys, Eden', grade: 2, power: 10000, shield: 5000, skill: '[CONT](R): ถ้าอยู่ในสถานะพลังบุกชั่วอึดใจ ได้รับพลัง +5000\n[CONT](R): ถ้าเคย Stand ด้วยความสามารถในเทิร์นนี้ ได้รับ Critical +1\n[AUTO](R): เมื่อโจมตีฮิต [CB1] รีไทร์เรียร์การ์ดคู่แข่ง 1 ใบ' }),
            ...Array(3).fill({ name: 'Diabolos Buckler, Jamil', grade: 2, power: 10000, shield: 5000, skill: '[CONT](RC)/(GC): หากอยู่ในสถานะ "Final Burst" ยูนิทนี้ได้รับ พลัง+10000/โล่+5000 (ทำงานในเทิร์นคู่แข่งด้วย)\n[AUTO]: เมื่อวางบนช่อง (RC) หากแวนการ์ดคือ "Diabolos, \"Viamance\" Bruce", [คอสต์][Counter-Blast 1], [Soul-Charge 1], เลือกการ์ดนอร์มอลยูนิทที่มีชื่อ "Diabolos" เกรด 3 หรือต่ำกว่า 1 ใบจากโซล คอลลง (RC) ที่ว่างอยู่' }),
            ...Array(4).fill({ name: 'Recusal Hate Dragon (Perfect Guard)', grade: 1, power: 8000, shield: 0, isPG: true, skill: '[Sentinel] (Perfect Guard)\n[AUTO]: เมื่อยูนิทนี้เข้าสู่ G เลือกยูนิทคุณ 1 ใบ ยูนิทนั้นไม่ถูกฮิตจนจบการต่อสู้ ถ้าคุณมีการ์ดในมือตั้งแต่ 2 ใบขึ้นไป ทิ้งการ์ด 1 ใบ' }),

            // G1 (13 cards total)
            ...Array(4).fill({ name: 'Diabolos Girls, Stefanie', grade: 1, power: 8000, shield: 5000, skill: '[CONT](RC): ในสถานะ "Final Rush" ยูนิทอื่นทั้งหมดของคุณในแถวแนวตั้งเดียวกับยูนิทนี้ได้รับพลัง +5000 (ทำงานในเทิร์นคู่แข่งด้วย)' }),
            ...Array(3).fill({ name: 'Diabolos Madonna, Mabel', grade: 1, power: 7000, shield: 5000, skill: '[AUTO](RC): เมื่อยูนิทนี้บูสต์แวนการ์ด ในสถานะ "Final Rush" [CB1] แวนการ์ดได้รับ "Triple Drive" จนจบเทิร์น' }),
            ...Array(2).fill({ name: 'Diabolos Girls, Ivanka', grade: 1, power: 8000, shield: 5000, skill: '[AUTO](RC): เมื่อยูนิทที่บูสต์ด้วยยูนิทนี้โจมตีฮิตแวนการ์ด ในสถานะ "Final Rush" [คอสต์][CB1 & นำเรียร์การ์ดที่ยูนิทนี้บูสต์ไปไว้ใต้กอง] จั่วการ์ด 1 ใบ เลือกยูนิทอื่นของคุณ 1 ใบ ได้รับพลัง +5000 จนจบเทิร์น' }),

            // Triggers (16 cards total)
            ...Array(8).fill({ name: 'Critical Trigger (Dark States)', grade: 0, power: 5000, shield: 15000, trigger: 'Critical' }),
            ...Array(2).fill({ name: 'Draw Trigger (Dark States)', grade: 0, power: 5000, shield: 5000, trigger: 'Draw' }),
            ...Array(1).fill({ name: 'Front Trigger (Dark States)', grade: 0, power: 5000, shield: 15000, trigger: 'Front' }),
            ...Array(4).fill({ name: 'Heal Trigger (Dark States)', grade: 0, power: 5000, shield: 15000, trigger: 'Heal' }),
            { name: 'Hades Dragon Deity, Gallmageveld', grade: 0, power: 5000, shield: 50000, trigger: 'Over', overPower: '100 Million' }
        ].sort(() => 0.5 - Math.random()) // Shuffle main deck
    };

    function generateMainDeck(unitPool, triggerPool) {
        let deck = [];
        for (let i = 0; i < 16; i++) {
            deck.push({ ...triggerPool[i % triggerPool.length], id: `trigger-${i}` });
        }
        for (let i = 0; i < 30; i++) {
            deck.push({ ...unitPool[i % unitPool.length], id: `unit-${i}` });
        }
        return deck.sort(() => 0.5 - Math.random());
    }

    const magnoliaDeck = {
        rideDeck: [
            { name: 'Sylvan Horned Beast, Lotte', grade: 0, power: 6000, shield: 10000, skill: '[AUTO]: เมื่อถูกไรด์ทับ ถ้าคุณเริ่มเป็นคนที่สอง จั่วการ์ด 1 ใบ' },
            { name: 'Sylvan Horned Beast, Charis', grade: 1, power: 8000, shield: 5000, skill: '[ACT](VC)[1/turn]: [คอสต์][Soul-Blast 1] จั่วการ์ด 2 ใบ จากนั้นเลือกการ์ดออเดอร์จากบนมือคุณสูงสุด 1 ใบเพื่อทิ้ง หากไม่ได้ทิ้งด้วยผลนี้ เลือกทิ้งการ์ด 2 ใบจากบนมือคุณ\n[CONT](RC): ถ้าคุณใช้งานออเดอร์ในเทิร์นนี้ ยูนิทนี้ได้รับพลัง +2000' },
            { name: 'Sylvan Horned Beast, Lattice', grade: 2, power: 10000, shield: 5000, skill: '[ACT](RC): ถ้าแวนการ์ดของคุณมีชื่อ "Magnolia" และแวนการ์ดคู่แข่งเกรด 3 หรือสูงกว่า [คอสต์][Counter-Blast 1 & นำยูนิทนี้เข้าสู่โซล] เลือกเกรด 4 ที่มีชื่อ "Magnolia" จากบนมือคุณ 1 ใบแล้วไรด์ในสถานะ Stand' },
            { name: 'Sylvan Horned Beast King, Magnolia', grade: 3, power: 13000, persona: true, skill: '[AUTO](VC): เมื่อจบการโจมตีแบทเทิลที่ยูนิทนี้โจมตี [คอสต์][Counter-Blast 1] เลือกเรียร์การ์ดของคุณ 1 ใบจนจบเทิร์นยูนิทนั้นสามารถโจมตีจากแถวหลังได้และได้รับพลัง +5000 หากคุณทำเพอร์โซน่าไรด์ในเทิร์นนี้ เลือกได้ 3 ใบแทน 1 ใบ' }
        ],
        mainDeck: [
            // Grade 4
            ...Array(4).fill({ name: 'Sylvan Horned Beast Emperor, Magnolia Elder', grade: 4, power: 13000, skill: '[AUTO]: เมื่อวางบน (VC) เลือกการ์ด 1 ใบจากโซล คอลลง (RC)\n[CONT](VC): หากมี "Magnolia" ในโซลหรือบน (RC) ของคุณ เรียร์การ์ดทั้งหมดสามารถโจมตีและอินเตอร์เซปต์จากแถวหลังได้ และได้รับพลัง +5000' }),

            // Grade 3 (Listed as G3 by user, but Winnsapooh is G1 base with reduction)
            ...Array(3).fill({ name: 'Blue Artillery Dragon, Inlet Pulse Dragon', grade: 3, power: 13000, skill: '[AUTO](RC): เมื่อจบเทิร์นของคุณ หากมีการโจมตี 4 ครั้งขึ้นไปในเทิร์นนี้ [คอสต์][นำยูนิทนี้เข้าสู่โซล] จั่วการ์ด 1 ใบ' }),
            ...Array(2).fill({ name: 'Sylvan Horned Beast, Winnsapooh', grade: 3, power: 13000, skill: '[CONT]Deck/Hand: หากมีแวนการ์ด "Sylvan Horned Beast" เกรด 2 ขึ้นไปที่ไม่ใช่ชื่อตัวมันเอง การ์ดนี้เกรด -1\n[CONT](RC): หากแวนการ์ด "Magnolia" ถูกวางในเทิร์นนี้ ยูนิทนี้ได้รับพลัง +10000' }),

            // Grade 2
            ...Array(1).fill({ name: 'Sylvan Horned Beast, Bojalcorn', grade: 2, power: 10000, shield: 5000, skill: '[ACT](RC): [CB1] จนจบเทิร์น ยูนิทนี้ได้รับ "[CONT]Back Row (RC): เมื่อยูนิทนี้โจมตี จะโจมตีแถวหน้าคู่แข่งทั้งหมด"' }),
            ...Array(1).fill({ name: 'Sylvan Horned Beast, Gabregg', grade: 2, power: 10000, shield: 5000, skill: '[AUTO](RC): เมื่อยูนิทอื่นในแถวเดียวกับใบนี้โจมตี [SB1] พลัง+10000 และมอบ Guard Restrict ตามเกรดแถวหน้าคู่แข่ง' }),
            ...Array(3).fill({ name: 'Sylvan Horned Beast, Giunosla', grade: 2, power: 10000, shield: 5000, skill: '[AUTO]Back Row (RC): เมื่อยูนิทนี้โจมตี [CB1] เลือกเรียร์การ์ดใบอื่น 1 ใบ ยูนิทนั้นได้รับพลังเท่ากับพลังของยูนิทนี้จนจบเทิร์น' }),
            ...Array(3).fill({ name: 'Sylvan Horned Beast, Enpix', grade: 2, power: 10000, shield: 5000, skill: '[CONT]Back Row (RC): ยูนิทนี้ได้รับพลัง +10000 และถ้าคุณมีเรียร์การ์ดไม่เกิน 3 ใบ ยูนิททั้งหมดในแถวแนวตั้งเดียวกับยูนิทนี้จะไม่ถูกเลือกโดยความสามารถการ์ดของคู่แข่ง' }),
            ...Array(2).fill({ name: 'Sylvan Horned Beast, Goildoat', grade: 2, power: 10000, shield: 5000, skill: '[AUTO]Drop: เมื่อไรด์ Magnolia [เข้าโซล] VG พลัง+5000\n[AUTO](R): โจมตีจากแถวหลังพลัง+10000 ถ้าอยู่แถวกลางจบการต่อสู้ [Retire] จั่ว 1' }),
            ...Array(1).fill({ name: 'Sylvan Horned Beast, Alpin', grade: 2, power: 10000, shield: 5000, skill: '[AUTO](RC): เมื่อโจมตี VG ถ้าแวนการ์ดคือ Magnolia พลัง+5000 ต่อ G2 ทุก 2 ใบ ถ้า+10000 ขึ้นไป จบการต่อสู้ [Bind] CC1/SC1' }),

            // Grade 1
            ...Array(4).fill({ name: 'Spiritual Body Condensation', grade: 1, power: 0, shield: 0, skill: '[Order]: [SB1] เลือกการ์ดเกรดไม่เกินแวนการ์ด 1 ใบจากดรอปโซนคอลลง (RC) และใบนั้นได้รับพลัง +5000 จนจบเทิร์น' }),
            ...Array(2).fill({ name: 'In the Dim Darkness, the Frozen Resentment', grade: 1, power: 0, shield: 0, skill: '[Order]: [SB1] ดูการ์ด 3 ใบจากบนสุดของกอง เลือก 1 ใบเพื่อทิ้ง สับกอง จากนั้นเลือกการ์ดเกรดไม่เกินแวนการ์ด 1 ใบจากดรอปโซนคอลลง (RC)' }),
            ...Array(4).fill({ name: 'Custodial Dragon (Perfect Guard)', grade: 1, power: 8000, shield: 0, isPG: true, skill: '[Sentinel] (Perfect Guard)' }),

            // Triggers
            ...Array(8).fill({ name: 'Critical Trigger (Stoicheia)', grade: 0, power: 5000, shield: 15000, trigger: 'Critical' }),
            ...Array(3).fill({ name: 'Front Trigger (Stoicheia)', grade: 0, power: 5000, shield: 15000, trigger: 'Front' }),
            ...Array(4).fill({ name: 'Heal Trigger (Stoicheia)', grade: 0, power: 5000, shield: 15000, trigger: 'Heal' }),
            { name: 'Source Dragon Deity, Blessfavor', grade: 0, power: 5000, shield: 50000, trigger: 'Over', overPower: '100 Million' }
        ]
            .sort(() => 0.5 - Math.random())
    };

    const nirvanaJhevaDeck = {
        rideDeck: [
            { name: 'Sunrise Egg', grade: 0, power: 6000, shield: 10000, skill: '[AUTO]: เมื่อถูกไรด์ทับ ถ้าคุณเริ่มเป็นคนที่สอง จั่วการ์ด 1 ใบ' },
            { name: 'Heart-pounding Blaze Maiden, Rino', grade: 1, power: 8000, shield: 5000, skill: '[AUTO]: เมื่อถูกไรด์ทับโดย "Snuggling Blaze Maiden, Reiyu" ค้นหา "Trickstar" 1 ใบจากกองการ์ดคอลลง (RC) และสับกอง\n[CONT](RC): ในเทิร์นของคุณ หากมี <Prayer Dragon> ในแถวเดียวกัน พลัง+5000' },
            { name: 'Snuggling Blaze Maiden, Reiyu', grade: 2, power: 10000, shield: 5000, skill: '[AUTO]: เมื่อถูกไรด์ทับโดย "Nirvana Jheva" ดูการ์ด 7 ใบจากบนสุดของกอง เลือก <Prayer Dragon> 1 ใบขึ้นมือ และสับกอง\n[CONT](RC): ในเทิร์นของคุณ หากมี <Prayer Dragon> ในแถวเดียวกัน พลัง+5000' },
            { name: 'Chakrabarthi Pheonix Dragon, Nirvana Jheva', grade: 3, power: 13000, persona: true, skill: '[ACT](VC)[1/Turn]: [ทิ้งการ์ด 1 ใบ] เลือก "Trickstar" 1 ใบ และ <Prayer Dragon> 1 ใบจากดรอบคอลลง (RC)\n[AUTO](VC): เมื่อโจมตี [CB1] เลือกเรียร์การ์ด 1 ใบที่อยู่ในสถานะ [XoverDress] และ Stand ยูนิทนั้น' }
        ],
        mainDeck: [
            ...Array(4).fill({ name: 'Trickstar', grade: 0, power: 5000, shield: 5000, skill: '[CONT](RC): ไม่สามารถถูกเลือกโดยความสามารถการ์ดของคู่แข่ง' }),
            ...Array(4).fill({ name: 'Sparkle Rejector Dragon (Perfect Guard)', grade: 1, power: 8000, shield: 0, isPG: true, skill: '[Sentinel] (Perfect Guard)' }),
            ...Array(3).fill({ name: 'Illuminate Equip Dragon, Graillumirror', grade: 1, power: 8000, shield: 5000, skill: '[AUTO](RC): เมื่อแวนการ์ด "Nirvana" โจมตี [CB1] เลือกเรียร์การ์ดสถานะ overDress หรือ X-overDress 1 ใบ Stand' }),
            ...Array(3).fill({ name: 'Strike Equip Dragon, Stragallio', grade: 1, power: 8000, shield: 5000, skill: '[AUTO]: เมื่อวางบน (RC) จากบนมือ ถ้าแวนมีชื่อ "Nirvana" [ทิ้งการ์ด 1 ใบ] ค้นหาการ์ดที่มีความสามารถ [overDress] หรือ "Trickstar" 1 ใบขึ้นมือและสับกอง\n[AUTO]: เมื่อตกอยู่ในสถานะ originalDress [CB1] เลือก "Trickstar" จากดรอบคอลลง (RC)' }),
            ...Array(3).fill({ name: 'Sword Equip Dragon, Galondight', grade: 2, power: 10000, shield: 5000, skill: '[AUTO]: เมื่อถูกนำไปซ้อนใต้ร่าง X-overDress เลือกยูนิทที่ซ้อนทับ พลัง+5000 จนจบเทิร์น (ถ้าเป็น Garou Vairina พลัง+5000 แทนที่จะเป็น +5000)' }),
            ...Array(4).fill({ name: 'Mirror Reflection Equip, Mirrors Vairina', grade: 2, power: 10000, shield: 5000, skill: 'X-overDress: "Trickstar" & "Graillumirror"\n[AUTO]: เมื่อลง (RC) ด้วย X-overDress เลือก "Vairina" 2 ใบจากดรอบมาซ้อนใต้การ์ดนี้\n[AUTO](RC): เมื่อโจมตี พลัง+10000 จากนั้น [ทิ้งการ์ด Vairina ที่ซ้อนอยู่ 1 ใบ] เลือก "จั่วการ์ด 1 ใบ" หรือ "CC1"' }),
            ...Array(2).fill({ name: 'Jeweled Sword Equip, Garou Vairina', grade: 2, power: 10000, shield: 5000, skill: 'X-overDress: "Trickstar" & "Galondight"\n[CONT](RC): หากอยู่ในสถานะ X-overDress พลัง+10000 และเมื่อยูนิทนี้โจมตี คู่แข่งต้องคอลการ์ดจากบนมือลง (GC) ครั้งละ 2 ใบขึ้นไป' }),
            ...Array(1).fill({ name: 'Flaring Cannon Equip, Baur Vairina', grade: 3, power: 13000, skill: '[XoverDress]-One "Trickstar" and one <Prayer Dragon> unit\n[ACT](RC): หากอยู่ในสถานะ X-overDress [SB2] เลือกเรียร์การ์ดคู่แข่ง 1 ใบและรีไทร์\n[AUTO](RC): เมื่อโจมตีแวนการ์ดในสถานะ X-overDress พลัง+2000 ต่อช่อง RC ที่ว่างของคู่แข่ง และถ้าคู่แข่งมีเรียร์การ์ด 1 ใบหรือน้อยกว่า [CB1] ยูนิทนี้ Drive-1 และทำการ Drive Check' }),
            ...Array(2).fill({ name: 'Vairina Arcs', grade: 2, power: 10000, shield: 5000, skill: '[overDress]-"Trickstar"\n[AUTO]: เมื่อลง (RC) ในสถานะ overDress [CB1] จั่วการ์ด 2 ใบและพลัง+5000' }),
            ...Array(3).fill({ name: 'Chakrabarthi Pheonix Dragon, Nirvana Jheva', grade: 3, power: 13000, persona: true, skill: '[ACT](VC)[1/Turn]: [ทิ้งการ์ด 1 ใบ] เลือก "Trickstar" 1 ใบ และ <Prayer Dragon> 1 ใบจากดรอบคอลลง (RC)\n[AUTO](VC): เมื่อโจมตี [CB1] เลือกเรียร์การ์ด 1 ใบที่อยู่ในสถานะ [XoverDress] และ Stand ยูนิทนั้น' }),

            ...Array(7).fill({ name: 'Critical Trigger (Dragon Empire)', grade: 0, power: 5000, shield: 15000, trigger: 'Critical' }),
            ...Array(4).fill({ name: 'Draw Trigger (Dragon Empire)', grade: 0, power: 5000, shield: 5000, trigger: 'Draw' }),
            ...Array(4).fill({ name: 'Heal Trigger (Dragon Empire)', grade: 0, power: 5000, shield: 15000, trigger: 'Heal' }),
            { name: 'Dragontree Deity of Resurgence, Dragveda', grade: 0, power: 5000, shield: 50000, trigger: 'Over', overPower: '100 Million' }
        ].sort(() => 0.5 - Math.random())
    };

    const majestyDeck = {
        rideDeck: [
            { name: 'Wingul Brave', grade: 0, power: 6000, shield: 10000, skill: '[AUTO]: เมื่อถูกไรด์ทับ ถ้าคุณเริ่มเป็นคนที่สอง จั่วการ์ด 1 ใบ' },
            { name: 'Little Sage, Maron', grade: 1, power: 8000, shield: 5000, skill: '[AUTO]: เมื่อถูกไรด์ทับโดยเกรด 2 ที่มีคำว่า "Blaster" ดูการ์ด 7 ใบจากบนสุดของกอง เลือกเกรด 2 ที่มีคำว่า "Blaster" ไม่เกิน 1 ใบขึ้นมือและสับกอง หากไม่ได้นำการ์ดขึ้นมือ สามารถเรียก "Wingul Brave" 1 ใบจากโซลคอลลง (RC)\n[CONT](RC): ในเทิร์นของคุณ หากคุณมียูนิท 3 ใบขึ้นไป ยูนิทนี้ได้รับพลัง+2000' },
            { name: 'Blaster Blade', grade: 2, power: 10000, shield: 5000, skill: '[AUTO]: เมื่อวางบน (VC) [CB1] เลือกรีไทร์เรียร์การ์ดคู่แข่ง 1 ใบ หากไม่รีไทร์ จั่วการ์ด 1 ใบ\n[AUTO]: เมื่อวางบน (RC) [CB1] เลือกรีไทร์เรียร์การ์ดเกรด 2 หรือสูงกว่าของคู่แข่ง 1 ใบ' },
            { name: 'Majesty Lord Blaster', grade: 3, power: 13000, persona: true, skill: '[CONT](VC): หากในโซลมี "Blaster Blade" และ "Blaster Dark" ยูนิทนี้ได้รับ พลัง+2000/คริติคอล+1 (ทำงานในเทิร์นคู่แข่งด้วย)\n[AUTO](VC): เมื่อโจมตีแวนการ์ด สามารถเลือกทำอย่างใดอย่างหนึ่งดังนี้\n・[นำ "Blaster Blade" จาก (RC) เข้าโซล] เลือกรีไทร์เรียร์การ์ดคู่แข่ง 1 ใบ และยูนิทนี้พลัง +10000\n・[นำ "Blaster Dark" จาก (RC) เข้าโซล] ยูนิทนี้ได้รับพลัง +10000/ไดร์ฟ+1 จนจบเทิร์น' }
        ],
        mainDeck: [
            ...Array(3).fill({ name: 'Majesty Lord Blaster', grade: 3, power: 13000, persona: true, skill: '[CONT](VC): หากในโซลมี "Blaster Blade" และ "Blaster Dark" ยูนิทนี้ได้รับ พลัง+2000/คริติคอล+1 (ทำงานในเทิร์นคู่แข่งด้วย)\n[AUTO](VC): เมื่อโจมตีแวนการ์ด สามารถเลือกทำอย่างใดอย่างหนึ่งดังนี้\n・[นำ "Blaster Blade" จาก (RC) เข้าโซล] เลือกรีไทร์เรียร์การ์ดคู่แข่ง 1 ใบ และยูนิทนี้พลัง +10000\n・[นำ "Blaster Dark" จาก (RC) เข้าโซล] ยูนิทนี้ได้รับพลัง +10000/ไดร์ฟ+1 จนจบเทิร์น' }),
            ...Array(3).fill({ name: 'Blaster Blade', grade: 2, power: 10000, shield: 5000, skill: '[AUTO]: เมื่อวางบน (VC) [CB1] เลือกรีไทร์เรียร์การ์ดคู่แข่ง 1 ใบ หากไม่รีไทร์ จั่วการ์ด 1 ใบ\n[AUTO]: เมื่อวางบน (RC) [CB1] เลือกรีไทร์เรียร์การ์ดเกรด 2 หรือสูงกว่าของคู่แข่ง 1 ใบ' }),
            ...Array(4).fill({ name: 'Blaster Dark', grade: 2, power: 10000, shield: 5000, skill: '[AUTO](VC/RC): [CB1 & Retire 1 another RG] เลือกรีไทร์เรียร์การ์ดคู่แข่ง 1 ใบ และยูนิทนี้ได้รับไดร์ฟ+1 จนจบเทิร์น\n[CONT](RC): ในเทิร์นของคุณ หากมีเรียร์การ์ดของคุณถูกรีไทร์ในเทิร์นนี้ พลัง+5000' }),
            ...Array(4).fill({ name: 'Knight of Inheritance, Emmeline', grade: 2, power: 10000, shield: 5000, skill: '[AUTO]: เมื่อลง (RC) จากบนมือ [SB1] ดู 5 ใบ เลือก "Blaster" 1 ใบ คอลลง (RC) หรือนำขึ้นมือแล้วทิ้งการ์ด 1 ใบ\n[AUTO](RC): เมื่อยูนิทที่มีชื่อ "Blaster" ของคุณโจมตี ยูนิทนี้พลัง +5000 จนจบเทิร์น' }),
            ...Array(4).fill({ name: 'Palladium Zeal Dragon (PG)', grade: 1, power: 8000, shield: 0, isPG: true, skill: '[Sentinel] (Perfect Guard)\n[AUTO]: เมื่อยูนิทนี้เข้าสู่ G เลือกยูนิทคุณ 1 ใบ ยูนิทนั้นไม่ถูกฮิตจนจบการต่อสู้ ถ้าคุณมีการ์ดในมือตั้งแต่ 2 ใบขึ้นไป ทิ้งการ์ด 1 ใบ' }),
            ...Array(4).fill({ name: 'Ordeal Dragon', grade: 1, power: 8000, shield: 5000, skill: '[CONT](RC): ในเทิร์นของคุณ หากมี "Blaster Blade" และ "Blaster Dark" ในโซล พลัง+5000\n[AUTO](RC): เมื่อจบการต่อสู้ที่ยูนิทนี้โจมตีหรือบูสต์ [นำยูนิทนี้เข้าโซล] ดูการ์ด 7 ใบจากบนกอง เลือก "Blaster" 1 ใบขึ้นมือและสับกอง' }),
            ...Array(4).fill({ name: 'Knight of Old Fate, Cordiela', grade: 1, power: 8000, shield: 5000, skill: '[CONT] Back Row Center (RC): หากแวนการ์ดคือ "Majesty Lord Blaster" จะได้รับ\n・[AUTO](RC): เมื่อบูสต์เสร็จ [CB1] คอล Blade และ Dark จากโซลลงคอลัมน์เดียวกัน\n・[CONT](RC): หากแวนคู่แข่ง G3+ เรียร์การ์ด G2 ทั้งหมดของคุณได้รับ "Boost"' }),
            ...Array(2).fill({ name: 'Painkiller Angel', grade: 1, power: 8000, shield: 5000, skill: '[AUTO](RC): เมื่อจบการต่อสู้ที่ยูนิทนี้บูสต์ [SB1 & Retire ตัวเอง] จั่วการ์ด 1 ใบ' }),
            ...Array(2).fill({ name: 'Departure Towards the Dawn', grade: 1, power: 0, shield: 0, skill: '[Order]: [CB1] ดูการ์ด 5 ใบจากบนกอง เลือก "Blaster" 1 ใบขึ้นมือและสับกอง' }),
            ...Array(8).fill({ name: 'Critical Trigger (Keter)', grade: 0, power: 5000, shield: 15000, trigger: 'Critical' }),
            ...Array(3).fill({ name: 'Front Trigger (Keter)', grade: 0, power: 5000, shield: 15000, trigger: 'Front' }),
            ...Array(4).fill({ name: 'Heal Trigger (Keter)', grade: 0, power: 5000, shield: 15000, trigger: 'Heal' }),
            { name: 'Light Dragon Deity of Honors, Amartinoa', grade: 0, power: 5000, shield: 50000, trigger: 'Over', overPower: '100 Million' }
        ].sort(() => 0.5 - Math.random())
    };

    const avantgardaDeck = {
        rideDeck: [
            { name: 'Blue Deathster, Sora Period', grade: 0, power: 6000, shield: 10000, skill: '[AUTO]: เมื่อถูกไรด์ทับ ถ้าคุณเริ่มเป็นคนที่สอง จั่วการ์ด 1 ใบ' },
            { name: 'Blue Deathster, "Dark Verdict" Findanis', grade: 1, power: 8000, shield: 5000, skill: '[AUTO]: เมื่อถูกไรด์ทับโดย "Heavenly Death Ray" Stelvane ค้นหา Strategy 1 ใบจากในกองขึ้นมือ\n[CONT](RC): เมื่อยูนิทนี้บูสต์ ถ้ามี Strategy Card ถูกเข้าโซล(ใช้งาน)ในเทิร์นนี้ พลัง+5000' },
            { name: 'Blue Deathster, "Heavenly Death Ray" Stelvane', grade: 2, power: 10000, shield: 5000, skill: '[AUTO]: เมื่อถูกไรด์ทับโดย "Skyrender" Avantgarda ค้นหา Strategy 1 ใบจากในกองขึ้นมือ\n[AUTO](RC): เมื่อโจมตี ถ้ามี Strategy Card ถูกเข้าโซล(ใช้งาน)ในเทิร์นนี้ พลัง+5000' },
            { name: 'Blue Deathster, "Skyrender" Avantgarda', grade: 3, power: 13000, persona: true, skill: '[ACT](VC)[1/Turn]: หากในโซลมี "Blue Deathster, Sora Period" [เลือก Strategy 1 ใบจาก Order Zone เข้าโซล] จั่วการ์ด 1 ใบ แวนการ์ดพลัง+5000 และได้รับความสามารถ\n"[AUTO](VC)[1/Turn]: เมื่อจบการโจมตี หากโจมตีฮิตแวนการ์ด หรือทำ Persona Ride [CB1 & ทิ้งมือ 1 ใบ] Stand และไดรฟ์-1"' }
        ],
        mainDeck: [
            ...Array(4).fill({ name: 'Blue Deathster, "Skyrendriver" Avantgarda Richter', grade: 3, power: 13000, persona: true, skill: '[ACT](Hand): หากแวนคู่แข่งเกรด 3+ [เผยการ์ดนี้ & ไบนด์ "Skyrender" Avantgarda จาก (VC)] ไรด์ Stand และได้รับ [ACT] ของใบที่ถูกไบนด์\n[AUTO](VC): จบการบุก หากโซลมี "Sora Period" [ทิ้งมือ 2 ใบ] ไรด์ "Skyrender" Avantgarda จากไบนด์แบบ Stand, พลัง+10000 และ ไดรฟ์-1' }),
            ...Array(3).fill({ name: 'Blue Deathster, "Skyrender" Avantgarda', grade: 3, power: 13000, persona: true, skill: '[ACT](VC)[1/Turn]: หากในโซลมี "Blue Deathster, Sora Period" [เลือก Strategy 1 ใบจาก Order Zone เข้าโซล] จั่วการ์ด 1 ใบ แวนการ์ดพลัง+5000 และได้รับความสามารถ\n"[AUTO](VC)[1/Turn]: เมื่อจบการโจมตี หากโจมตีฮิตแวนการ์ด หรือทำ Persona Ride [CB1 & ทิ้งมือ 1 ใบ] Stand และไดรฟ์-1"' }),
            ...Array(3).fill({ name: 'Shock Strategy: Death Winds', grade: 3, power: 0, shield: 0, skill: '[Set Order] (Strategy)\n[AUTO]: เมื่อถูกนำเข้าโซลจาก Order Zone หากแวนการ์ดคู่แข่งระดับ 3 หรือสูงกว่า เลือกแวนการ์ด 1 ใบ "เมื่อโจมตี พลังแถวหน้าทั้งหมด +5000 จนจบเทิร์น"' }),
            ...Array(4).fill({ name: 'Ala Dargente', grade: 2, power: 10000, shield: 5000, skill: '[AUTO](RC): เมื่อแวนการ์ด "Avantgarda" ของคุณโจมตี ยูนิทนี้ได้รับ พลัง+5000 จนจบเทิร์น\n[AUTO]: เมื่อวางบน (RC) [SB1] ค้นหา Strategy Card ที่ชื่อไม่ซ้ำกับที่เพิ่งใส่โซลจากกองหรือดรอปนำขึ้นมือ 1 ใบ' }),
            ...Array(3).fill({ name: 'Sickle Blade of Inquest, Habitable Zone', grade: 2, power: 10000, shield: 5000, skill: '[AUTO]: เมื่อถูกทิ้งจากมือลงช่องดรอปใน Ride Phase [SB1 & นำการ์ดใบนี้เข้าใต้กอง] จั่วการ์ด 1 ใบ' }),
            ...Array(1).fill({ name: 'Bomber Strategy: Dusting', grade: 2, power: 0, shield: 0, skill: '[Set Order] (Strategy)\n(เข้าโซลเมื่อประกาศใช้งานจากแวนการ์ด)\n[AUTO]: เมื่อถูกส่งเข้าโซลจาก Order Zone แวนการ์ดคุณได้รับพลัง+10000 จนจบเทิร์น และคู่แข่งไม่สามารถอินเตอร์เซปต์หรือเล่น Blitz Order ได้' }),
            ...Array(4).fill({ name: 'Automated Belstul (Perfect Guard)', grade: 1, power: 8000, shield: 0, isPG: true, skill: '[Sentinel] (Perfect Guard)\n[AUTO]: เมื่อยูนิทนี้เข้าสู่ G เลือกยูนิทคุณ 1 ใบ ยูนิทนั้นไม่ถูกฮิตจนจบการต่อสู้ ถ้าคุณมีการ์ดในมือตั้งแต่ 2 ใบขึ้นไป ทิ้งการ์ด 1 ใบ' }),
            ...Array(3).fill({ name: 'Blue Deathster, Asagi Milestone', grade: 1, power: 8000, shield: 5000, skill: '[AUTO]: เมื่อวางบน (RC) หากแวนการ์ดมีชื่อ "Blue Deathster" หรือ "Avantgarda" [CB1] เลือกการ์ด "Avantgarda" เกรด 3 หรือสูงกว่าจากช่องดรอป 1 ใบขึ้นมือ\n[CONT](RC): หาก Strategy Card ถูกใส่เข้าโซลในเทิร์นนี้ ยูนิทนี้ได้รับพลัง+5000' }),
            ...Array(4).fill({ name: 'Blue Deathster, Hanada Halfway', grade: 1, power: 8000, shield: 5000, skill: '[AUTO]: เมื่อวางบน (RC) หากแวนการ์ดมีชื่อ "Blue Deathster" หรือ "Avantgarda" [CB1] จั่วการ์ด 1 ใบ\n[AUTO](RC): เมื่อบูสต์ ถ้าวาง Strategy ลง Order Zone ในเทิร์นนี้ พลัง+2000(จนจบแบตเทิล) และถ้าอยู่ช่องหลังสุดแถวกลาง ได้รับ [CC1]' }),
            ...Array(1).fill({ name: 'Disruption Strategy: Killshroud', grade: 1, power: 0, shield: 0, skill: '[Set Order] (Strategy)\n[AUTO]: เมื่อถูกนำเข้าโซลจาก Order Zone เลือกเรียร์การ์ดคู่แข่ง 1 ใบรีไทร์ และแวนการ์ดพลัง+5000 จนจบเทิร์น' }),
            ...Array(8).fill({ name: 'Critical Trigger (Brandt Gate)', grade: 0, power: 5000, shield: 15000, trigger: 'Critical' }),
            ...Array(3).fill({ name: 'Draw Trigger (Brandt Gate)', grade: 0, power: 5000, shield: 5000, trigger: 'Draw' }),
            ...Array(4).fill({ name: 'Heal Trigger (Brandt Gate)', grade: 0, power: 5000, shield: 15000, trigger: 'Heal' }),
            { name: 'Star Dragon Deity of Infinitude, Eldobreath', grade: 0, power: 5000, shield: 50000, trigger: 'Over', overPower: '100 Million' }
        ].sort(() => 0.5 - Math.random())
    };


    let currentDeck = bruceDeck;

    // --- Helper Functions ---
    function updateHandSpacing() {
        const cardsInHand = playerHand.querySelectorAll('.card');
        cardsInHand.forEach(c => {
            c.style.position = 'relative';
            c.style.transform = 'none';
        });
        updateHandCount();
    }

    function updateHandCount() {
        if (handCountNum) handCountNum.textContent = playerHand.querySelectorAll('.card').length;
    }

    function updateSoulUI() {
        if (soulPool.length > 0) {
            soulCounter.classList.remove('hidden');
            soulCounter.textContent = `Soul: ${soulPool.length}`;
        } else {
            soulCounter.classList.add('hidden');
        }
        syncCounts();
    }

    function syncCounts() {
        if (!conn) return;
        const myDamage = document.querySelectorAll('.my-side .damage-zone .card').length;
        const myDrop = document.querySelectorAll('.my-side .drop-zone .card').length;
        const myHand = playerHand.querySelectorAll('.card').length;
        const mySoul = soulPool.length;
        const myDeck = deckPool.length;

        const myOrder = document.querySelectorAll('.my-side .order-zone .card').length;

        // Update local quick view
        const qDrop = document.getElementById('quick-drop-num');
        const qDamage = document.getElementById('quick-damage-num');
        const qOrder = document.getElementById('quick-order-num');
        if (qDrop) qDrop.textContent = myDrop;
        if (qDamage) qDamage.textContent = myDamage;
        if (qOrder) qOrder.textContent = myOrder;

        sendData({
            type: 'syncCounts',
            damage: myDamage,
            drop: myDrop,
            hand: myHand,
            soul: mySoul,
            soulCards: soulPool.map(c => ({
                name: c.dataset.name,
                grade: c.dataset.grade,
                power: c.dataset.power,
                shield: c.dataset.shield,
                skill: c.dataset.skill
            })),
            order: myOrder,
            deck: myDeck
        });
    }

    function updateDropCount() {
        const count = document.querySelectorAll('.player-side.my-side .drop-zone .card').length;
        if (dropCountNum) dropCountNum.textContent = count;
        syncCounts();
    }

    function updateDamageCount() {
        const count = document.querySelectorAll('.player-side.my-side .damage-zone .card').length;
        if (damageCountNum) damageCountNum.textContent = count;
        syncCounts();
    }

    function updateGCShield() {
        const gc = document.querySelector('.guardian-circle');
        const display = document.getElementById('gc-shield-display');
        if (!gc || !display) return;

        let total = 0;
        gc.querySelectorAll('.card').forEach(c => {
            total += parseInt(c.dataset.shield || "0");
        });
        display.textContent = `Shield: ${total}`;
    }

    function updateDeckCounter() {
        if (deckCountNum) deckCountNum.textContent = deckPool.length;

        const deckZones = document.querySelectorAll('.deck-zone');
        deckZones.forEach(zone => {
            const count = (zone.dataset.zone === 'deck' && zone.id === 'main-deck') ? deckPool.length : 40;
            const shadowSize = Math.ceil(count / 5);
            let shadowStr = "";
            for (let i = 1; i <= shadowSize; i++) {
                shadowStr += `0 ${i * 2}px 0 ${i % 2 === 0 ? '#111' : '#222'}${i === shadowSize ? '' : ','}`;
            }
            zone.style.boxShadow = shadowStr || 'none';
        });
        syncCounts();
    }

    function soulCharge(count = 1) {
        for (let i = 0; i < count; i++) {
            if (deckPool.length > 0) {
                const cardData = deckPool.pop();
                const card = createCardElement(cardData);
                soulPool.push(card);
            }
        }
        updateSoulUI();
        updateDeckCounter();
    }

    function promptSoulCall(targetZoneName, onComplete, isOptional = true) {
        if (soulPool.length === 0) {
            alert("Soul is empty, skipping Call.");
            if (onComplete) onComplete();
            return;
        }

        viewerTitle.textContent = isOptional ? "Choose a card to Call (Optional)" : "Choose a card to Call (Mandatory)";
        viewerGrid.innerHTML = '';
        zoneViewer.classList.remove('hidden');

        // Only show "Skip" if the source effect is optional
        if (isOptional) {
            const skipCard = document.createElement('div');
            skipCard.className = 'card';
            skipCard.style.cursor = 'pointer';
            skipCard.style.display = 'flex';
            skipCard.style.flexDirection = 'column';
            skipCard.style.justifyContent = 'center';
            skipCard.style.alignItems = 'center';
            skipCard.style.background = 'rgba(255,255,255,0.05)';
            skipCard.style.border = '1px dashed #666';
            skipCard.innerHTML = `<div style="font-size: 0.8rem; text-align: center; color: #888;">SKIP<br>CALL</div>`;
            skipCard.onclick = () => {
                zoneViewer.classList.add('hidden');
                if (onComplete) onComplete();
            };
            viewerGrid.appendChild(skipCard);
        }

        soulPool.forEach((soulCard, index) => {
            const clone = soulCard.cloneNode(true);
            clone.classList.remove('dragging', 'rest', 'opponent-card');
            clone.style.position = 'relative';
            clone.style.cursor = 'pointer';

            clone.onclick = async () => {
                const targetCircle = document.querySelector(`.my-side .circle[data-zone="${targetZoneName}"]`);
                if (targetCircle) {
                    const actualCard = soulPool.splice(index, 1)[0];
                    const existing = targetCircle.querySelector('.card:not(.opponent-card)');
                    if (existing) {
                        const dropZone = document.querySelector('.my-side .drop-zone');
                        dropZone.appendChild(existing);
                        existing.classList.remove('rest');
                        sendMoveData(existing);
                    }
                    targetCircle.appendChild(actualCard);
                    actualCard.classList.remove('rest');
                    actualCard.style.transform = 'none';
                    sendMoveData(actualCard);
                    updateSoulUI();
                    updateDropCount();
                    await checkOnPlaceAbilities(actualCard);
                }
                zoneViewer.classList.add('hidden');
                if (onComplete) onComplete();
            };
            viewerGrid.appendChild(clone);
        });
    }

    async function promptRetireToSoulForDraw(onComplete) {
        const rearGuards = document.querySelectorAll('.my-side .circle.rc .card:not(.opponent-card)');
        if (rearGuards.length === 0) {
            alert("No Rear-guards to pay for Richard's ability!");
            if (onComplete) onComplete();
            return;
        }

        if (await vgConfirm("Use Richard's ability? Cost: Put 1 Rear-guard into Soul to draw 1 card.")) {
            alert("Select a Rear-guard to put into Soul.");
            document.body.classList.add('targeting-mode');

            const costListener = (e) => {
                const card = e.target.closest('.card');
                if (card && card.parentElement && card.parentElement.classList.contains('rc') && !card.classList.contains('opponent-card')) {
                    e.stopPropagation();
                    soulPool.push(card);
                    // Send move data to notify opponent card is entering soul
                    sendData({ type: 'moveCard', cardId: card.id, zone: 'soul', cardName: card.dataset.name });
                    card.remove();
                    updateSoulUI();
                    drawCard(true);
                    document.body.classList.remove('targeting-mode');
                    document.removeEventListener('click', costListener, true);
                    alert("Richard: Cost paid! Drew 1 card.");
                    sendData({ type: 'syncCounts', soul: soulPool.length, hand: playerHand.childElementCount });
                    if (onComplete) onComplete();
                }
            };
            document.addEventListener('click', costListener, true);
        } else {
            if (onComplete) onComplete();
        }
    }

    function resolveAbilityQueue(queue) {
        return new Promise(resolveAll => {
            if (!queue || queue.length === 0) {
                resolveAll();
                return;
            }

            if (queue.length === 1) {
                queue[0].resolve(() => {
                    resolveAll();
                });
                return;
            }

            viewerTitle.textContent = "Select ability resolution order";
            viewerGrid.innerHTML = '';
            zoneViewer.classList.remove('hidden');

            queue.forEach((ability, index) => {
                const tile = document.createElement('div');
                tile.className = 'card';
                tile.style.position = 'relative';
                tile.style.cursor = 'pointer';
                tile.style.display = 'flex';
                tile.style.flexDirection = 'column';
                tile.style.justifyContent = 'center';
                tile.style.alignItems = 'center';
                tile.style.textAlign = 'center';
                tile.style.padding = '10px';
                tile.style.background = 'rgba(255, 42, 109, 0.1)';
                tile.style.border = '2px solid var(--accent-vanguard)';

                tile.innerHTML = `
                <div style="font-weight:bold; color:white; margin-bottom:5px; font-size:0.9rem;">${ability.name}</div>
                <div style="font-size:0.65rem; color:#aaa;">${ability.description}</div>
            `;

                tile.onclick = () => {
                    zoneViewer.classList.add('hidden');
                    ability.resolve(() => {
                        const nextQueue = queue.filter((_, i) => i !== index);
                        // Using thenable or async recursion
                        resolveAbilityQueue(nextQueue).then(resolveAll);
                    });
                };
                viewerGrid.appendChild(tile);
            });
        });
    }

    async function checkRideAbilities(oldVanguard, newCard, discardedCard = null) {
        const queue = [];
        const oldName = oldVanguard ? (oldVanguard.dataset.name || "").toLowerCase() : "";
        const newName = (newCard.dataset.name || "").toLowerCase();

        // 0. Discarded Card Abilities (e.g. Habitable Zone)
        if (discardedCard) {
            const discName = (discardedCard.dataset.name || "").toLowerCase();
            if (discName.includes('habitable zone')) {
                queue.push({
                    name: 'Habitable Zone: [AUTO]',
                    description: "เมื่อถูกทิ้งเพื่อไรด์ [SB1 & นำการ์ดนี้เข้าใต้กอง] เพื่อจั่วการ์ด 1 ใบ",
                    resolve: async (done) => {
                        if (await vgConfirm("Habitable Zone: [SB1 & นำการ์ดนี้เข้าใต้กอง] เพื่อจั่วการ์ด 1 ใบ?")) {
                            if (await paySoulBlast(1)) {
                                const cardData = JSON.parse(discardedCard.dataset.cardData || "{}");
                                deckPool.unshift(cardData);
                                discardedCard.remove();
                                updateDeckCounter();
                                drawCard(1);
                                alert("Habitable Zone: นำเข้าใต้กองและจั่วการ์ด 1 ใบสำเร็จ!");
                                sendMoveData(discardedCard, 'deck');
                                updateAllStaticBonuses();
                            }
                        }
                        if (done) done();
                    }
                });
            }
        }

        // 1. Universal Grade 0 "Go Second" Skill
        // We check grade 0 of the OLD vanguard being ridden over.
        if (oldVanguard && (parseInt(oldVanguard.dataset.grade) === 0 || oldVanguard.dataset.name.toLowerCase().includes('starter') || oldVanguard.dataset.name.toLowerCase().includes('egg'))) {
            // Priority check for second player status
            if (isFirstPlayer === false || window.isFirstPlayer === false) {
                queue.push({
                    name: 'โบนัสคนเริ่มหลัง (Starter Bonus)',
                    description: "จั่วการ์ด 1 ใบเพราะได้เริ่มคนที่สอง",
                    resolve: (done) => {
                        console.log("Starter Bonus triggered for Player 2");
                        alert("Starter Bonus: คุณได้เริ่มเป็นคนที่สอง! จั่วการ์ด 1 ใบ");
                        drawCard(true);
                        if (done) done();
                    }
                });
            }
        }

        // 2. Bruce Ride Line Specifics (When Placed on VC)
        // G1 Steve
        if (newName.includes('steve')) {
            queue.push({
                name: 'ความสามารถของ Steve (G1)',
                description: "เลือกการ์ด 1 ใบจากโซลเพื่อคอลลงช่องแถวหลังตรงกลาง และทำการ Soul Charge 1",
                resolve: (done) => {
                    if (soulPool.length === 0) {
                        alert("ไม่มีการ์ดในโซล! ทำการ Soul Charge 1 เท่านั้น");
                        soulCharge(1);
                        if (done) done();
                        return;
                    }

                    viewerTitle.textContent = "เลือการ์ด 1 ใบจากโซลเพื่อคอล (บังคับลงแถวหลังตรงกลาง)";
                    viewerGrid.innerHTML = '';
                    zoneViewer.classList.remove('hidden');

                    soulPool.forEach((soulCard, index) => {
                        const clone = soulCard.cloneNode(true);
                        clone.classList.remove('dragging', 'rest', 'opponent-card');
                        clone.style.position = 'relative';
                        clone.style.cursor = 'pointer';

                        clone.onclick = (e) => {
                            e.stopPropagation();
                            const targetCircle = document.querySelector('.my-side .circle[data-zone="rc_back_center"]');
                            if (targetCircle) {
                                // 1. Move card from soul to target
                                const actualCard = soulPool.splice(index, 1)[0];
                                const existing = targetCircle.querySelector('.card:not(.opponent-card)');
                                if (existing) {
                                    const dropZone = document.querySelector('.my-side .drop-zone');
                                    dropZone.appendChild(existing);
                                    existing.classList.remove('rest');
                                    sendMoveData(existing);
                                }
                                targetCircle.appendChild(actualCard);
                                actualCard.classList.remove('rest');
                                actualCard.style.transform = 'none';
                                sendMoveData(actualCard);
                                updateSoulUI();
                                updateDropCount();

                                alert("คอลยูนิทลงช่องกลางแถวหลังแล้ว!");

                                // 2. Perform Soul Charge 1
                                console.log("Steve: Performing Soul Charge...");
                                soulCharge(1);
                                alert("ทำการ Soul Charge 1 เรียบร้อยแล้ว!");
                            }

                            zoneViewer.classList.add('hidden');
                            if (done) done();
                        };
                        viewerGrid.appendChild(clone);
                    });
                }
            });
        }

        // G2 Richard
        if (newName.includes('richard')) {
            queue.push({
                name: 'ความสามารถของ Richard (G2)',
                description: "[คอสต์: นำเรียร์การ์ด 1 ใบเข้าสู่โซล] เพื่อจั่วการ์ด 1 ใบ",
                resolve: async (done) => {
                    if (await vgConfirm("Richard Skill: [คอสต์: นำเรียร์การ์ด 1 ใบเข้าสู่โซล] เพื่อจั่วการ์ด 1 ใบ?")) {
                        promptRichardVC(done);
                    } else {
                        if (done) done();
                    }
                }
            });
        }

        // 3. Nirvana Jheva Ride Line Specifics
        // G0 Sunrise Egg -> G1 Rino
        if (oldName.includes('sunrise egg') && newName.includes('rino')) {
            // Drawn by Universal Grade 0 skill above if guest.
        }

        // G1 Rino -> G2 Reiyu
        if (oldName.includes('rino') && newName.includes('reiyu')) {
            queue.push({
                name: 'ความสามารถของ Rino (G1)',
                description: "ค้นหา Trickstar 1 ใบจากกองการ์ดคอลลง (RC)",
                resolve: async (done) => {
                    const confirmSearch = await vgConfirm("Rino Skill: ค้นหา Trickstar 1 ใบจากกองคอลลง (RC)?");
                    if (confirmSearch) {
                        promptSearchAndCall('Trickstar');
                    }
                    done();
                }
            });
        }

        // G2 Reiyu -> G3 Nirvana Jheva
        if (oldName.includes('reiyu') && newName.includes('nirvana jheva')) {
            queue.push({
                name: 'ความสามารถของ Reiyu (G2)',
                description: "ดูการ์ด 7 ใบจากบนสุดของกอง เลือก <Prayer Dragon> 1 ใบขึ้นมือ",
                resolve: async (done) => {
                    const confirmLook = await vgConfirm("Reiyu Skill: ดูการ์ด 7 ใบ เลือก Prayer Dragon (Equip Dragon) ขึ้นมือ?");
                    if (confirmLook) {
                        promptLookTop7ForPrayerDragon();
                    }
                    done();
                }
            });
        }

        // 4. Avantgarda Ride Line Specifics
        if (oldName.includes('findanis') && newName.includes('stelvane')) {
            queue.push({
                name: 'Findanis (G1) Ability',
                description: "ถ้าในโซลมี Sora Period ค้นหาเกรด 1 Strategy หากไม่เอาหรือหาไม่เจอ คอล Findanis ลง RC",
                resolve: async (done) => {
                    const hasSora = soulPool.some(c => c.dataset.name.includes('Sora Period'));
                    if (hasSora) {
                        if (await vgConfirm("Findanis: ค้นหาเกรด 1 Strategy ขึ้นมือ? (หากไม่เอา/ไม่เจอ จะได้คอลใบนี้ลง RC)")) {
                            let found = false;
                            const matches = deckPool.filter(c => c.name.includes("Strategy") && parseInt(c.grade) === 1);
                            if (matches.length > 0) {
                                openViewer("Select 1 Grade 1 Strategy", matches);
                                await new Promise(res => {
                                    const sel = (e) => {
                                        const clicked = e.target.closest('.card');
                                        if (clicked && clicked.parentElement === viewerGrid) {
                                            const tName = clicked.dataset.name;
                                            const idx = deckPool.findIndex(c => c.name === tName);
                                            if (idx !== -1) {
                                                const cardData = deckPool.splice(idx, 1)[0];
                                                const cardElem = createCardElement(cardData);
                                                playerHand.appendChild(cardElem);
                                                updateHandSpacing();
                                                sendMoveData(cardElem);
                                                updateDeckCounter();
                                                alert(`นำ ${cardData.name} ขึ้นมือ!`);
                                                found = true;
                                                zoneViewer.classList.add('hidden');
                                                viewerGrid.removeEventListener('click', sel);
                                                res();
                                            }
                                        }
                                    };
                                    viewerGrid.addEventListener('click', sel);
                                    closeViewerBtn.onclick = () => { zoneViewer.classList.add('hidden'); res(); };
                                });
                            }
                            if (!found) {
                                alert("ไม่พบ Strategy: เลือกคอล Findanis จากโซลลง RC");
                                promptCallSpecificFromSoul(oldVanguard);
                            }
                        } else {
                            promptCallSpecificFromSoul(oldVanguard);
                        }
                    }
                    done();
                }
            });
        }
        if (oldName.includes('stelvane') && (newName.includes('avantgarda'))) {
            queue.push({
                name: 'Stelvane (G2) Ability',
                description: "ถ้าในโซลมี Sora Period ค้นหาเกรด 2 Strategy หากไม่เอาหรือหาไม่เจอ คอล Stelvane ลง RC",
                resolve: async (done) => {
                    const hasSora = soulPool.some(c => c.dataset.name.includes('Sora Period'));
                    if (hasSora) {
                        if (await vgConfirm("Stelvane: ค้นหาเกรด 2 Strategy ขึ้นมือ? (หากไม่เอา/ไม่เจอ จะได้คอลใบนี้ลง RC)")) {
                            let found = false;
                            const matches = deckPool.filter(c => c.name.includes("Strategy") && parseInt(c.grade) === 2);
                            if (matches.length > 0) {
                                openViewer("Select 1 Grade 2 Strategy", matches);
                                await new Promise(res => {
                                    const sel = (e) => {
                                        const clicked = e.target.closest('.card');
                                        if (clicked && clicked.parentElement === viewerGrid) {
                                            const tName = clicked.dataset.name;
                                            const idx = deckPool.findIndex(c => c.name === tName);
                                            if (idx !== -1) {
                                                const cardData = deckPool.splice(idx, 1)[0];
                                                const cardElem = createCardElement(cardData);
                                                playerHand.appendChild(cardElem);
                                                updateHandSpacing();
                                                sendMoveData(cardElem);
                                                updateDeckCounter();
                                                alert(`นำ ${cardData.name} ขึ้นมือ!`);
                                                found = true;
                                                zoneViewer.classList.add('hidden');
                                                viewerGrid.removeEventListener('click', sel);
                                                res();
                                            }
                                        }
                                    };
                                    viewerGrid.addEventListener('click', sel);
                                    closeViewerBtn.onclick = () => { zoneViewer.classList.add('hidden'); res(); };
                                });
                            }
                            if (!found) {
                                alert("ไม่พบ Strategy: เลือกคอล Stelvane จากโซลลง RC");
                                promptCallSpecificFromSoul(oldVanguard);
                            }
                        } else {
                            promptCallSpecificFromSoul(oldVanguard);
                        }
                    }
                    done();
                }
            });
        }

        // 4. Majesty Lord Blaster Ride Line
        // Maron (G1) override by Blaster G2
        if (oldName.includes('maron') && newName.includes('blaster')) {
            queue.push({
                name: 'ความสามารถของ Maron (G1)',
                description: "ดูการ์ด 7 ใบจากบนสุดของกอง เลือกเกรด 2 ที่มีคำว่า 'Blaster' ขึ้นมือ หากไม่เจอคอล Wingul Brave จากโซล",
                resolve: async (done) => {
                    if (await vgConfirm("Maron Skill: ดูการ์ด 7 ใบ เลือกเกรด 2 'Blaster' ขึ้นมือ?")) {
                        promptMajestyLookTop7(done);
                    } else {
                        if (done) done();
                    }
                }
            });
        }

        // Blaster Blade (G2) on VC
        if (newName === 'blaster blade') {
            queue.push({
                name: 'ความสามารถของ Blaster Blade (VC)',
                description: "[CB1] รีไทร์เรียร์การ์ดคู่แข่ง 1 ใบ หากไม่รีไทร์ จั่วการ์ด 1 ใบ",
                resolve: async (done) => {
                    if (await vgConfirm("Blaster Blade Skill: [CB1] รีไทร์เรียร์การ์ดคู่แข่ง 1 ใบ?")) {
                        if (payCounterBlast(1)) {
                            promptMajestyRetireOrDraw(done);
                        } else {
                            if (done) done();
                        }
                    } else {
                        if (done) done();
                    }
                }
            });
        }

        // 3. Magnolia Ride Line
        // Magnolia Elder (G4)
        if (newName.includes('elder')) {
            queue.push({
                name: 'Magnolia Elder [AUTO]',
                description: "เลือกการ์ด 1 ใบจากโซล คอลลง (RC)",
                resolve: async (done) => {
                    if (soulPool.length === 0) {
                        alert("ไม่มีการ์ดในโซล!");
                        if (done) done();
                        return;
                    }

                    if (await vgConfirm("Magnolia Elder Skill: คอลการ์ด 1 ใบจากโซลลง (RC)?")) {
                        viewerTitle.textContent = "เลือกการ์ด 1 ใบจากโซลเพื่อคอล";
                        viewerGrid.innerHTML = '';
                        zoneViewer.classList.remove('hidden');

                        soulPool.forEach((soulCard, index) => {
                            const clone = soulCard.cloneNode(true);
                            clone.classList.remove('dragging', 'rest', 'opponent-card');
                            clone.style.position = 'relative';
                            clone.style.cursor = 'pointer';

                            clone.onclick = (e) => {
                                e.stopPropagation();
                                alert("คลิกที่วงกลม (RC) ที่ว่างอยู่เพื่อคอลยูนิท");
                                zoneViewer.classList.add('hidden');
                                document.body.classList.add('targeting-mode');

                                const soulCallListener = (ev) => {
                                    const circle = ev.target.closest('.circle.rc');
                                    if (circle) {
                                        ev.stopPropagation();
                                        const actualCard = soulPool.splice(index, 1)[0];
                                        const existing = circle.querySelector('.card:not(.opponent-card)');
                                        if (existing) {
                                            const dropZone = document.querySelector('.my-side .drop-zone');
                                            dropZone.appendChild(existing);
                                            existing.classList.remove('rest');
                                            sendMoveData(existing);
                                        }
                                        circle.appendChild(actualCard);
                                        actualCard.classList.remove('rest');
                                        actualCard.style.transform = 'none';
                                        sendMoveData(actualCard);
                                        updateSoulUI();
                                        updateDropCount();
                                        applyStaticBonuses(actualCard);
                                        document.body.classList.remove('targeting-mode');
                                        document.removeEventListener('click', soulCallListener, true);
                                        if (done) done();
                                    }
                                };
                                document.addEventListener('click', soulCallListener, true);
                            };
                            viewerGrid.appendChild(clone);
                        });
                    } else {
                        if (done) done();
                    }
                }
            });
        }

        // 5. Discarded for Ride specific abilities (Generic/Placeholder infrastructure)
        if (discardedCard) {
            const discardedName = (discardedCard.dataset.name || "").toLowerCase();
            // Example: Discarded card has specific ability
            if (discardedName.includes('some_ability_card')) {
                queue.push({
                    name: `ทักษะจากการทิ้ง: ${discardedCard.dataset.name}`,
                    description: "ความสามารถเมื่อถูกทิ้งเพื่อไรด์",
                    resolve: async (done) => {
                        alert(`ใช้งานความสามารถของ ${discardedCard.dataset.name} จากการถูกทิ้ง!`);
                        // Logic here
                        done();
                    }
                });
            }
        }

        console.log(`Ability Queue built: ${queue.length} items.`);
        if (queue.length > 0) {
            return await resolveAbilityQueue(queue);
        }
    }
    function findCounterTrigger(type) {
        return deckPool.find(c => c.trigger === type);
    }



    function createCardElement(cardData) {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        // Use prefix to prevent ID collision between players
        const prefix = isHost ? 'h-' : 'g-';
        card.id = `${prefix}card-${cardIdCounter++}`;
        card.dataset.grade = cardData.grade;
        card.dataset.power = cardData.power;
        card.dataset.basePower = cardData.power;
        card.dataset.critical = cardData.critical || 1;
        card.dataset.baseCritical = card.dataset.critical;
        card.dataset.shield = cardData.shield || 0;
        card.dataset.baseShield = card.dataset.shield;
        card.dataset.trigger = cardData.trigger || '';
        card.dataset.name = cardData.name;
        card.dataset.skill = cardData.skill || 'No skill description available.';
        card.dataset.persona = cardData.persona ? "true" : "false";
        card.dataset.isPG = cardData.isPG ? "true" : "false";
        card.dataset.imageUrl = cardData.imageUrl || "";
        card.dataset.cardData = JSON.stringify(cardData);

        // Grade Reduction Helper (e.g., Winnsapooh)
        card.getEffectiveGrade = function () {
            let baseGrade = parseInt(card.dataset.grade);
            const name = (card.dataset.name || "").toLowerCase();
            if (name.includes('winnsapooh')) {
                const vg = document.querySelector('.my-side .circle.vc .card');
                if (vg) {
                    const vgGrade = parseInt(vg.dataset.grade);
                    const vgName = (vg.dataset.name || "").toLowerCase();
                    if (vgGrade >= 2 && vgName.includes('sylvan horned beast') && !vgName.includes('winnsapooh')) {
                        return Math.max(0, baseGrade - 1);
                    }
                }
            }
            return baseGrade;
        };

        const artText = cardData.name.substring(0, 3).toUpperCase();
        let triggerIcon = cardData.trigger ? `<div class="card-trigger bg-${cardData.trigger.toLowerCase()}">${cardData.trigger[0]}</div>` : '';
        let personaIcon = cardData.persona ? `<div class="card-persona">Persona</div>` : '';
        let displayPower = cardData.overPower ? '100M' : cardData.power;
        let displayCritical = parseInt(card.dataset.critical) > 1 ? `<span style="color:gold;">★${card.dataset.critical}</span>` : '';

        const cardName = (cardData.name || "").trim();
        const artUrl = cardData.imageUrl || cardImages[cardName] || '';
        card.dataset.imageUrl = artUrl; // Store for other viewers
        const artStyle = artUrl ? `style="background-image: url('${artUrl}'); background-size: cover; background-position: center;"` : '';
        const artDisplay = artUrl ? '' : artText;

        card.innerHTML = `
            <div class="card-header">
                <span class="card-grade">G${cardData.grade}</span>
                ${triggerIcon}
            </div>
            <div class="card-art" ${artStyle}>${artDisplay}</div>
            ${personaIcon}
            <div class="card-details">
                <span class="card-power">⚔️${displayPower} ${displayCritical}</span>
                <span class="card-shield">🛡️${cardData.shield || 0}</span>
            </div>
        `;

        card.title = cardData.name;

        // Long Press Logic for Skill Viewing
        let longPressTimer;
        let isLongPress = false;
        const longPressDuration = 1500; // 1.5 seconds
        let lastClickTime = 0;

        const startLongPress = (e) => {
            isLongPress = false;
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                openSkillViewer(card);
            }, longPressDuration);
        };

        const cancelLongPress = () => {
            clearTimeout(longPressTimer);
        };

        card.addEventListener('mousedown', startLongPress);
        card.addEventListener('touchstart', startLongPress, { passive: true });

        card.addEventListener('mouseup', cancelLongPress);
        card.addEventListener('mouseleave', cancelLongPress);
        card.addEventListener('touchend', cancelLongPress);
        card.addEventListener('touchmove', cancelLongPress, { passive: true });

        // Context Menu as reliable alternative for Skill Viewing
        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            openSkillViewer(card);
        });

        card.addEventListener('dragstart', (e) => {
            const inHand = card.parentElement.dataset.zone === 'hand';
            const isGrade2FrontRow = card.dataset.grade == "2" && card.parentElement.dataset.zone && card.parentElement.dataset.zone.startsWith('rc_front_');
            const isOnField = card.parentElement.classList.contains('circle');

            const parent = card.parentElement;
            const isRestricted = parent.classList.contains('drop-zone') ||
                parent.classList.contains('damage-zone') ||
                parent.classList.contains('ride-deck-zone') ||
                parent.classList.contains('order-zone');

            if (isRestricted) {
                e.preventDefault();
                return;
            }

            if (!isMyTurn) {
                if (!isGuarding) {
                    e.preventDefault();
                    return;
                } else {
                    const isElderActive = isMagnoliaElderSkillActive();
                    const isFromVC = parent.classList.contains('vc');
                    const isInterceptable = isGrade2FrontRow || (isElderActive && isOnField && !isFromVC);
                    if (!inHand && !isInterceptable) {
                        e.preventDefault();
                        return;
                    }
                }
            } else {
                if (isOnField) {
                    const currentPhase = phases[currentPhaseIndex];
                    const zone = card.parentElement.dataset.zone;
                    const isVanguard = card.parentElement.classList.contains('vc');
                    const isLeftOrRightRG = zone && (zone.includes('_left') || zone.includes('_right'));

                    // Allow moving Rear-guards during Main Phase (ONLY within the same column)
                    if (currentPhase === 'main' && !isVanguard) {
                        // Allowed
                    } else {
                        e.preventDefault();
                        return;
                    }
                }
            }
            draggedCard = card;
            setTimeout(() => card.classList.add('dragging'), 0);
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', card.id);
        });

        card.addEventListener('dragend', () => {
            if (draggedCard) draggedCard.classList.remove('dragging');
            draggedCard = null;
            updateHandCount();
        });

        card.addEventListener('click', (e) => {
            const currentTime = new Date().getTime();
            const tapGap = currentTime - lastClickTime;

            // Double click/tap for skill viewing
            if (tapGap < 350 && tapGap > 0) {
                openSkillViewer(card);
                lastClickTime = 0; // Reset
                return;
            }
            lastClickTime = currentTime;

            if (isLongPress) {
                isLongPress = false;
                return;
            }
            if (document.body.classList.contains('targeting-mode')) {
                if (card.parentElement.classList.contains('circle') && !card.classList.contains('opponent-card')) {
                    if (targetingType === 'critical') {
                        let currentCrit = parseInt(card.dataset.critical || 1);
                        card.dataset.critical = currentCrit + pendingCriticalIncrease;
                        pendingCriticalIncrease = 0;
                        alert(`+1 Critical applied to ${card.dataset.name}!`);

                        if (pendingPowerIncrease > 0) {
                            targetingType = 'power';
                            alert(`Step 2: Select a unit to receive +${pendingPowerIncrease >= 1000000 ? '100M' : pendingPowerIncrease} Power.`);
                        } else {
                            targetingType = null;
                            document.body.classList.remove('targeting-mode');
                        }
                    } else if (targetingType === 'power' || targetingType === 'both') {
                        let currentPower = parseInt(card.dataset.power);
                        card.dataset.power = currentPower + pendingPowerIncrease;

                        if (targetingType === 'both') {
                            let currentCrit = parseInt(card.dataset.critical || 1);
                            card.dataset.critical = currentCrit + pendingCriticalIncrease;
                            pendingCriticalIncrease = 0;
                        }

                        pendingPowerIncrease = 0;
                        targetingType = null;
                        document.body.classList.remove('targeting-mode');
                        alert(`Power applied to ${card.dataset.name}!`);
                    }

                    const powerSpan = card.querySelector('.card-power');
                    if (powerSpan) {
                        let displayCritical = parseInt(card.dataset.critical) > 1 ? `<span style="color:gold;">★${card.dataset.critical}</span>` : '';
                        powerSpan.innerHTML = `⚔️${parseInt(card.dataset.power) >= 100000 ? '100M' : card.dataset.power} ${displayCritical}`;
                    }

                    sendMoveData(card);
                } else if (card.classList.contains('opponent-card')) {
                    alert("You must select your own unit!");
                }
                return;
            }

            if (!isMyTurn && !isGuarding) return; // Strict turn check

            const currentPhase = phases[currentPhaseIndex];

            // TAP TO MOVE (Mobile Friendly)
            const canSelect = (isMyTurn && currentPhase !== 'battle') || isGuarding;
            if (canSelect && !card.classList.contains('opponent-card')) {
                // If a card is already selected and we tap a card ON THE FIELD, assume we want to place it in that circle, 
                // so don't steal the selection. Let it bubble to the zone listener.
                if (selectedCard && selectedCard !== card && card.parentElement && card.parentElement.classList.contains('circle')) {
                    return; // Let the event bubble to the circle listener
                }

                if (selectedCard) selectedCard.classList.remove('card-selected');

                if (selectedCard === card) {
                    selectedCard = null;
                } else {
                    selectedCard = card;
                    card.classList.add('card-selected');
                }
                return;
            }

            if (currentPhase === 'battle' && isMyTurn) {
                if (!attackingCard) {
                    if (card.parentElement.classList.contains('circle') && !card.classList.contains('rest')) {
                        if (card.classList.contains('opponent-card')) return;
                        // Prevent backrow from attacking
                        if (card.parentElement.dataset.zone && card.parentElement.dataset.zone.startsWith('rc_back_')) {
                            // Bug Fix: Check for Magnolia Elder or temporary backrow attack abilities
                            if (!isMagnoliaElderSkillActive() && card.dataset.canAttackFromBack !== "true") {
                                alert("Backrow units cannot attack!");
                                return;
                            }
                        }
                        attackingCard = card;
                        card.classList.add('attacking-glow');
                    }
                } else {
                    if (card !== attackingCard) {
                        performAttack(attackingCard, card);
                        attackingCard.classList.remove('attacking-glow');
                        attackingCard = null;
                    }
                }
                return;
            }
        });

        return card;
    }

    function sendMoveData(card, explicitZone) {
        if (!card) return;
        let pZone = explicitZone;
        if (!pZone) {
            const parent = card.parentElement;
            if (parent) {
                if (parent.dataset && parent.dataset.zone) {
                    pZone = parent.dataset.zone;
                } else if (parent.classList.contains('vc')) {
                    pZone = 'vc';
                } else if (parent.classList.contains('rc')) {
                    // Detect specific RC IDs or relative zones
                    pZone = parent.id || (parent.dataset.zone) || 'rc';
                } else if (parent.id) {
                    pZone = parent.id;
                }
            }
            
            if (!pZone) {
                if (soulPool.includes(card)) pZone = 'soul';
                else if (deckPool.includes(card)) pZone = 'deck';
                else pZone = 'unknown';
            }
        }

        sendData({
            type: 'moveCard',
            cardId: card.id,
            cardName: card.dataset.name,
            zone: pZone,
            isRest: card.classList.contains('rest'),
            isFaceDown: card.classList.contains('face-down'),
            grade: card.dataset.grade,
            power: card.dataset.power,
            critical: card.dataset.critical,
            shield: card.dataset.shield,
            basePower: card.dataset.basePower,
            baseCritical: card.dataset.baseCritical,
            skill: card.dataset.skill, // Send skill text to opponent
            isOD: card.dataset.isOverDress === "true",
            isXOD: card.dataset.isXoverDress === "true"
        });
    }

    function sendRemoveData(card) {
        if (!card) return;
        sendData({ type: 'removeCard', cardId: card.id });
    }

    function drawCard(isInitial = false) {
        if (!isMyTurn && !isInitial) return;
        if (deckPool.length === 0) {
            if (!isInitial) {
                alert("Deck out! You lose.");
                showGameOver('Lose');
            }
            return;
        }
        const cardData = deckPool.pop();
        const newCard = createCardElement(cardData);
        playerHand.appendChild(newCard);
        updateHandSpacing();
        updateDeckCounter();

        // Sync hand count AND the card itself if it's hand (optional: Vanguard usually hides hand)
        // For this request, we'll sync the move so it appears in opponent's hand zone
        sendData({ type: 'syncHandCount', count: playerHand.querySelectorAll('.card').length });
        sendMoveData(newCard);
    }

    function triggerShake() {
        const board = document.querySelector('.board-area');
        if (board) {
            board.classList.remove('shake');
            void board.offsetWidth; // Force reflow
            board.classList.add('shake');
            setTimeout(() => board.classList.remove('shake'), 500);
        }
    }

    let isDealingDamage = false;
    function dealDamage(checksLeft = 1) {
        if (checksLeft <= 0 || isDealingDamage) return;
        isDealingDamage = true;
        triggerShake();

        if (deckPool.length === 0) {
            alert("Deck out! You lose.");
            showGameOver('Lose');
            return;
        }

        const cardData = deckPool.pop();
        updateDeckCounter();
        const checkCard = createCardElement(cardData);
        checkCard.style.position = 'fixed';
        checkCard.style.top = '50%';
        checkCard.style.left = '50%';
        checkCard.style.transform = 'translate(-50%, -50%) scale(1.5)';
        checkCard.style.zIndex = '9999';
        checkCard.style.pointerEvents = 'none'; // Prevent blocking unit clicks
        checkCard.classList.add('effect-trigger');
        document.body.appendChild(checkCard);

        sendData({ type: 'revealDrive', cardData: cardData, isFirst: false });

        setTimeout(() => {
            if (cardData.trigger) {
                resolveTrigger(cardData, true);
            } else {
                pendingPowerIncrease = 0;
                pendingCriticalIncrease = 0;
                document.body.classList.remove('targeting-mode');
            }

            // Start waiting ONLY AFTER we've decided if there's a trigger
            const waitLoop = setInterval(() => {
                if (!document.body.classList.contains('targeting-mode')) {
                    clearInterval(waitLoop);
                    setTimeout(finishDamageProcess, 1500);
                }
            }, 200);
        }, 500);

        function finishDamageProcess() {
            if (cardData.trigger === 'Over') {
                alert("Over Trigger ออกตอนเช็คดาเมจ! นำการ์ดออกจากเกม และฟื้นฟู/ไม่รับดาเมจนี้เพิ่ม");
                checkCard.remove();

                // Assuming OverTrigger removes itself and nullifies this point of damage.
                // We don't add it to damage zone.
                isDealingDamage = false;
                if (checksLeft > 1) {
                    setTimeout(() => dealDamage(checksLeft - 1), 800);
                }
                return;
            }

            checkCard.remove();
            const damageCard = createCardElement(cardData);
            const damageZone = document.querySelector('.my-side .damage-zone');
            damageZone.appendChild(damageCard);
            sendMoveData(damageCard);

            const damageCount = document.querySelectorAll('.my-side .damage-zone .card').length;
            sendData({ type: 'syncDamageCount', count: damageCount });
            updateDamageCount();

            if (damageCount >= 6) {
                alert("6 Damage! You lose.");
                showGameOver('Lose');
                return;
            }

            if (checksLeft > 1) {
                isDealingDamage = false; // Reset to allow next damage check in sequence
                setTimeout(() => dealDamage(checksLeft - 1), 800);
            } else {
                isDealingDamage = false;
            }
        }
    }

    async function attackHitCheck(initialCritical, isOpponentPG = false) {
        if (!currentAttackData) return;

        const attacker = document.getElementById(currentAttackData.attackerId);
        const target = document.getElementById('opp-' + currentAttackData.targetId);

        if (!attacker || !target) {
            currentAttackData = null;
            return;
        }

        // Recalculate based on current state (AFTER DRIVE TRIGGERS)
        const attackerPower = parseInt(attacker.dataset.power || "0");
        const boostPower = parseInt(currentAttackData.boostPower || "0");
        let finalPower = attackerPower + boostPower;
        let finalCritical = parseInt(attacker.dataset.critical || "1");

        // Find target power - it's on our locally synced version of opponent's card
        const opponentShield = parseInt(currentAttackData.opponentShield || "0");
        const targetBasePower = parseInt(target.dataset.power || "0");
        let targetDefendingPower = targetBasePower + opponentShield;

        const isHit = finalPower >= targetDefendingPower;
        console.log(`Attack Resolution Check: Attacker ${finalPower} vs Target ${targetDefendingPower}. isHit: ${isHit}`);

        // Check for Perfect Guard (PG) on target side if we were the attacker
        // In local logic, if opponent used PG, we handle it during their finishGuard callback which sets opponentShield
        // However, we should check if any PG was placed.
        const gc = document.querySelector('.guardian-circle');
        const hasPG = gc && Array.from(gc.querySelectorAll('.card')).some(c => c.dataset.name.includes('Perfect Guard') || c.dataset.isPG === "true");

        if (hasPG || isOpponentPG) {
            alert("Perfect Guard activated! Attack is nullified.");
            sendData({
                type: 'resolveAttack',
                attackData: {
                    ...currentAttackData,
                    totalPower: finalPower,
                    totalCritical: finalCritical,
                    isHit: false,
                    isPG: true
                }
            });
        } else {
            if (isHit) {
                alert(`Attack hit! ${finalPower} Power vs ${targetDefendingPower} Def. Resolving damage...`);
            } else {
                alert(`Attack missed! ${finalPower} Power is not enough to hit ${targetDefendingPower} Power (Base + Shield: ${opponentShield}).`);
            }

            sendData({
                type: 'resolveAttack',
                attackData: {
                    ...currentAttackData,
                    totalPower: finalPower,
                    totalCritical: finalCritical,
                    isHit: isHit
                }
            });

        }

        currentAttackData.isHit = (hasPG || isOpponentPG) ? false : isHit;

        await handleEndOfBattle(attacker, currentAttackData);
        currentAttackData = null;
        pendingCriticalIncrease = 0;

        // Bug Fix: Reset guard waiting flags after battle resolution
        setTimeout(() => {
            isWaitingForGuard = false;
            currentAttackResolving = false;
            // Check auto end turn after attack resolves
            checkAllAttackersRested();
        }, 500);
    }


    function driveCheck(count, crit, isOpponentPG = false) {
        if (count <= 0) {
            // If PG was played, override hit check
            if (isOpponentPG) {
                alert("Attack Nullified by Perfect Guard!");
                sendData({
                    type: 'resolveAttack',
                    attackData: {
                        ...currentAttackData,
                        totalPower: parseInt(document.getElementById(currentAttackData.attackerId).dataset.power),
                        totalCritical: crit,
                        isHit: false, // Force miss
                        isPG: true
                    }
                });
            } else {
                attackHitCheck(crit, isOpponentPG);
            }
            // Reset resolve lock
            setTimeout(() => {
                currentAttackResolving = false;
                isWaitingForGuard = false;
            }, 500);
            return;
        }

        if (deckPool.length === 0) {
            alert("Deck out! You lose.");
            showGameOver('Lose');
            return;
        }

        const cardData = deckPool.pop();
        updateDeckCounter();

        // Show the card as a floating "check" element
        const checkCard = createCardElement(cardData);
        checkCard.style.position = 'fixed';
        checkCard.style.top = '50%';
        checkCard.style.left = '50%';
        checkCard.style.transform = 'translate(-50%, -50%) scale(1.5)';
        checkCard.style.zIndex = '9999';
        checkCard.style.pointerEvents = 'none';
        checkCard.classList.add('effect-trigger');
        document.body.appendChild(checkCard);

        sendData({ type: 'revealDrive', cardData: cardData, isFirst: false });

        setTimeout(() => {
            if (cardData.trigger) {
                resolveTrigger(cardData);
            } else {
                pendingPowerIncrease = 0;
                pendingCriticalIncrease = 0;
                document.body.classList.remove('targeting-mode');
            }

            const finishThisCheck = () => {
                checkCard.remove();
                // Check if it's an Over Trigger - if so, move to Remove Zone (or just hide it), otherwise move to hand
                if (cardData.trigger === 'Over') {
                    alert("Over Trigger! Removing from game as per rules.");
                    const removeZone = document.querySelector('.my-side .drop-zone'); // Using drop zone as fallback or just remove it
                    // Search for a remove-zone if it exists, otherwise just remove it.
                    // For now, let's just not add it to hand.
                    checkCard.remove();
                } else {
                    const cardInHand = createCardElement(cardData);
                    playerHand.appendChild(cardInHand);
                    updateHandSpacing();
                    updateHandCount();
                    sendData({ type: 'syncHandCount', count: playerHand.querySelectorAll('.card').length });
                }

                if (count > 1) {
                    setTimeout(() => driveCheck(count - 1, crit, isOpponentPG), 800);
                } else {
                    // ALL DRIVE CHECKS COMPLETE - Now resolve the hit
                    setTimeout(() => {
                        attackHitCheck(crit, isOpponentPG);
                    }, 500);
                }
            };

            // How long to show the card? If targeting, wait for click. If not, auto-move.
            const checkTargeting = setInterval(() => {
                if (!document.body.classList.contains('targeting-mode')) {
                    clearInterval(checkTargeting);
                    setTimeout(finishThisCheck, 1500);
                }
            }, 200);
        }, 500);
    }

    function resolveTrigger(cardData, isDamageCheck = false) {
        let triggerType = cardData.trigger;
        let powerIncrease = triggerType === 'Over' ? 100000000 : 10000;

        alert(`Trigger! ${triggerType} effect activating...`);

        if (triggerType === 'Front') {
            // AUTO-APPLY: Give power increase to all front row units immediately
            document.querySelectorAll('.my-side .front-row .circle .card:not(.opponent-card)').forEach(unit => {
                let currentPower = parseInt(unit.dataset.power);
                unit.dataset.power = currentPower + powerIncrease;

                const powerSpan = unit.querySelector('.card-power');
                if (powerSpan) {
                    const critVal = parseInt(unit.dataset.critical || "1");
                    let displayCritical = critVal > 1 ? `<span style="color:gold;">★${critVal}</span>` : '';
                    powerSpan.innerHTML = `⚔️${unit.dataset.power} ${displayCritical}`;
                }
                sendMoveData(unit);
            });
            alert("Front Trigger! +10,000 Power to all your front row units!");

            // Reset targeting states and exit
            pendingPowerIncrease = 0;
            pendingCriticalIncrease = 0;
            targetingType = null;
            document.body.classList.remove('targeting-mode');
            return;
        }

        if (triggerType === 'Draw') {
            if (!isDamageCheck) drawCard(true); // Draw unconditionally only if it's drive check
        } else if (triggerType === 'Heal') {
            const myDamage = document.querySelectorAll('.my-side .damage-zone .card').length;
            const oppDamageCardCount = parseInt(oppDamageCountNum?.textContent || "0");

            if (myDamage > 0 && myDamage >= oppDamageCardCount) {
                const damageZone = document.querySelector('.my-side .damage-zone');
                const damageCards = damageZone.querySelectorAll('.card');
                const cardToHeal = damageCards[0];
                const dropZone = document.querySelector('.my-side .drop-zone');
                dropZone.appendChild(cardToHeal);
                cardToHeal.classList.remove('rest');
                cardToHeal.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
                sendMoveData(cardToHeal);
                updateDropCount();
                alert("Heal successful!");
            } else {
                alert("Heal failed (your damage must be >= opponent's damage).");
            }
        } else if (triggerType === 'Over') {
            drawCard(true); // Draw 1 card for revealing Over Trigger (Drive or Damage)
            if (!isDamageCheck) {
                // Nation specific OT additional effects (Drive Check only)
                const otName = cardData.name;
                if (otName.includes('Gallmageveld')) {
                    // Dark States: [CONT]: In your turn, all your vanguards get [Power]+10000/[Critical]+1 until the end of the game.
                    window.otDarkStatesActive = true;
                    alert("Dark States OT: All your Vanguards get +10000 Power and +1 Critical for the rest of the game!");
                    updateAllStaticBonuses();
                } else if (otName.includes('Blessfavor')) {
                    // Stoicheia: Draw 1, Front row +10000, Heal 1 (standard heal rules), select 1 unit get +1 Crit
                    window.otStoicheiaActive = true;
                    updateAllStaticBonuses();

                    // Heal 1
                    const myDamage = document.querySelectorAll('.my-side .damage-zone .card').length;
                    const oppDamageCardCount = parseInt(document.getElementById('opp-damage-count-num')?.textContent || "0");
                    if (myDamage > 0 && myDamage >= oppDamageCardCount) {
                        const damageZone = document.querySelector('.my-side .damage-zone');
                        const cardToHeal = damageZone.querySelector('.card');
                        const dropZone = document.querySelector('.my-side .drop-zone');
                        dropZone.appendChild(cardToHeal);
                        cardToHeal.classList.remove('rest');
                        sendMoveData(cardToHeal);
                        updateDropCount();
                        alert("Stoicheia OT: Heal 1 successful!");
                    }

                    // Critical +1 (Step 3 - following power/draw/heal)
                    pendingCriticalIncrease = 1;
                    targetingType = 'critical';
                    alert("Stoicheia OT: Select 1 unit to receive +1 Critical.");
                } else if (otName.includes('Dragveda')) {
                    // Dragon Empire: Stand your VG
                    const vg = document.querySelector('.my-side .circle.vc .card');
                    if (vg) {
                        vg.classList.remove('rest');
                        vg.style.transform = 'none';
                        sendMoveData(vg);
                        alert("Dragon Empire OT: Stand your Vanguard!");
                    }
                } else if (otName.includes('Amartinoa')) {
                    window.otKeterActive = true;
                    alert("Keter Sanctuary OT: All your Rear-guards perform drive checks for the rest of the game!");
                } else if (otName.includes('Eldobreath')) {
                    if (!isDamageCheck) {
                        window.otBrandtGateActive = true;
                        alert("Brandt Gate OT: แถวหน้าทั้งหมด พลังและคริติคอล คูณ 2! (จะทำงานเมื่อเลือกเป้าหมาย +100M เสร็จ)");
                    } else {
                        alert("Brandt Gate OT: (Damage Check) No additional effect.");
                    }
                }
            }
        }

        pendingPowerIncrease = powerIncrease;
        document.body.classList.add('targeting-mode');

        if (triggerType === 'Critical') {
            pendingCriticalIncrease = 1;
            targetingType = 'critical';
            alert(`Step 1: Select a unit to receive +1 Critical.`);
        } else {
            targetingType = 'power';
            alert(`Select a unit to receive +${powerIncrease >= 100000 ? '100M' : powerIncrease} Power.`);
        }

        // After targeting is complete (or if no targeting needed for power/crit), apply Brandt Gate OT
        const checkTargetingComplete = setInterval(() => {
            if (!document.body.classList.contains('targeting-mode')) {
                clearInterval(checkTargetingComplete);
                if (window.otBrandtGateActive && triggerType === 'Over' && cardData.name.includes('Eldobreath') && !isDamageCheck) {
                    document.querySelectorAll('.my-side .front-row .circle .card:not(.opponent-card), .my-side .circle.vc .card:not(.opponent-card)').forEach(unit => {
                        let currentPower = parseInt(unit.dataset.power);
                        let currentCritical = parseInt(unit.dataset.critical || "1");

                        unit.dataset.power = (currentPower * 2).toString();
                        unit.dataset.critical = (currentCritical * 2).toString();
                        syncPowerDisplay(unit);
                        sendMoveData(unit);
                    });
                    alert("Brandt Gate OT: แถวหน้าทั้งหมด พลังและคริติคอล คูณ 2 สำเร็จ!");
                    window.otBrandtGateActive = false; // Consume the effect for this turn
                }
            }
        }, 200);
    }

    async function performAttack(attacker, target) {
        if (document.body.classList.contains('targeting-mode')) {
            alert("กรุณาเลือกเป้าหมายทริกเกอร์ให้เสร็จก่อน!");
            attacker.classList.remove('attacking-glow');
            attackingCard = null;
            return;
        }
        if (currentTurn === 1 && isFirstPlayer) {
            alert("ผู้เล่นที่ได้เริ่มเล่นก่อน ไม่สามารถโจมตีได้ในเทิร์นแรก!");
            attacker.classList.remove('attacking-glow');
            attackingCard = null;
            return;
        }

        // Stricter Targeting: Only allow attacking opponent's units on field (circles)
        const targetParent = target.parentElement;
        const isTargetOnField = targetParent && targetParent.classList.contains('circle');
        const isOpponentCard = target.classList.contains('opponent-card');

        if (!isOpponentCard || !isTargetOnField) {
            alert("Invalid Target! You can only attack opponent's units on the field.");
            return;
        }

        if (isWaitingForGuard) {
            alert("กรุณารอให้ฝั่งคู่แข่งเลือกว่าจะป้องกัน (Guard) ให้เสร็จก่อนจึงจะสามารถโจมตีครั้งต่อไปได้");
            attacker.classList.remove('attacking-glow');
            attackingCard = null;
            return;
        }

        // Restrict to FRONT ROW ONLY
        const zone = targetParent.dataset.zone || '';
        if (zone.includes('back')) {
            alert("Invalid Target! You can only attack front-row units.");
            attacker.classList.remove('attacking-glow');
            attackingCard = null;
            return;
        }

        // Booster Logic and Attack Sequence
        const attackerParentCircle = attacker.parentElement;
        const attackerZone = attackerParentCircle.dataset.zone || '';
        const isAttackerBackRow = attackerZone.includes('back');
        const isElderActive = isMagnoliaElderSkillActive();
        const isGrade4Elder = attacker.dataset.name.includes('Magnolia Elder') && parseInt(attacker.dataset.grade) === 4;

        if (isAttackerBackRow && !isElderActive) {
            // Checking for temporary back-column attack ability (Magnolia King skill)
            if (attacker.dataset.canAttackFromBack !== "true") {
                alert("This unit cannot attack from the back row!");
                attacker.classList.remove('attacking-glow');
                attackingCard = null;
                return;
            }
        }

        // Auto-assign Triple Drive to G4 Magnolia Elder
        if (attackerParentCircle.classList.contains('vc') && isGrade4Elder) {
            attacker.dataset.tripleDrive = "true";
        }

        let targetId = target.id;
        if (targetId.startsWith('opp-')) targetId = targetId.substring(4);

        if (!await vgConfirm(`Attack ${target.dataset.name} with ${attacker.dataset.name}?`)) {
            attacker.classList.remove('attacking-glow');
            attackingCard = null;
            return;
        }

        // --- Majesty Lord Blaster Attack Skill ---
        if (attacker.dataset.name.includes('Majesty Lord Blaster') && attackerParentCircle.classList.contains('vc') && targetParent.classList.contains('vc')) {
            await handleMajestyAttackSkills(attacker);
        }

        // --- Knight of Inheritance, Emmeline [AUTO](RC) Trigger ---
        if (attacker.dataset.name.includes('Blaster')) {
            document.querySelectorAll('.my-side .circle .card:not(.opponent-card)').forEach(unit => {
                const z = unit.parentElement.dataset.zone || "";
                if (unit.dataset.name.includes('Emmeline') && z.startsWith('rc')) {
                    unit.dataset.emmelineAtkBonus = (parseInt(unit.dataset.emmelineAtkBonus || "0") + 5000).toString();
                    unit.dataset.power = (parseInt(unit.dataset.power) + 5000).toString();
                    syncPowerDisplay(unit);
                    sendMoveData(unit);
                    alert("Emmeline: ยูนิต 'Blaster' โจมตี พลัง +5000!");
                }
            });
        }

        // --- Ala Dargente [AUTO](RC) Trigger ---
        if (attacker.dataset.name.includes('Avantgarda') && attackerParentCircle.classList.contains('vc')) {
            document.querySelectorAll('.my-side .circle .card:not(.opponent-card)').forEach(unit => {
                const z = unit.parentElement.dataset.zone || "";
                if (unit.dataset.name.includes('Ala Dargente') && z.startsWith('rc')) { // Fix: Ensure Ala Dargente is matched by name
                    unit.dataset.power = (parseInt(unit.dataset.power) + 5000).toString();
                    unit.dataset.turnEndBuffPower = (parseInt(unit.dataset.turnEndBuffPower || "0") + 5000).toString();
                    unit.dataset.turnEndBuffActive = "true";
                    syncPowerDisplay(unit);
                    sendMoveData(unit);
                    alert("Ala Dargente: แวนการ์ด 'Avantgarda' โจมตี ได้รับพลัง +5000 จนจบเทิร์น!");
                }
            });
        }

        turnAttackCount++; // Increment attack count for the turn
        console.log(`Attack Count: ${turnAttackCount}`);

        // Trigger Death Winds
        if (attacker.dataset.deathWindsAttackTrigger === "true" && attacker.parentElement.classList.contains('vc')) {
            alert(`${attacker.dataset.name}: ความสามารถ Death Winds ทำงาน! แถวหน้าพลัง +5000`);
            document.querySelectorAll('.my-side .circle .card').forEach(c => {
                const z = c.parentElement.dataset.zone || "";
                if (z === 'vc' || z === 'rc_front_left' || z === 'rc_front_right') {
                    c.dataset.power = (parseInt(c.dataset.power) + 5000).toString();
                    c.dataset.turnEndBuffPower = (parseInt(c.dataset.turnEndBuffPower || "0") + 5000).toString();
                    c.dataset.turnEndBuffActive = "true";
                    syncPowerDisplay(c);
                    sendMoveData(c);
                }
            });
        }

        let basePower = parseInt(attacker.dataset.power);
        let totalPower = basePower;
        let totalCritical = parseInt(attacker.dataset.critical || 1);
        let attackerNameFull = attacker.dataset.name;

        // Check for Booster
        const parentZone = attacker.parentElement.dataset.zone;
        let backZoneName = null;
        if (parentZone === 'rc_front_left') backZoneName = 'rc_back_left';
        else if (parentZone === 'vc') backZoneName = 'rc_back_center';
        else if (parentZone === 'rc_front_right') backZoneName = 'rc_back_right';

        let boosterPower = 0;
        let boosterCardInfo = null;
        if (backZoneName) {
            const backCircle = document.querySelector(`.my-side .circle[data-zone="${backZoneName}"]`);
            if (backCircle) {
                const card = backCircle.querySelector('.card:not(.opponent-card)');
                if (card && !card.classList.contains('rest')) {
                    const grade = parseInt(card.dataset.grade);
                    const canBoost = grade === 0 || grade === 1 || card.dataset.canBoost === "true";
                    if (canBoost) { // Grade 0, 1 or G2 with Boost
                        if (await vgConfirm(`Do you want to Boost with your backrow ${card.dataset.name}? (+${card.dataset.power} Power)`)) {
                            card.classList.add('rest');
                            sendMoveData(card);
                            boosterPower = parseInt(card.dataset.power);

                            // --- Ordeal Dragon Skill ---
                            if (card.dataset.name.includes('Ordeal Dragon') && attacker.dataset.name.includes('Blaster')) {
                                boosterPower += 5000;
                                alert("Ordeal Dragon: บูสต์ยูนิท 'Blaster' พลัง +5000!");
                            }

                            if (card.dataset.name.includes('Hanada Halfway') && strategyPutToOrderZoneThisTurn) {
                                // Removed redundant Hanada calculation here, it's handled below
                                // boosterPower += 2000;
                                // alert(`Hanada Halfway: พลัง +2000 จนจบการต่อสู้!`);
                                if (backZoneName === 'rc_back_center') {
                                    counterCharge(1);
                                    alert("Hanada Halfway (แถวหลังสุดกลาง): [Counter-Charge 1]!");
                                }
                            }

                            totalPower += boosterPower;
                            attackerNameFull = `${attacker.dataset.name} (Boosted by ${card.dataset.name})`;
                            boosterCardInfo = { id: card.id, name: card.dataset.name, zone: backZoneName };

                            if (isFinalRush && parentZone === 'vc' && card.dataset.name.includes('Mabel')) {
                                if (await vgConfirm("Mabel: [AUTO] เมื่อบูสต์แวนการ์ด ในสถานะ Final Rush [CB1] ทำให้แวนการ์ดได้รับ Triple Drive จนจบเทิร์น?")) {
                                    if (payCounterBlast(1)) {
                                        attacker.dataset.tripleDrive = "true";
                                        alert("Mabel: แวนการ์ดของคุณได้รับ Triple Drive! (เช็คไดร์ฟ 3 ใบ)");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // --- Blue Deathster, Hanada Halfway [AUTO] ---
        if (boosterCardInfo && boosterCardInfo.name.includes('Hanada Halfway')) {
            if (strategyPutToOrderZoneThisTurn) {
                let bonusPwr = 2000;
                totalPower += bonusPwr;
                let ccMsg = "";
                if (boosterCardInfo.zone === 'rc_back_center') {
                    // Counter-Charge already handled above if it was the center back row
                    // ccMsg = " และทำการ [Counter-Charge 1]";
                }
                alert(`Hanada Halfway: พลังบูสต์เพิ่ม +2000${ccMsg}!`);
            }
        }

        // --- Knight of Inheritance, Emmeline Skill ---
        if (attacker.dataset.name.includes('Emmeline')) {
            const vgNode = document.querySelector('.my-side .circle.vc .card');
            if (vgNode && vgNode.dataset.name.includes('Blaster')) {
                totalPower += 5000;
                alert("Emmeline: แวนการ์ดเป็น 'Blaster' พลัง +5000!");
            }
        }

        // --- Nirvana Jheva [AUTO](VC) ---
        if (isMyTurn && attacker.dataset.name.includes('Nirvana Jheva') && parentZone === 'vc') {
            if (await vgConfirm(`Nirvana Jheva: เมื่อโจมตี [CB1] เลือก Stand เรียร์การ์ดสถานะ [XoverDress] 1 ใบ?`)) {
                if (payCounterBlast(1)) {
                    alert("เลือกเรียร์การ์ดสถานะ X-overDress (Vairina) 1 ใบเพื่อ Stand");
                    document.body.classList.add('targeting-mode');
                    const standListener = (e) => {
                        const targetRG = e.target.closest('.circle.rc .card:not(.opponent-card)');
                        if (targetRG && (targetRG.dataset.isOverDress === "true" || targetRG.dataset.isXoverDress === "true" || targetRG.dataset.name.includes('Vairina'))) {
                            e.stopPropagation();
                            targetRG.classList.remove('rest');
                            sendMoveData(targetRG);
                            alert(`${targetRG.dataset.name} Stand!`);
                            document.body.classList.remove('targeting-mode');
                            document.removeEventListener('click', standListener, true);
                        }
                    };
                    document.addEventListener('click', standListener, true);
                }
            }
        }

        // --- Graillumirror [AUTO](RC) Support ---
        if (isMyTurn && attacker.dataset.name.includes('Nirvana') && parentZone === 'vc') {
            const rgs = document.querySelectorAll('.my-side .circle.rc .card:not(.opponent-card)');
            for (const grail of rgs) {
                if (grail.dataset.name.includes('Graillumirror') && !grail.classList.contains('rest')) {
                    if (await vgConfirm("Graillumirror (RC): เมื่อแวนการ์ด Nirvana โจมตี [CB1] เพื่อ Stand ยูนิท overDress/XoverDress?")) {
                        if (payCounterBlast(1)) {
                            alert("เลือกยูนิต overDress หรือ XoverDress เพื่อ Stand");
                            document.body.classList.add('targeting-mode');
                            const grailStandListener = (e) => {
                                const targetRG = e.target.closest('.circle.rc .card:not(.opponent-card)');
                                if (targetRG && (targetRG.dataset.isOverDress === "true" || targetRG.dataset.isXoverDress === "true")) {
                                    e.stopPropagation();
                                    targetRG.classList.remove('rest');
                                    targetRG.dataset.power = (parseInt(targetRG.dataset.power) + 5000).toString();
                                    targetRG.dataset.turnEndBuffPower = (parseInt(targetRG.dataset.turnEndBuffPower || "0") + 5000).toString();
                                    targetRG.dataset.turnEndBuffActive = "true";
                                    syncPowerDisplay(targetRG);
                                    sendMoveData(targetRG);
                                    alert(`${targetRG.dataset.name} Stand! และได้รับพลัง +5000 จนจบเทิร์น`);
                                    document.body.classList.remove('targeting-mode');
                                    document.removeEventListener('click', grailStandListener, true);
                                }
                            };
                            document.addEventListener('click', grailStandListener, true);
                        }
                    }
                    break; // Only one Graillumirror activation for simplicity or as per rule
                }
            }
        }

        if (isMyTurn) {
            const isTargetVanguard = target.parentElement.classList.contains('vc');

            // --- Alpin [AUTO](RC) ---
            if (attacker.dataset.name.includes('Alpin') && isTargetVanguard) {
                const vg = document.querySelector('.my-side .circle.vc .card');
                if (vg && vg.dataset.name.includes('Magnolia')) {
                    const g2PlusCount = Array.from(document.querySelectorAll('.my-side .circle .card:not(.opponent-card)'))
                        .filter(u => parseInt(u.dataset.grade) >= 2).length;
                    const powerBonus = Math.floor(g2PlusCount / 2) * 5000;
                    if (powerBonus > 0) {
                        attacker.dataset.power = parseInt(attacker.dataset.power) + powerBonus;
                        totalPower += powerBonus;
                        alert(`Alpin: Power +${powerBonus} (G2+ units: ${g2PlusCount})`);
                        if (powerBonus >= 10000) attacker.dataset.alpinBindReady = "true";
                        syncPowerDisplay(attacker);
                    }
                }
            }

            // --- Goildoat [AUTO](RC) Back Row ---
            if (attacker.dataset.name.includes('Goildoat') && isAttackerBackRow) {
                attacker.dataset.power = parseInt(attacker.dataset.power) + 10000;
                totalPower += 10000;
                alert("Goildoat: [Back Row (RC)] Power +10000!");
                if (attackerParentCircle.dataset.zone === 'rc_back_center') attacker.dataset.goildoatRetireReady = "true";
                syncPowerDisplay(attacker);
            }

            // --- Gabregg [AUTO](RC) ---
            // Triggered when OTHER unit in same column attacks.
            const columnZones = {
                'rc_front_left': 'rc_back_left', 'rc_back_left': 'rc_front_left',
                'rc_front_right': 'rc_back_right', 'rc_back_right': 'rc_front_right',
                'vc': 'rc_back_center', 'rc_back_center': 'vc'
            };
            const otherZoneInCol = columnZones[parentZone];
            if (otherZoneInCol) {
                const otherCircle = document.querySelector(`.my-side .circle[data-zone="${otherZoneInCol}"]`);
                if (otherCircle) {
                    const gabregg = otherCircle.querySelector('.card:not(.opponent-card)');
                    if (gabregg && gabregg.dataset.name.includes('Gabregg')) {
                        if (await vgConfirm(`Gabregg: ยูนิทในแถวเดียวกันโจมตี จ่าย [SB1] เพื่อรับ Power+10000 และมอบ Guard Restrict?`)) {
                            if (await paySoulBlast(1)) {
                                gabregg.dataset.power = parseInt(gabregg.dataset.power) + 10000;
                                alert("Gabregg: Power +10000 applied!");
                                syncPowerDisplay(gabregg);

                                // Flag Gabregg to apply guard restrict when HE attacks later
                                gabregg.dataset.gabrestrict = "true";
                            } else {
                                alert("โซลไม่พอ!");
                            }
                        }
                    }
                }
            }

            // If Gabregg himself is attacking and has the restrict flag
            if (attacker.dataset.name.includes('Gabregg') && attacker.dataset.gabrestrict === "true") {
                // Get opponent's RG grades
                const oppRGs = document.querySelectorAll('.opponent-side .circle.rc .card');
                const grades = Array.from(oppRGs).map(c => parseInt(c.dataset.grade));
                if (grades.length > 0) {
                    attacker.dataset.guardRestrictGrades = JSON.stringify([...new Set(grades)]);
                    alert(`Gabregg: Guard Restrict! คู่แข่งไม่สามารถคอลเกรด ${JSON.parse(attacker.dataset.guardRestrictGrades).join(', ')} จากบนมือได้`);
                }
            }

            // --- Garou Vairina [AUTO](RC) ---
            if (attacker.dataset.name.includes('Garou Vairina')) {
                if (attacker.dataset.isXoverDress === "true") {
                    totalPower += 10000; // Static bonus should already be added by applyStaticBonuses, but let's be sure or just log it
                    // The static bonus is added in applyStaticBonuses, so totalPower is handles by syncPowerDisplay
                    attacker.dataset.guardRestrictCount = "2";
                    alert("Garou Vairina: X-overDress Attack! Guard Restrict: 2+ cards from hand.");
                }
            }


            // --- Mirrors Vairina [AUTO](RC) ---
            if (attacker.dataset.name.includes('Mirrors Vairina')) {
                if (attacker.dataset.isXoverDress === "true") {
                    attacker.dataset.power = parseInt(attacker.dataset.power) + 10000;
                    attacker.dataset.mirrorsPowerAdded = "true";
                    totalPower += 10000;
                    alert("Mirrors Vairina: X-overDress Attack! Power +10000");
                    syncPowerDisplay(attacker);

                    const vairinasInDress = (attacker.originalDress || []).filter(d => d.name.includes("Vairina"));
                    if (vairinasInDress.length > 0) {
                        if (await vgConfirm("Mirrors Vairina: [COST][ส่ง Vairina ที่ซ้อนอยู่ลงดรอบ] เพื่อจั่วการ์ด 1 ใบ หรือ CC 1?")) {
                            openViewer("Choose Vairina to Drop", vairinasInDress);
                            const selDrop = (ev) => {
                                const clicked = ev.target.closest('.card');
                                if (clicked && clicked.parentElement === viewerGrid) {
                                    viewerGrid.removeEventListener('click', selDrop);
                                    zoneViewer.classList.add('hidden');

                                    const cIdx = attacker.originalDress.findIndex(d => d.name === clicked.dataset.name);
                                    const dropped = attacker.originalDress.splice(cIdx, 1)[0];

                                    const dropZone = document.querySelector('.my-side .drop-zone');
                                    const dropElem = createCardElement(dropped);
                                    dropZone.appendChild(dropElem);
                                    sendMoveData(dropElem);
                                    updateDropCount();
                                    alert(`ทิ้ง ${dropped.name} แล้ว!`);

                                    if (confirm("เลือก OK สำหรับ 'จั่วการ์ด 1 ใบ' หรือ Cancel สำหรับ 'Counter Charge 1'")) {
                                        drawCard(true);
                                    } else {
                                        counterCharge(1);
                                    }
                                }
                            };
                            viewerGrid.addEventListener('click', selDrop);
                        }
                    }
                }
            }

            // Existing attack-time skills...
            if (isFinalRush && attacker.dataset.name.toLowerCase().includes('megan')) {
                // Every time she attacks, she gets +10000 until end of turn. Stacks.
                attacker.dataset.power = parseInt(attacker.dataset.power) + 10000;
                totalPower += 10000;
                alert(`Megan: [AUTO] Final Rush! Power +10000 applied (Total: ${attacker.dataset.power})`);
                syncPowerDisplay(attacker);
            }

            // Eden Critical check [CONT]
            if (isFinalRush && attacker.dataset.name.includes('Eden')) {
                if (attacker.dataset.stoodByEffect === "true") {
                    totalCritical += 1;
                    if (!attacker.dataset.edenCritApplied) {
                        attacker.dataset.critical = parseInt(attacker.dataset.critical) + 1;
                        attacker.dataset.edenCritApplied = "true";
                    }
                    alert("Eden: [CONT] Restood bonus! Critical +1 applied.");
                }
                sendMoveData(attacker);
            }

            // Magnolia Giunosla [AUTO]
            if (attacker.dataset.name.includes('Giunosla') && isAttackerBackRow) {
                if (await vgConfirm("Giunosla: [AUTO] เมื่อยูนิทนี้โจมตีจากแถวหลัง [CB1] มอบพลังทั้งหมดของยูนิทนี้ให้เรียร์การ์ดใบอื่น?")) {
                    if (payCounterBlast(1)) {
                        promptGiunoslaPowerTransfer(attacker);
                    }
                }
            }

            // --- Julian [AUTO](RC)[1/turn] ---
            if (isMyTurn && attacker.dataset.name.includes('Julian') && targetParent.classList.contains('vc')) {
                if (attacker.dataset.julianUsed !== "true") {
                    if (await vgConfirm("Julian: [AUTO] เมื่อโจมตีแวนการ์ด [CB1] เพื่อรับพลังและ SC ตามดาเมจ?")) {
                        if (payCounterBlast(1)) {
                            attacker.dataset.julianUsed = "true";
                            const damageCount = document.querySelectorAll('.my-side .damage-zone .card').length;
                            const pwrBonus = damageCount * 2000;
                            attacker.dataset.power = parseInt(attacker.dataset.power) + pwrBonus;
                            totalPower += pwrBonus;
                            syncPowerDisplay(attacker);
                            alert(`Julian: Power +${pwrBonus} จนจบเทิร์น!`);

                            const vg = document.querySelector('.my-side .circle.vc .card');
                            if (vg && vg.dataset.name.includes('Bruce')) {
                                const scToPerform = Math.floor(damageCount / 2);
                                if (scToPerform > 0) {
                                    alert(`Julian: แวนการ์ดคือ Bruce! Soul Charge ${scToPerform} และเลือกคอลสูงสุด ${scToPerform} ใบ!`);
                                    soulCharge(scToPerform);
                                    promptCallMultipleFromSoul(scToPerform, "RC ที่ว่างอยู่");
                                }
                            }
                        }
                    }
                }
            }

            attacker.classList.add('rest');
            sendMoveData(attacker);

            const isVanguardAttacker = attacker.parentElement.classList.contains('vc');

            // --- Avantgarda Attacker / Booster Skills ---
            if (strategyActivatedThisTurn) {
                // Findanis (CONT) - Handled in applyStaticBonuses for visibility




                // Stelvane (Attacker)
                if (attacker.dataset.name.includes('Stelvane')) {
                    totalPower += 5000;
                    alert("Stelvane: [AUTO] Attacking & Strategy Active, Power +5000!");
                    syncPowerDisplay(attacker);
                }
            }

            // Removed incorrect Avantgarda/Richter stand RG skill

            const attackData = {
                attackerId: attacker.id,
                attackerName: attackerNameFull,
                boostPower: boosterPower,
                totalPower: totalPower,
                totalCritical: totalCritical,
                targetId: targetId,
                targetName: target.dataset.name,
                isVanguardAttacker: isVanguardAttacker,
                isTargetVanguard: isTargetVanguard,
                vanguardGrade: attacker.dataset.grade,
                driveCount: parseInt(attacker.dataset.drive || (isVanguardAttacker ? (parseInt(attacker.dataset.grade) >= 4 ? "3" : (parseInt(attacker.dataset.grade) >= 3 ? "2" : "1")) : (attacker.dataset.baurDriveCheck === "true" ? "1" : "0"))),
                boosterId: boosterCardInfo ? boosterCardInfo.id : null,
                boosterName: boosterCardInfo ? boosterCardInfo.name : null,
                tripleDrive: attacker.dataset.tripleDrive === "true" || (parseInt(attacker.dataset.grade) === 4),
                majestyDriveBuff: attacker.dataset.majestyDriveBuff === "true",
                baurDriveCheck: attacker.dataset.baurDriveCheck === "true",
                isMultiAttack: attacker.dataset.bojalcornActive === "true" && isAttackerBackRow,
                guardRestrictGrades: attacker.dataset.guardRestrictGrades ? JSON.parse(attacker.dataset.guardRestrictGrades) : null,
                guardRestrictCount: parseInt(attacker.dataset.guardRestrictCount || (attacker.dataset.killshroudGuardRestrict === "true" ? "2" : "0")),
                bomberNoIntercept: isVanguardAttacker && bomberDustingNoIntercept,
                bomberNoBlitz: isVanguardAttacker && bomberDustingNoBlitz
            };

            // Reset Bojalcorn multi-attack flag if it was active
            if (attacker.dataset.name && (attacker.dataset.name.includes('Bojalcorn') || attacker.dataset.name.includes('Magnolia'))) {
                attacker.dataset.bojalcornActive = "false";
            }

            // --- Baur Vairina Attack Skill ---
            const isBaur = attacker.dataset.name && attacker.dataset.name.includes('Baur Vairina');
            if (isBaur && attacker.dataset.isXoverDress === "true" && !attacker.dataset.baurDriveUsed) {
                if (await vgConfirm("Baur Vairina: [CB1] เพื่อได้รับ Drive +1?")) {
                    if (payCounterBlast(1)) {
                        attacker.dataset.baurDriveCheck = "true";
                        attacker.dataset.baurDriveUsed = "true";
                        syncPowerDisplay(attacker);
                        sendMoveData(attacker);
                        alert("Baur Vairina: ได้รับ Drive +1 สำหรับการต่อสู้นี้!");
                        // Update attack data drive count
                        attackData.driveCount = 1;
                        attackData.baurDriveCheck = true;
                    }
                }
            }

            // Bruce Attack Ability Check
            const isBruce = attacker.dataset.name && (attacker.dataset.name.includes('Viamance') || attacker.dataset.name.includes('Bruce'));
            if (isVanguardAttacker && isFinalBurst && isBruce) {
                setTimeout(async () => {
                    if (await vgConfirm("FINAL BURST: Cost CB 1 to restand a column and give +5000 Power?")) {
                        if (payCounterBlast(1)) {
                            showColumnSelection(col => {
                                if (col) restandColumn(col);
                            });
                        }
                    }
                }, 500);
            }

            sendData({
                type: 'declareAttack',
                ...attackData
            });

            const statusText = document.getElementById('game-status-text');
            if (statusText) statusText.textContent = "Waiting for opponent to guard...";
            isWaitingForGuard = true;
        }
    }

    async function validateAndMoveCard(card, zone) {
        if (!card || !zone) return false;

        const oldParent = card.parentElement;
        const isFromHand = oldParent && oldParent.dataset.zone === 'hand';
        const isFromField = oldParent && oldParent.classList.contains('circle');
        const isFromVC = oldParent && oldParent.classList.contains('vc');
        const isFromGC = oldParent && (oldParent.dataset.zone === 'gc_player' || oldParent.id === 'shared-gc');
        const isHandZone = zone.dataset.zone === 'hand' || zone.id === 'player-hand' || zone.classList.contains('player-hand');

        // Allow returning cards from GC to Hand during defense
        if (isFromGC && isHandZone && isGuarding) {
            zone.appendChild(card);
            updateHandCount();
            updateGCShield();
            updateHandSpacing();
            sendMoveData(card);
            return true;
        }

        if (isFromHand) {
            card.dataset.fromHand = "true";
        } else if (isFromField) {
            card.dataset.fromHand = "false";
        }

        // 0. Vanguard Movement Restriction
        if (isFromVC && (zone.classList.contains('rc') || zone.dataset.zone === 'hand' || zone.classList.contains('drop-zone'))) {
            alert("Vanguard cannot be moved to Rear-guard circle, Hand, or Drop Zone!");
            return false;
        }

        // 1. Basic Boundary Checks
        if (isFromHand) {
            const isMySide = zone.closest('.my-side');
            const isSharedGC = zone.id === 'shared-gc';
            const isVanguard = zone.classList.contains('vc');
            const isRearguard = zone.classList.contains('rc');
            const isDropZone = zone.classList.contains('drop-zone');
            const allowed = (isMySide && (isVanguard || isRearguard || isDropZone)) || isSharedGC;

            if (isDropZone && card.dataset.skill && card.dataset.skill.includes('[Order]')) {
                orderPlayedThisTurn = true;
                updateAllStaticBonuses();
            }

            if (!allowed) {
                alert("Invalid Move! Hand cards can only be placed on YOUR Field, YOUR Drop Zone, or the Guardian Circle.");
                return false;
            }
        }

        // 2. Guarding Check
        if (zone.dataset.zone === 'gc_player' || zone.id === 'shared-gc') {
            if (!isGuarding) {
                alert("You can only move cards to the Guard Circle when defending an attack!");
                return false;
            }

            if (isFromField && !isFromHand) {
                const isGrade2FrontRow = card.dataset.grade == "2" && oldParent && oldParent.dataset.zone && oldParent.dataset.zone.startsWith('rc_front_');
                const isElderActive = isMagnoliaElderSkillActive();
                const vg = document.querySelector('.my-side .circle.vc .card');
                const isCordielaGuard = card.dataset.name.includes('Cordiela') && vg && vg.dataset.name.includes('Majesty');
                const isInterceptable = isGrade2FrontRow || (isElderActive && !isFromVC) || isCordielaGuard;
                if (!isInterceptable) {
                    alert("Only Grade 2 Rear-guards in the Front Row (or units with intercept skills) can Intercept!");
                    return false;
                }
            }

            // --- Guard Restrict Check ---
            if (window.currentIncomingAttack && window.currentIncomingAttack.guardRestrictGrades) {
                const cardGrade = parseInt(card.dataset.grade);
                if (isFromHand && window.currentIncomingAttack.guardRestrictGrades.includes(cardGrade)) {
                    alert(`GUARD RESTRICT! คุณไม่สามารถคอลยูนิวเกรด ${cardGrade} จากบนมือลง G ได้!`);
                    return false;
                }
            }

            // Bomber Strategy Intercept Restrict
            if (window.currentIncomingAttack && window.currentIncomingAttack.bomberNoIntercept) {
                if (isFromField && !isFromHand) {
                    alert("Bomber Strategy Dusting! คุณไม่สามารถทำการ Intercept ได้!");
                    return false;
                }
            }

            // Bomber Strategy Blitz Order Restrict is handled in playOrder

            // --- Trigger Shield Buff ---
            const oppVG = document.querySelector('.opponent-side .circle.vc .card');
            const oppVGGrade = oppVG ? parseInt(oppVG.dataset.grade || "0") : 0;
            if (oppVGGrade >= 3) {
                const triggerType = card.dataset.trigger || "";
                let shieldBonus = 0;
                if (triggerType === "Draw") {
                    shieldBonus = 5000;
                    card.dataset.shield = "10000";
                } else if (triggerType === "Front") {
                    shieldBonus = 5000;
                    card.dataset.shield = "20000";
                }

                if (shieldBonus > 0) {
                    const shieldSpan = card.querySelector('.card-shield');
                    if (shieldSpan) shieldSpan.innerHTML = `🛡️${card.dataset.shield}`;
                    alert(`${triggerType} Trigger: Shield +${shieldBonus}! (กลายเป็น ${card.dataset.shield})`);
                }
            }

            const isPG = card.dataset.isPG === "true" || card.dataset.name.includes('(PG)');
            if (isPG) {
                const cardsInHand = Array.from(playerHand.querySelectorAll('.card'));
                // Filter out the current card being moved to GC if it's from hand
                const otherCardsInHand = cardsInHand.filter(c => c.id !== card.id);

                if (otherCardsInHand.length >= 1) { // If there are other cards left in hand
                    if (await vgConfirm("Perfect Guard: Discard 1 card from hand as cost?")) {
                        alert("Select a card from your hand to discard.");
                        document.body.classList.add('targeting-mode');

                        const pgDiscardListener = (e) => {
                            const discardTarget = e.target.closest('.card');
                            if (discardTarget && discardTarget.parentElement && discardTarget.parentElement.dataset.zone === 'hand' && discardTarget.id !== card.id) {
                                e.stopPropagation();
                                const dropZone = document.querySelector('.my-side .drop-zone');
                                dropZone.appendChild(discardTarget);
                                sendMoveData(discardTarget);
                                updateHandCount();
                                updateDropCount();
                                document.body.classList.remove('targeting-mode');
                                document.removeEventListener('click', pgDiscardListener, true);
                                alert("Cost paid: Card discarded.");
                            } else if (discardTarget && discardTarget.id === card.id) {
                                alert("You cannot discard the card you are using to guard!");
                            }
                        };
                        document.addEventListener('click', pgDiscardListener, true);
                    } else {
                        alert("Cost not paid. Perfect Guard will not activate!");
                        // If cost not paid, prevent it from being a PG
                        card.dataset.isPG = "false";
                    }
                } else {
                    alert("No other cards in hand to pay Perfect Guard cost. PG will not activate!");
                    card.dataset.isPG = "false";
                }
            }
            // Move card and cleanup
            zone.appendChild(card);
            card.classList.remove('rest');
            card.style.transform = 'none';
            if (oldParent) updateAllStaticBonuses();
            updateAllStaticBonuses();
            sendMoveData(card);
            updateHandCount();
            updateDropCount();
            return true;
        }

        // 3. Turn Check
        if (!isMyTurn) return false;
        const currentPhase = phases[currentPhaseIndex];

        // 4. Circle Validation (Ride/Call/Move)
        if (zone.classList.contains('circle')) {
            const cardGrade = card.getEffectiveGrade ? card.getEffectiveGrade() : parseInt(card.dataset.grade);
            const vanguard = document.querySelector('.my-side .circle.vc .card');
            const vanguardGrade = vanguard ? parseInt(vanguard.dataset.grade) : 0;

            // Prevent Orders from being called to field
            if (card.dataset.skill && card.dataset.skill.includes('[Order]')) {
                alert("Order cards cannot be called to Vanguard or Rear-guard circles!");
                return false;
            }

            // 4a. Move to Vanguard Circle (RIDE)
            if (zone.classList.contains('vc')) {
                if (isFromField) {
                    alert("The Vanguard cannot be moved or swapped with Rear-guards!");
                    return false;
                }
                if (currentPhase !== 'ride') { alert("Only Ride during Ride Phase!"); return false; }
                if (hasRiddenThisTurn) { alert("Only Ride once per turn!"); return false; }

                // Allow exact same grade if it's G3 or G4 (Persona Ride or G4 re-ride)
                const isSameGradeAllowed = cardGrade >= 3 && cardGrade === vanguardGrade;
                if (cardGrade !== vanguardGrade + 1 && !isSameGradeAllowed && !(cardGrade === 4 && vanguardGrade === 3)) {
                    alert(`Cannot Ride Grade ${cardGrade} over Grade ${vanguardGrade}!`);
                    return false;
                }

                // Ride success
                zone.querySelectorAll('.card').forEach(c => {
                    soulPool.push(c);
                    sendMoveData(c);
                });
                zone.innerHTML = '';
                zone.appendChild(card);
                hasRiddenThisTurn = true;
                updateSoulUI();

                const vanguardName = vanguard ? vanguard.dataset.name : "";

                if (card.dataset.persona === "true" && vanguardGrade === 3 && currentPhase === 'ride' && card.dataset.name === vanguardName) {
                    triggerPersonaRide();
                }

                applyStaticBonuses(card);
                handleRideAbilities(card); // Trigger ride abilities (including queue)
                sendMoveData(card);
                await checkDropAbilities(card); // Goildoat Drop Skill
                await checkOnPlaceAbilities(card); // Ensure on-place triggers for V
                updatePhaseUI(true);
                return true;
            }

            // 4b. Move to Rear-guard Circle (CALL or MOVE)
            if (zone.classList.contains('rc')) {
                // IF MOVING WITHIN FIELD
                if (isFromField) {
                    if (currentPhase !== 'main') {
                        alert("Rear-guards can only be moved during the Main Phase!");
                        return false;
                    }

                    // Restriction: Same vertical column only
                    const oldZone = oldParent.dataset.zone || "";
                    const newZone = zone.dataset.zone || "";

                    const getCol = (z) => {
                        if (z.includes('left')) return 'left';
                        if (z.includes('right')) return 'right';
                        if (z.includes('center') || z === 'vc') return 'center';
                        return 'none';
                    };

                    if (getCol(oldZone) !== getCol(newZone)) {
                        alert("Movement Restricted: Rear-guards can only move within the same vertical column!");
                        return false;
                    }

                    // Swapping logic
                    const existingCard = zone.querySelector('.card:not(.opponent-card)');
                    if (existingCard) {
                        oldParent.appendChild(existingCard);
                        existingCard.style.transform = 'none';
                        sendMoveData(existingCard);
                    }
                    zone.appendChild(card);
                    card.style.transform = 'none';
                    sendMoveData(card);

                    // Re-apply bonuses (Persona might be active/inactive in different rows)
                    applyStaticBonuses(card);
                    if (existingCard) applyStaticBonuses(existingCard);

                    return true;
                }

                // IF CALLING FROM HAND
                if (currentPhase !== 'main') {
                    alert("You can only call units from hand during the Main Phase!");
                    return false;
                }

                const skillLC = (card.dataset.skill || "").toLowerCase();
                const isVairina = (card.dataset.name || "").includes("Vairina");
                const isOD = isVairina && skillLC.includes('overdress') && !skillLC.includes('x-overdress') && !skillLC.includes('xoverdress');
                const isXOD = isVairina && (skillLC.includes('x-overdress') || skillLC.includes('xoverdress'));

                if (isOD || isXOD) {
                    const choice = await vgConfirm(`${card.dataset.name}: คุณต้องการคอลปกติ หรือ Dress (ซ้อนทับยูนิท)? (กด CONFIRM เพื่อ Dress / CANCEL เพื่อคอลปกติ)`);
                    if (choice) {
                        if (isXOD) await performXoverDress(card);
                        else await performOverDress(card);
                        return true;
                    }
                }

                if (cardGrade > vanguardGrade) { alert("Cannot call a unit with grade higher than your Vanguard!"); return false; }

                const dropZone = document.querySelector('.my-side .drop-zone');
                zone.querySelectorAll('.card:not(.opponent-card)').forEach(c => {
                    // Drop Materials first
                    if (c.unitSoul && c.unitSoul.length > 0) {
                        c.unitSoul.forEach(m => {
                            dropZone.appendChild(m);
                            sendMoveData(m);
                        });
                        c.unitSoul = [];
                    }
                    dropZone.appendChild(c);
                    c.classList.remove('rest');
                    c.style.transform = 'none';
                    sendMoveData(c);
                });

                card.dataset.fromHand = "true";
                zone.appendChild(card);
                updateDropCount();

                applyStaticBonuses(card);
                await checkOnPlaceAbilities(card);
                sendMoveData(card);
                updateSoulUI();
                updateHandCount();
                return true;
            }
        }

        // 5. Drop Zone Validation (Discard for Ride Cost)
        if (zone.classList.contains('drop-zone')) {
            if (isFromHand) {
                const isRidePhase = currentPhase === 'ride';
                const canAutoRide = isRidePhase && !hasDiscardedThisTurn && !hasRiddenThisTurn;
                const isDefending = isGuarding;

                if (!canAutoRide && !isDefending) {
                    alert("Movement Blocked: You can only discard from hand to pay for a Ride cost or when Guarding.");
                    return false;
                }

                if (canAutoRide) {
                    const vanguard = document.querySelector('.my-side .circle.vc .card');
                    const vanguardGrade = vanguard ? parseInt(vanguard.dataset.grade) : 0;
                    const nextGrade = vanguardGrade + 1;
                    const rideDeckZone = document.getElementById('ride-deck');
                    const nextRideCard = Array.from(rideDeckZone.querySelectorAll('.card')).find(c => parseInt(c.dataset.grade) === nextGrade);

                    if (nextRideCard) {
                        const discardedCard = card; // The card being moved to Drop is the discard for Ride
                        hasDiscardedThisTurn = true;
                        hasRiddenThisTurn = true;
                        setTimeout(() => {
                            if (vanguard) {
                                soulPool.push(vanguard);
                                vanguard.remove();
                                sendMoveData(vanguard);
                                updateSoulUI();
                            }
                            const vcZone = document.querySelector('.my-side .circle.vc');
                            vcZone.appendChild(nextRideCard);
                            nextRideCard.classList.remove('rest', 'opponent-card');
                            nextRideCard.style.transform = 'none';

                            applyStaticBonuses(nextRideCard);
                            sendMoveData(nextRideCard);
                            handleRideAbilities(nextRideCard, discardedCard);
                            alert(`Auto-Ride: ${nextRideCard.dataset.name}!`);

                            // Move to Main Phase after ride
                            setTimeout(() => {
                                currentPhaseIndex = phases.indexOf('main');
                                updatePhaseUI(true);
                            }, 800);
                        }, 500);

                        } else {
                            alert(`No Grade ${nextGrade} unit found in your Ride Deck!`);
                            return false;
                        }
                    }
                }

            if (card.unitSoul && card.unitSoul.length > 0) {
                card.unitSoul.forEach(m => {
                    zone.appendChild(m);
                    sendMoveData(m);
                });
                card.unitSoul = [];
            }
            zone.appendChild(card);
            card.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            sendMoveData(card);
            updateHandCount();
            updateDropCount();
            return true;
        }
        return false;
    }

    function applyStaticBonuses(card) {
        if (!card) return;
        const name = card.dataset.name || "";
        const parent = card.parentElement;
        const zone = parent ? parent.dataset.zone : "";
        const isFrontRow = zone && (zone.startsWith('rc_front_') || zone === 'vc');

        // Shock Strategy check removed (Legacy)

        // --- Blue Deathster, Asagi Milestone [CONT] ---
        if (name.includes('Asagi Milestone') && zone.startsWith('rc')) {
            if (isMyTurn && lastStrategyPutIntoSoulName !== "") {
                if (card.dataset.asagiBonusApplied !== "true") {
                    card.dataset.power = (parseInt(card.dataset.power || card.dataset.basePower || "0") + 5000).toString();
                    card.dataset.asagiBonusApplied = "true";
                }
            } else if (card.dataset.asagiBonusApplied === "true") {
                card.dataset.power = (parseInt(card.dataset.power || card.dataset.basePower || "0") - 5000).toString();
                card.dataset.asagiBonusApplied = "false";
            }
        }

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

        // --- Avantgarda ACT Skill Power (+5000) ---
        if (card.dataset.avantSkillPowerBuffed === "true" && isMyTurn && zone === 'vc') {
            if (card.dataset.avantSkillBuffApplied !== "true") {
                card.dataset.power = (parseInt(card.dataset.power) + 5000).toString();
                card.dataset.avantSkillBuffApplied = "true";
                syncPowerDisplay(card);
            }
        } else if (card.dataset.avantSkillBuffApplied === "true") {
            card.dataset.power = (parseInt(card.dataset.power) - 5000).toString();
            card.dataset.avantSkillBuffApplied = "false";
            syncPowerDisplay(card);
        }

        // --- Disruption Strategy: Killshroud Power Buff (+5000) ---
        if (card.dataset.killshroudPowerBuffed === "true" && isMyTurn && zone === 'vc') {
            if (card.dataset.killshroudPowerBuffApplied !== "true") {
                card.dataset.power = (parseInt(card.dataset.power) + 5000).toString();
                card.dataset.killshroudPowerBuffApplied = "true";
                syncPowerDisplay(card);
            }
        } else if (card.dataset.killshroudPowerBuffApplied === "true") {
            card.dataset.power = (parseInt(card.dataset.power) - 5000).toString();
            card.dataset.killshroudPowerBuffApplied = "false";
            syncPowerDisplay(card);
        }

        // 1. Persona Ride (+10000 to front row and Vanguard)
        if (personaRideActive && isFrontRow && isMyTurn) {
            if (card.dataset.personaBuffed !== "true") {
                card.dataset.power = parseInt(card.dataset.power) + 10000;
                card.dataset.personaBuffed = "true";
                syncPowerDisplay(card);
            }
        } else {
            if (card.dataset.personaBuffed === "true") {
                card.dataset.power = parseInt(card.dataset.power) - 10000;
                card.dataset.personaBuffed = "false";
                syncPowerDisplay(card);
            }
        }

        // Bomber Strategy Dusting (+10000 Vanguard) - REMOVED DUPLICATE

        // --- Blaster Dark [CONT] (+5000 if RG retired) ---
        if (name.includes('Blaster Dark') && zone.startsWith('rc')) {
            if (isMyTurn && window.myRGRetiredThisTurn) {
                if (card.dataset.darkBonusApplied !== "true") {
                    card.dataset.power = parseInt(card.dataset.power) + 5000;
                    card.dataset.darkBonusApplied = "true";
                }
            } else if (card.dataset.darkBonusApplied === "true") {
                card.dataset.power = parseInt(card.dataset.power) - 5000;
                card.dataset.darkBonusApplied = "false";
            }
        }

        // --- Majesty Lord Blaster [CONT] (+2000 Power / +1 Crit if Blade & Dark in soul) ---
        if (name.includes('Majesty Lord Blaster') && zone === 'vc') {
            const hasBlade = soulPool.some(c => c.dataset.name.includes('Blaster Blade'));
            const hasDark = soulPool.some(c => c.dataset.name.includes('Blaster Dark'));
            if (hasBlade && hasDark) {
                if (card.dataset.majestyBonusApplied !== "true") {
                    card.dataset.power = parseInt(card.dataset.power) + 2000;
                    card.dataset.critical = parseInt(card.dataset.critical || 1) + 1;
                    card.dataset.majestyBonusApplied = "true";
                }
            } else if (card.dataset.majestyBonusApplied === "true") {
                card.dataset.power = parseInt(card.dataset.power) - 2000;
                card.dataset.critical = parseInt(card.dataset.critical || 2) - 1;
                card.dataset.majestyBonusApplied = "false";
            }
        }

        // --- Little Sage, Maron [CONT] (+2000 Power if 3+ units) ---
        if (name.includes('Little Sage, Maron') && zone.startsWith('rc')) {
            const unitCount = document.querySelectorAll('.my-side .circle .card:not(.opponent-card)').length;
            if (isMyTurn && unitCount >= 3) {
                if (card.dataset.maronBonusApplied !== "true") {
                    card.dataset.power = parseInt(card.dataset.power) + 2000;
                    card.dataset.maronBonusApplied = "true";
                }
            } else if (card.dataset.maronBonusApplied === "true") {
                card.dataset.power = parseInt(card.dataset.power) - 2000;
                card.dataset.maronBonusApplied = "false";
            }
        }

        // --- Knight of Old Fate, Cordiela [CONT] (Back Row Center Effects) ---
        if (name.includes('Cordiela')) {
            const vgNode = document.querySelector('.my-side .circle.vc .card');
            const isMajesty = vgNode && vgNode.dataset.name.includes('Majesty');
            const isBackCenter = zone === 'rc_back_center';

            if (isMajesty && isBackCenter) {
                // G2 Boost if Opp G3+
                const oppVG = document.querySelector('.opponent-side .circle.vc .card');
                const oppG3Plus = oppVG && parseInt(oppVG.dataset.grade) >= 3;
                if (oppG3Plus) {
                    document.querySelectorAll('.my-side .circle.rc .card:not(.opponent-card)').forEach(u => {
                        if (parseInt(u.dataset.grade) === 2) {
                            u.dataset.canBoost = "true";
                        }
                    });
                }
            } else {
                // Reset state (remove Boost from G2s if condition lost)
                document.querySelectorAll('.my-side .circle.rc .card:not(.opponent-card)').forEach(u => {
                    if (parseInt(u.dataset.grade) === 2) {
                        delete u.dataset.canBoost;
                    }
                });
            }
        }

        // --- Ordeal Dragon [CONT] (+5000 if Blade & Dark in soul) ---
        if (name.includes('Ordeal Dragon') && zone.startsWith('rc')) {
            const hasBlade = soulPool.some(c => c.dataset.name.includes('Blaster Blade'));
            const hasDark = soulPool.some(c => c.dataset.name.includes('Blaster Dark'));
            if (isMyTurn && hasBlade && hasDark) {
                if (card.dataset.ordealBonusApplied !== "true") {
                    card.dataset.power = parseInt(card.dataset.power) + 5000;
                    card.dataset.ordealBonusApplied = "true";
                }
            } else if (card.dataset.ordealBonusApplied === "true") {
                card.dataset.power = parseInt(card.dataset.power) - 5000;
                card.dataset.ordealBonusApplied = "false";
            }
        }

        // 2. Final Burst Action (Handled directly via Skills, not generic Front Buff anymore)
        // Kept empty to maintain comment numbering and logic separation.

        // 3. Jamil [CONT] Burst (+10000 Power / +5000 Shield) - Only for owner
        if (isFinalBurst && name.includes('Jamil')) {
            if (card.dataset.burstBonusApplied !== "true") {
                card.dataset.power = parseInt(card.dataset.power) + 10000;
                card.dataset.shield = parseInt(card.dataset.shield || "5000") + 5000;
                card.dataset.burstBonusApplied = "true";
            }
        } else {
            if (card.dataset.burstBonusApplied === "true") {
                card.dataset.power = parseInt(card.dataset.power) - 10000;
                card.dataset.shield = parseInt(card.dataset.shield || "5000") - 5000;
                card.dataset.burstBonusApplied = "false";
            }
        }

        // --- Dark States OT Rest of Game Effect (Your Turn Only) ---
        if (window.otDarkStatesActive && isMyTurn && zone === 'vc') {
            if (card.dataset.otDarkStatesActiveBuff !== "true") {
                card.dataset.power = parseInt(card.dataset.power) + 10000;
                card.dataset.critical = parseInt(card.dataset.critical || 1) + 1;
                card.dataset.otDarkStatesActiveBuff = "true";
            }
        } else if (card.dataset.otDarkStatesActiveBuff === "true") {
            card.dataset.power = parseInt(card.dataset.power) - 10000;
            card.dataset.critical = parseInt(card.dataset.critical || 2) - 1;
            card.dataset.otDarkStatesActiveBuff = "false";
        }

        // --- Stoicheia OT Front Row +10000 (Until end of turn) ---
        if (window.otStoicheiaActive && isMyTurn && isFrontRow) {
            if (card.dataset.otStoicheiaBuff !== "true") {
                card.dataset.power = parseInt(card.dataset.power) + 10000;
                card.dataset.otStoicheiaBuff = "true";
            }
        } else if (card.dataset.otStoicheiaBuff === "true") {
            card.dataset.power = parseInt(card.dataset.power) - 10000;
            card.dataset.otStoicheiaBuff = "false";
        }

        // --- Galondight / Vairina Arcs Turn-End Buffs ---
        if (card.dataset.turnEndBuffActive === "true" && isMyTurn) {
            const val = parseInt(card.dataset.turnEndBuffPower || "0");
            if (card.dataset.turnEndBuffApplied !== "true") {
                card.dataset.power = parseInt(card.dataset.power) + val;
                card.dataset.turnEndBuffApplied = "true";
            }
        } else if (card.dataset.turnEndBuffApplied === "true") {
            const val = parseInt(card.dataset.turnEndBuffPower || "0");
            card.dataset.power = parseInt(card.dataset.power) - val;
            card.dataset.turnEndBuffApplied = "false";
            card.dataset.turnEndBuffPower = "0";
        }


        // --- Disruption Strategy: Killshroud Debuff ---
        if (window.killshroudDebuffActive && name.includes('Avantgarda') === false && zone === 'vc' && !isMyTurn) {
            if (card.dataset.killshroudDebuffApplied !== "true") {
                card.dataset.power = parseInt(card.dataset.power) - 5000;
                card.dataset.killshroudDebuffApplied = "true";
            }
        } else if (card.dataset.killshroudDebuffApplied === "true") {
            card.dataset.power = parseInt(card.dataset.power) + 5000;
            card.dataset.killshroudDebuffApplied = "false";
        }


        // 4. Final Rush Static Bonus - Only for owner
        if (isFinalRush) {
            let frBonus = 0;
            if (name.includes('Eden') || name.includes('Julian') || name.includes('Steve') || name.includes('Richard')) frBonus = 5000;
            else if (name.includes('Ivanka')) frBonus = 2000;

            if (frBonus > 0 && card.dataset.frBonusApplied !== "true") {
                card.dataset.power = parseInt(card.dataset.power) + frBonus;
                card.dataset.frBonusApplied = "true";
            }
        } else {
            if (card.dataset.frBonusApplied === "true") {
                let frBonus = 0;
                if (name.includes('Eden') || name.includes('Julian') || name.includes('Steve') || name.includes('Richard')) frBonus = 5000;
                else if (name.includes('Ivanka')) frBonus = 2000;
                card.dataset.power = parseInt(card.dataset.power) - frBonus;
                card.dataset.frBonusApplied = "false";
            }
        }

        // 5. Stefanie Column Bonus - Works in opponent's turn too if WE are in Final Rush/Burst
        let stefanieBonus = 0;
        if (isFinalRush || isFinalBurst) {
            let myCol = null;
            if (zone.includes('left')) myCol = 'left';
            else if (zone.includes('right')) myCol = 'right';
            else if (zone.includes('center') || zone === 'vc') myCol = 'center';
            if (myCol) {
                const colZones = myCol === 'left' ? ['rc_front_left', 'rc_back_left'] :
                    myCol === 'right' ? ['rc_front_right', 'rc_back_right'] :
                        ['vc', 'rc_back_center'];
                colZones.forEach(z => {
                    if (z !== zone) {
                        const targetCircle = document.querySelector(`.my-side .circle[data-zone="${z}"]`);
                        if (targetCircle) {
                            const c = targetCircle.querySelector('.card:not(.opponent-card)');
                            if (c && c.dataset.name.includes('Stefanie')) stefanieBonus = 5000;
                        }
                    }
                });
            }
        }

        if (stefanieBonus > 0 && card.dataset.stefanieBuffed !== "true") {
            card.dataset.power = parseInt(card.dataset.power) + stefanieBonus;
            card.dataset.stefanieBuffed = "true";
            syncPowerDisplay(card);
        } else if (stefanieBonus === 0 && card.dataset.stefanieBuffed === "true") {
            card.dataset.power = parseInt(card.dataset.power) - 5000;
            card.dataset.stefanieBuffed = "false";
            syncPowerDisplay(card);
        }

        // --- Bomber Strategy: Dusting Buff ---
        if (bomberDustingPowerBuff && name.includes('Avantgarda') && zone === 'vc' && isMyTurn) {
            if (card.dataset.dustingBuffApplied !== "true") {
                card.dataset.power = (parseInt(card.dataset.power) + 10000).toString();
                card.dataset.dustingBuffApplied = "true";
                syncPowerDisplay(card);
            }
        } else if (card.dataset.dustingBuffApplied === "true") {
            card.dataset.power = (parseInt(card.dataset.power) - 10000).toString();
            card.dataset.dustingBuffApplied = "false";
            syncPowerDisplay(card);
        }

        // 6. Magnolia Elder [CONT] Bonus (+5000 to all rear-guards)
        const isElderActive = isMagnoliaElderSkillActive();
        const isOnRC = parent && parent.classList.contains('rc');
        if (isElderActive && isOnRC) {
            if (card.dataset.elderBuffed !== "true") {
                card.dataset.power = parseInt(card.dataset.power) + 5000;
                card.dataset.elderBuffed = "true";
            }
        } else {
            if (card.dataset.elderBuffed === "true") {
                card.dataset.power = parseInt(card.dataset.power) - 5000;
                card.dataset.elderBuffed = "false";
            }
        }

        // 7. Winnsapooh [CONT](RC) Bonus (+10000 if Magnolia was placed this turn)
        if (name.includes('Winnsapooh') && isOnRC && hasRiddenThisTurn) {
            const vg = document.querySelector('.my-side .circle.vc .card');
            const vgName = (vg ? vg.dataset.name : "").toLowerCase();
            if (vgName.includes('magnolia')) {
                if (card.dataset.winnsapoohPlacedBuff !== "true") {
                    card.dataset.power = parseInt(card.dataset.power) + 10000;
                    card.dataset.winnsapoohPlacedBuff = "true";
                }
            }
        } else {
            if (card.dataset.winnsapoohPlacedBuff === "true") {
                card.dataset.power = parseInt(card.dataset.power) - 10000;
                card.dataset.winnsapoohPlacedBuff = "false";
            }
        }

        // 8. Enpix [CONT] Back Row (RC): +10000 Power
        const isBackRow = zone && zone.startsWith('rc_back_');
        if (name.includes('Enpix') && isBackRow) {
            if (card.dataset.enpixBackBuffed !== "true") {
                card.dataset.power = parseInt(card.dataset.power) + 10000;
                card.dataset.enpixBackBuffed = "true";
            }
        }

        // 9. Garou Vairina [CONT] X-overDress +10000 Power
        if (name.includes('Garou Vairina') && card.dataset.isXoverDress === "true") {
            if (card.dataset.garouXoverBuffed !== "true") {
                card.dataset.power = parseInt(card.dataset.power) + 10000;
                card.dataset.garouXoverBuffed = "true";
            }
        } else {
            if (card.dataset.garouXoverBuffed === "true") {
                card.dataset.power = parseInt(card.dataset.power) - 10000;
                card.dataset.garouXoverBuffed = "false";
            }
        }

        // 10. Vils Vairina [CONT] X-overDress +5000 Power / +10000 Shield / Resist
        if (name.includes('Vils Vairina') && card.dataset.isXoverDress === "true") {
            if (card.dataset.vilsXoverBuffed !== "true") {
                card.dataset.power = parseInt(card.dataset.power) + 5000;
                card.dataset.shield = parseInt(card.dataset.shield || "10000") + 10000;
                card.dataset.vilsXoverBuffed = "true";
                card.dataset.resist = "true";
            }
        } else {
            if (card.dataset.vilsXoverBuffed === "true") {
                card.dataset.power = parseInt(card.dataset.power) - 5000;
                card.dataset.shield = parseInt(card.dataset.shield || "20000") - 10000;
                card.dataset.vilsXoverBuffed = "false";
                card.dataset.resist = "false";
            }
        }

        // 11. Charis [CONT](RC): +2000 if order played
        if (name.includes('Charis') && isOnRC && orderPlayedThisTurn) {
            if (card.dataset.charisOrderBuff !== "true") {
                card.dataset.power = parseInt(card.dataset.power) + 2000;
                card.dataset.charisOrderBuff = "true";
            }
        } else if (card.dataset.charisOrderBuff === "true") {
            card.dataset.power = parseInt(card.dataset.power) - 2000;
            card.dataset.charisOrderBuff = "false";
        }

        // 6. Nirvana Jheva Ride Line Column Bonus (+5000 if Prayer Dragon in column)
        const isRinoOrReiyu = name.includes('Rino') || name.includes('Reiyu');
        if (isRinoOrReiyu && isMyTurn) {
            let myCol = null;
            if (zone.includes('left')) myCol = 'left';
            else if (zone.includes('right')) myCol = 'right';
            else if (zone.includes('center') || zone === 'vc') myCol = 'center';

            if (myCol) {
                const colZones = myCol === 'left' ? ['rc_front_left', 'rc_back_left'] :
                    myCol === 'right' ? ['rc_front_right', 'rc_back_right'] :
                        ['vc', 'rc_back_center'];

                let hasPrayerDragon = false;
                colZones.forEach(z => {
                    if (z !== zone) {
                        const targetCircle = document.querySelector(`.my-side .circle[data-zone="${z}"]`);
                        const otherCard = targetCircle ? targetCircle.querySelector('.card:not(.opponent-card)') : null;
                        if (otherCard && (otherCard.dataset.name.includes('Equip Dragon') || otherCard.dataset.name.includes('Trickstar'))) {
                            hasPrayerDragon = true;
                        }
                    }
                });

                if (hasPrayerDragon && card.dataset.columnBonusApplied !== "true") {
                    card.dataset.power = parseInt(card.dataset.power) + 5000;
                    card.dataset.columnBonusApplied = "true";
                } else if (!hasPrayerDragon && card.dataset.columnBonusApplied === "true") {
                    card.dataset.power = parseInt(card.dataset.power) - 5000;
                    card.dataset.columnBonusApplied = "false";
                }
            }
        }

        syncPowerDisplay(card);
    }

    function syncPowerDisplay(card) {
        if (!card) return;

        const pSpan = card.querySelector('.card-power');
        if (pSpan) {
            const powerVal = parseInt(card.dataset.power || "0");
            const cVal = parseInt(card.dataset.critical || "1");
            let dCrit = cVal > 1 ? `<span style="color:gold;">★${cVal}</span>` : '';
            pSpan.innerHTML = `⚔️${powerVal >= 1000000 ? (powerVal/1000000).toFixed(1) + 'M' : powerVal} ${dCrit}`;
        }
        const sSpan = card.querySelector('.card-shield');
        if (sSpan) {
            sSpan.innerHTML = `🛡️${card.dataset.shield}`;
        }

        // Broadcast change if it's on a circle
        if (card.parentElement && card.parentElement.classList.contains('circle')) {
            sendMoveData(card);
        }

        // Auto Turn End Prompt - only check when not in targeting mode
        if (isMyTurn && phases[currentPhaseIndex] === 'battle' && !document.body.classList.contains('targeting-mode')) {
            checkAllAttackersRested();
        }
    }

    function checkAllAttackersRested() {
        if (!isMyTurn || phases[currentPhaseIndex] !== 'battle') return;
        if (isWaitingForGuard || currentAttackResolving) return;
        if (document.body.classList.contains('targeting-mode')) return;

        // Check front-row RC units and Vanguard
        const allFieldUnits = Array.from(document.querySelectorAll('.my-side .circle .card:not(.opponent-card)'));
        const canAttackUnits = allFieldUnits.filter(u => {
            const z = u.parentElement ? (u.parentElement.dataset.zone || '') : '';
            // Front row RCs and Vanguard can attack
            return z === 'vc' || z === 'rc_front_left' || z === 'rc_front_right';
        });

        // If all units that CAN attack are rested
        const standingAttackers = canAttackUnits.filter(u => !u.classList.contains('rest'));

        if (standingAttackers.length === 0 && canAttackUnits.length > 0 && !window.promptedEndTurn) {
            window.promptedEndTurn = true;
            setTimeout(async () => {
                // Double-check state hasn't changed
                if (!isMyTurn || phases[currentPhaseIndex] !== 'battle') { window.promptedEndTurn = false; return; }
                if (isWaitingForGuard || currentAttackResolving || document.body.classList.contains('targeting-mode')) { window.promptedEndTurn = false; return; }

                const recheck = Array.from(document.querySelectorAll('.my-side .circle .card:not(.opponent-card)'))
                    .filter(u => {
                        const z = u.parentElement ? (u.parentElement.dataset.zone || '') : '';
                        return (z === 'vc' || z === 'rc_front_left' || z === 'rc_front_right') && !u.classList.contains('rest');
                    });

                if (recheck.length === 0) {
                    if (await vgConfirm("ยูนิทที่โจมตีได้ทั้งหมดอยู่ในสภาพ Rest แล้ว คุณต้องการจบเทิร์นหรือไม่?")) {
                        // Auto-click the End Turn button
                        nextTurnBtn.click();
                    }
                }
                window.promptedEndTurn = false;
            }, 1500);
        }
    }

    async function handleMajestyAttackSkills(vanguard) {
        const rcUnits = Array.from(document.querySelectorAll('.my-side .circle.rc .card:not(.opponent-card)'));
        const blade = rcUnits.find(c => c.dataset.name === 'Blaster Blade');
        const dark = rcUnits.find(c => c.dataset.name === 'Blaster Dark');

        if (!blade && !dark) return;

        let options = [];
        if (blade && dark) options.push("Both (Retire & Drive+1)");
        if (blade) options.push("Blaster Blade (Retire 1)");
        if (dark) options.push("Blaster Dark (Drive +1)");
        options.push("None");

        const msg = "Majesty Lord Blaster: เลือกความสามารถที่ต้องการใช้งาน (นำยูนิทเข้าโซล)";
        const choice = await vgConfirm(`${msg}\n\n${options.join(" | ")}\n\n(กด CONFIRM เพื่อเลือก / CANCEL เพื่อข้าม)`);

        if (!choice) return;

        // Since vgConfirm is binary, let's use a simpler sequential flow if they confirmed
        const useBoth = blade && dark && await vgConfirm("เลือกใช้งาน 'ทั้งคู่' (Blade และ Dark) ใช่หรือไม่?");

        if (useBoth) {
            // Process both
            [blade, dark].forEach(c => {
                const circle = c.parentElement;
                if (circle) circle.removeChild(c);
                soulPool.push(c);
                sendMoveData(c);
            });
            updateSoulUI();
            vanguard.dataset.power = parseInt(vanguard.dataset.power) + 20000;
            vanguard.dataset.majestyDriveBuff = "true";
            syncPowerDisplay(vanguard);
            alert("Majesty: นำ Blade & Darkเข้าโซล! (Power +20000, Drive +1)");

            // Retire prompt
            await majestyRetireLogic(vanguard);
        } else {
            const useBlade = blade && await vgConfirm("เลือกใช้งานเฉพาะ 'Blaster Blade' (Retire 1) ใช่หรือไม่?");
            if (useBlade) {
                const circle = blade.parentElement;
                if (circle) circle.removeChild(blade);
                soulPool.push(blade);
                updateSoulUI();
                sendMoveData(blade);
                vanguard.dataset.power = parseInt(vanguard.dataset.power) + 10000;
                syncPowerDisplay(vanguard);
                await majestyRetireLogic(vanguard);
            } else if (dark && await vgConfirm("เลือกใช้งานเฉพาะ 'Blaster Dark' (Drive +1) ใช่หรือไม่?")) {
                const circle = dark.parentElement;
                if (circle) circle.removeChild(dark);
                soulPool.push(dark);
                updateSoulUI();
                sendMoveData(dark);
                vanguard.dataset.power = parseInt(vanguard.dataset.power) + 10000;
                vanguard.dataset.majestyDriveBuff = "true";
                syncPowerDisplay(vanguard);
                alert("Majesty: ได้รับ Drive +1 และ Power +10000!");
            }
        }
        updateAllStaticBonuses(); // Ensure +2k/+1crit CONT ability is checked
    }

    async function majestyRetireLogic(vanguard) {
        const oppRGs = Array.from(document.querySelectorAll('.opponent-side .circle.rc .card'));
        const validTargets = oppRGs.filter(c => !isCardResistant(c));
        if (validTargets.length > 0) {
            alert("เลือกเรียร์การ์ดคู่แข่ง 1 ใบเพื่อรีไทร์");
            document.body.classList.add('targeting-mode');
            await new Promise(resolve => {
                const h = (e) => {
                    const t = e.target.closest('.opponent-side .circle.rc .card');
                    if (t) {
                        if (isCardResistant(t)) {
                            alert("ยูนิทนี้มี Resist! เลือกไม่ได้");
                            return;
                        }
                        e.stopPropagation();
                        document.querySelector('.opponent-side .drop-zone').appendChild(t);
                        sendData({ type: 'forceRetire', cardId: t.id.replace('opp-', '') });
                        document.body.classList.remove('targeting-mode');
                        document.removeEventListener('click', h, true);
                        applyStaticBonuses(vanguard);
                        resolve();
                    }
                };
                document.addEventListener('click', h, true);
            });
        } else {
            alert("คู่แข่งไม่มีเรียร์การ์ดให้รีไทร์!");
            applyStaticBonuses(vanguard);
        }
    }

    function isMagnoliaElderSkillActive() {
        const vg = document.querySelector('.my-side .circle.vc .card');
        if (!vg || !vg.dataset.name.includes('Magnolia Elder')) return false;

        const hasInSoul = soulPool.some(c => c.dataset.name.includes('Magnolia'));
        if (hasInSoul) return true;

        const hasOnField = Array.from(document.querySelectorAll('.my-side .circle.rc .card:not(.opponent-card)'))
            .some(c => c.dataset.name.includes('Magnolia'));
        return hasOnField;
    }

    function isCardResistant(card) {
        if (!card) return false;
        const rgCount = document.querySelectorAll('.my-side .circle.rc .card:not(.opponent-card)').length;
        if (rgCount <= 3) {
            const zone = card.parentElement ? card.parentElement.dataset.zone : null;
            if (zone) {
                const columnZones = {
                    'rc_front_left': ['rc_front_left', 'rc_back_left'],
                    'rc_back_left': ['rc_front_left', 'rc_back_left'],
                    'rc_front_right': ['rc_front_right', 'rc_back_right'],
                    'rc_back_right': ['rc_front_right', 'rc_back_right'],
                    'vc': ['vc', 'rc_back_center'],
                    'rc_back_center': ['vc', 'rc_back_center']
                };
                const myCol = columnZones[zone];
                if (myCol) {
                    const hasEnpix = myCol.some(z => {
                        const circle = document.querySelector(`.my-side .circle[data-zone="${z}"]`);
                        if (!circle) return false;
                        const c = circle.querySelector('.card:not(.opponent-card)');
                        return c && c.dataset.name.includes('Enpix');
                    });
                    if (hasEnpix) return true;
                }
            }
        }
        const name = card.dataset.name || "";
        if (name.includes('Trickstar') || name.includes('Enpix') || card.dataset.resist === "true") return true;
        return false;
    }




    async function processInletPulse(units) {
        const queue = units.map(unit => {
            return {
                name: 'Inlet Pulse Dragon',
                description: '[AUTO](RC) End of turn: Put into soul, draw 1 card.',
                resolve: async (done) => {
                    if (await vgConfirm(`Inlet Pulse Dragon: [AUTO](RC) เมื่อจบเทิร์นของคุณ หากมีการโจมตี 4 ครั้งขึ้นไปในเทิร์นนี้ [ต้นทุน][นำยูนิทนี้เข้าสู่โซล] จั่วการ์ด 1 ใบ?`)) {
                        const parent = unit.parentElement;
                        if (parent && parent.classList.contains('circle')) {
                            soulPool.push(unit);
                            // Avoid modifying parent.innerHTML directly to not destroy UI logic unexpectedly.
                            unit.remove();
                            // Update soul counter on VC
                            const vc = document.querySelector('.my-side .circle.vc');
                            if (vc) {
                                let badge = vc.querySelector('#soul-counter');
                                if (!badge) {
                                    vc.insertAdjacentHTML('beforeend', `<div id="soul-counter" class="soul-badge">Soul: ${soulPool.length}</div>`);
                                    vc.querySelector('#soul-counter').addEventListener('click', handleSoulView);
                                } else {
                                    badge.textContent = `Soul: ${soulPool.length}`;
                                }
                            }
                            updateSoulUI();
                            drawCard(true);
                            alert("Inlet Pulse Dragon: สำเร็จ! จั่วการ์ด 1 ใบ");
                            // Broadcast the move
                            sendData({
                                type: 'moveCard',
                                cardId: unit.id,
                                zone: 'soul'
                            });
                        }
                    }
                    if (done) done();
                }
            };
        });

        if (queue.length > 0) {
            await resolveAbilityQueue(queue);
        }
    }

    async function checkOnPlaceAbilities(card) {
        if (!card) return;
        const name = card.dataset.name || "";
        const parent = card.parentElement;
        if (!parent) return;
        const zone = parent.dataset.zone || "";
        const isRC = zone.startsWith('rc');
        const isFromHand = card.dataset.fromHand === "true";

        const vg = document.querySelector('.my-side .circle.vc .card');
        const vgName = vg ? vg.dataset.name : "";
        const hasBlueDeathsterOrAvant = vgName.includes('Blue Deathster') || vgName.includes('Avantgarda');

        // --- Ala Dargente [AUTO]: เมื่อวางบน (RC) [SB1] ค้นหา Strategy Card จากกอง ---
        if (name.includes('Ala Dargente') && isRC && isFromHand) {
            if (soulPool.length > 0) {
                if (await vgConfirm("Ala Dargente: [AUTO] เมื่อวางบน (RC) [SB1] ค้นหา Strategy Card จากกองที่ชื่อไม่ซ้ำกับที่เพิ่งใส่โซล นำ 1 ใบขึ้นมือ?")) {
                    if (await paySoulBlast(1)) {
                        // Find Strategy Cards in deck
                        const strategyCards = deckPool.filter(c =>
                            c.skill && c.skill.includes('Strategy') && c.skill.includes('[Set Order]')
                        );

                        // Filter out cards with same name as what was just put into soul
                        const uniqueStrategies = strategyCards.filter(c =>
                            c.name !== lastStrategyPutIntoSoulName
                        );

                        if (uniqueStrategies.length > 0) {
                            openViewer("เลือก Strategy Card 1 ใบ (ชื่อไม่ซ้ำ)", uniqueStrategies);
                            await new Promise(resolve => {
                                const pickHandler = (e) => {
                                    const clicked = e.target.closest('.card');
                                    if (clicked && clicked.parentElement === viewerGrid) {
                                        const selectedName = clicked.dataset.name;
                                        const idx = deckPool.findIndex(c => c.name === selectedName);
                                        if (idx !== -1) {
                                            const pickedData = deckPool.splice(idx, 1)[0];
                                            const pickedCard = createCardElement(pickedData);
                                            playerHand.appendChild(pickedCard);
                                            updateHandSpacing();
                                            updateDeckCounter();
                                            updateHandCount();
                                            sendMoveData(pickedCard);
                                            deckPool.sort(() => 0.5 - Math.random()); // Shuffle
                                            alert(`Ala Dargente: ${pickedData.name} ขึ้นมือแล้ว!`);
                                        }
                                        viewerGrid.removeEventListener('click', pickHandler);
                                        zoneViewer.classList.add('hidden');
                                        resolve();
                                    }
                                };
                                viewerGrid.addEventListener('click', pickHandler);
                            });
                        } else {
                            alert("ไม่พบ Strategy Card ที่ชื่อไม่ซ้ำในกอง!");
                        }
                    }
                }
            }
        }

        // --- Asagi Milestone [AUTO]: เมื่อวางบน (RC) [CB1] ค้นหา "Avantgarda" G3+ จากดรอป ---
        if (name.includes('Asagi Milestone') && isRC && isFromHand && hasBlueDeathsterOrAvant) {
            const dropZone = document.querySelector('.my-side .drop-zone');
            const avantInDrop = Array.from(dropZone.querySelectorAll('.card')).filter(c =>
                c.dataset.name.includes('Avantgarda') && parseInt(c.dataset.grade) >= 3
            );

            if (avantInDrop.length > 0) {
                if (await vgConfirm("Asagi Milestone: [AUTO] เมื่อวางบน (RC) [CB1] เลือก 'Avantgarda' G3+ จากดรอป 1 ใบขึ้นมือ?")) {
                    if (payCounterBlast(1)) {
                        if (avantInDrop.length === 1) {
                            const picked = avantInDrop[0];
                            playerHand.appendChild(picked);
                            updateHandSpacing();
                            updateHandCount();
                            updateDropCount();
                            sendMoveData(picked);
                            alert(`Asagi Milestone: ${picked.dataset.name} ขึ้นมือแล้ว!`);
                        } else {
                            openViewer("เลือก Avantgarda G3+ 1 ใบจากดรอป", avantInDrop.map(c => ({
                                name: c.dataset.name,
                                grade: c.dataset.grade,
                                power: c.dataset.power,
                                shield: c.dataset.shield,
                                skill: c.dataset.skill,
                                id: c.id,
                                imageUrl: c.querySelector('img')?.src || ''
                            })));
                            await new Promise(resolve => {
                                const pickHandler = (e) => {
                                    const clicked = e.target.closest('.card');
                                    if (clicked && clicked.parentElement === viewerGrid) {
                                        const selectedId = clicked.dataset.originalId || clicked.id;
                                        const actual = avantInDrop.find(c => c.id === selectedId);
                                        if (actual) {
                                            playerHand.appendChild(actual);
                                            updateHandSpacing();
                                            updateHandCount();
                                            updateDropCount();
                                            sendMoveData(actual);
                                            alert(`Asagi Milestone: ${actual.dataset.name} ขึ้นมือแล้ว!`);
                                        }
                                        viewerGrid.removeEventListener('click', pickHandler);
                                        zoneViewer.classList.add('hidden');
                                        resolve();
                                    }
                                };
                                viewerGrid.addEventListener('click', pickHandler);
                            });
                        }
                    }
                }
            }
        }

        // --- Hanada Halfway [AUTO]: เมื่อวางบน (RC) [CB1] จั่วการ์ด 1 ใบ ---
        if (name.includes('Hanada Halfway') && isRC && isFromHand && hasBlueDeathsterOrAvant) {
            if (await vgConfirm("Hanada Halfway: [AUTO] เมื่อวางบน (RC) [CB1] จั่วการ์ด 1 ใบ?")) {
                if (payCounterBlast(1)) {
                    drawCard(true);
                    alert("Hanada Halfway: จั่ว 1 ใบสำเร็จ!");
                }
            }
        }
    }

    async function checkDropAbilities(newVanguard) {
        const vgName = (newVanguard.dataset.name || "").toLowerCase();
        if (!vgName.includes('magnolia')) return;

        const dropZone = document.querySelector('.my-side .drop-zone');
        if (!dropZone) return;
        const cardsInDrop = Array.from(dropZone.querySelectorAll('.card'));

        for (const card of cardsInDrop) {
            const name = card.dataset.name || "";
            if (name.includes('Goildoat')) {
                const hasGoildoatInSoul = soulPool.some(c => c.dataset.name.includes('Goildoat'));
                if (!hasGoildoatInSoul) {
                    if (await vgConfirm(`Goildoat (Drop): [AUTO] เมื่อไรด์ Magnolia จ่าย [เข้าโซล] เพื่อให้ VG พลัง+5000?`)) {
                        soulPool.push(card);
                        card.remove();
                        updateSoulUI();
                        updateDropCount();

                        newVanguard.dataset.power = parseInt(newVanguard.dataset.power) + 5000;
                        syncPowerDisplay(newVanguard);
                        alert("Goildoat: เข้าสู่โซลแล้ว! แวนการ์ดพลัง +5000");

                        sendData({
                            type: 'moveCard',
                            cardId: card.id,
                            zone: 'soul'
                        });
                        break;
                    }
                }
            }
        }
    }

    function updateAllStaticBonuses() {
        document.querySelectorAll('.my-side .circle .card:not(.opponent-card), .my-side .guardian-circle .card:not(.opponent-card)').forEach(c => {
            applyStaticBonuses(c);
            syncPowerDisplay(c); // Ensure power display and sendMoveData for opponent sync
        });
    }

    function triggerPersonaRide() {
        personaRideActive = true;

        // 1. Alert and Broadcast
        alert("PERSONA RIDE! Front row units get +10000 Power for the turn, and Draw 1 card!");
        sendData({ type: 'announcePersona' });

        // 2. Power up existing FRONT ROW units
        document.querySelectorAll('.my-side .circle .card:not(.opponent-card)').forEach(unit => {
            const zone = unit.parentElement ? unit.parentElement.dataset.zone : "";
            if ((zone && zone.startsWith('rc_front_')) || (unit.parentElement && unit.parentElement.classList.contains('vc'))) {
                // Check if already buffed to avoid double application (especially on the new V)
                if (unit.dataset.personaBuffed !== "true") {
                    unit.dataset.power = parseInt(unit.dataset.power) + 10000;
                    unit.dataset.personaBuffed = "true";
                    syncPowerDisplay(unit);
                }
            }
        });

        // 3. Draw 1 card
        setTimeout(() => drawCard(true), 500);

        // 4. Skip to Main Phase immediately
        setTimeout(() => {
            currentPhaseIndex = phases.indexOf('main');
            updatePhaseUI(true);
        }, 1200);
    }

    async function handleRideAbilities(newVanguard, discardedCard = null) {
        if (!newVanguard || (soulPool.length === 0 && !discardedCard)) {
            console.log("Ride Ability Check Skipped: Soul empty or no unit.");
            return;
        }
        // The card just ridden over is the last one added to soulPool in validateAndMoveCard
        const oldVanguard = soulPool.length > 0 ? soulPool[soulPool.length - 1] : null;
        console.log(`Ride Triggered: ${oldVanguard ? oldVanguard.dataset.name : "None"} -> ${newVanguard.dataset.name}`);
        await checkRideAbilities(oldVanguard, newVanguard, discardedCard);
    }


    function payCounterBlast(cost) {
        const openCards = Array.from(document.querySelectorAll('.my-side .damage-zone .card:not(.face-down)'));
        if (openCards.length < cost) {
            alert(`CB${cost} 失敗！ดาเมจโซนที่เปิดอยู่ไม่พอ (มี ${openCards.length} ใบ ต้องการ ${cost} ใบ)`);
            return false;
        }
        for (let i = 0; i < cost; i++) {
            openCards[i].classList.add('face-down');
            sendMoveData(openCards[i]);
        }
        alert(`Counter Blast ${cost} จ่ายสำเร็จ!`);
        return true;
    }

    function promptCallFromDrop(count, filterFn, powerBonus = 0, onComplete = null) {
        const dropZone = document.querySelector('.my-side .drop-zone');
        const eligibleCards = Array.from(dropZone.querySelectorAll('.card')).filter(c => {
            if (c.classList.contains('opponent-card')) return false;
            if (filterFn && !filterFn(c)) return false;
            return true;
        });

        if (eligibleCards.length === 0) {
            alert("ไม่พบการ์ดที่ตรงเงื่อนไขในดรอปโซน!");
            if (onComplete) onComplete();
            return;
        }

        openViewer("เลือกการ์ดจากดรอปโซนเพื่อคอล", eligibleCards.map(c => ({
            name: c.dataset.name,
            grade: c.dataset.grade,
            power: c.dataset.power,
            shield: c.dataset.shield,
            skill: c.dataset.skill,
            id: c.id,
            imageUrl: c.querySelector('img')?.src || ''
        })));

        const pickHandler = (e) => {
            const clicked = e.target.closest('.card');
            if (clicked && clicked.parentElement === viewerGrid) {
                const selectedId = clicked.dataset.originalId || clicked.id;
                const actual = eligibleCards.find(c => c.id === selectedId);
                if (actual) {
                    viewerGrid.removeEventListener('click', pickHandler);
                    zoneViewer.classList.add('hidden');

                    // Prompt for RC selection
                    alert("เลือก RC เพื่อวางการ์ด");
                    document.body.classList.add('targeting-mode');
                    const rcHandler = (ev) => {
                        const circle = ev.target.closest('.my-side .circle.rc');
                        if (circle) {
                            ev.stopPropagation();
                            // Replace existing card if any
                            const existing = circle.querySelector('.card:not(.opponent-card)');
                            if (existing) {
                                dropZone.appendChild(existing);
                                existing.classList.remove('rest');
                                existing.style.transform = 'none';
                                sendMoveData(existing);
                            }
                            circle.appendChild(actual);
                            actual.classList.remove('rest');
                            actual.style.transform = 'none';

                            if (powerBonus > 0) {
                                actual.dataset.power = (parseInt(actual.dataset.power) + powerBonus).toString();
                                actual.dataset.turnEndBuffPower = (parseInt(actual.dataset.turnEndBuffPower || "0") + powerBonus).toString();
                                actual.dataset.turnEndBuffActive = "true";
                                alert(`${actual.dataset.name}: พลัง +${powerBonus}!`);
                            }

                            applyStaticBonuses(actual);
                            syncPowerDisplay(actual);
                            sendMoveData(actual);
                            updateDropCount();
                            document.body.classList.remove('targeting-mode');
                            document.removeEventListener('click', rcHandler, true);

                            if (onComplete) onComplete();
                        }
                    };
                    document.addEventListener('click', rcHandler, true);
                }
            }
        };
        viewerGrid.addEventListener('click', pickHandler);
    }

    async function paySoulBlast(cost) {
        if (soulPool.length < cost) {
            alert("Insufficient Soul for SB!");
            return false;
        }

        return new Promise(resolve => {
            openViewer(`Select ${cost} card(s) to Soul Blast`, soulPool);
            let selectedCount = 0;
            const chosenIndices = [];

            const sel = (e) => {
                const clicked = e.target.closest('.card');
                if (clicked && clicked.parentElement === viewerGrid) {
                    const originalId = clicked.dataset.originalId;
                    const idx = soulPool.findIndex(c => c.id === originalId);
                    if (idx !== -1 && !chosenIndices.includes(idx)) {
                        chosenIndices.push(idx);
                        clicked.style.opacity = '0.5';
                        selectedCount++;
                        if (selectedCount >= cost) {
                            viewerGrid.removeEventListener('click', sel);
                            zoneViewer.classList.add('hidden');

                            chosenIndices.sort((a, b) => b - a);
                            const dropZone = document.querySelector('.my-side .drop-zone');
                            for (let i of chosenIndices) {
                                const blasted = soulPool.splice(i, 1)[0];
                                dropZone.appendChild(blasted);
                                sendMoveData(blasted);
                            }
                            updateSoulUI();
                            updateDropCount();
                            resolve(true);
                        }
                    }
                }
            };
            viewerGrid.addEventListener('click', sel);
        });
    }

    function promptCallSteveVC() {
        if (soulPool.length === 0) {
            alert("Soul is empty! Performing Soul Charge 1 only.");
            soulCharge(1);
            return;
        }
        openViewer("Select 1 card to CALL to Center Back Row", soulPool);

        const selectionHandler = (e) => {
            const clicked = e.target.closest('.card');
            if (clicked && clicked.parentElement === viewerGrid) {
                const originalId = clicked.dataset.originalId;
                const originalIndex = soulPool.findIndex(c => c.id === originalId);

                if (originalIndex !== -1) {
                    const card = soulPool.splice(originalIndex, 1)[0];
                    zoneViewer.classList.add('hidden');
                    viewerGrid.removeEventListener('click', selectionHandler);

                    const centerBack = document.querySelector('.my-side .circle[data-zone="rc_back_center"]');
                    if (centerBack) {
                        // Vanguard Rule: Replacement
                        const oldCard = centerBack.querySelector('.card:not(.opponent-card)');
                        if (oldCard) {
                            soulPool.push(oldCard);
                            sendMoveData(oldCard, 'soul');
                            oldCard.remove();
                        }
                        centerBack.appendChild(card);
                        card.classList.remove('rest');
                        sendMoveData(card);
                        updateSoulUI();
                        alert(`${card.dataset.name} called! Performing Soul Charge 1.`);
                        soulCharge(1);
                    }
                }
            }
        };
        viewerGrid.addEventListener('click', selectionHandler);
    }

    async function payDiscard(count = 1) {
        if (playerHand.querySelectorAll('.card').length < count) {
            alert("การ์ดบนมือไม่เพียงพอ!");
            return false;
        }
        alert(`เลือกการ์ด ${count} ใบจากบนมือเพื่อทิ้ง (Discard)`);
        document.body.classList.add('targeting-mode');
        let selectedCount = 0;
        const result = await new Promise(resolve => {
            const handler = (e) => {
                const target = e.target.closest('.card:not(.opponent-card)');
                if (target && target.parentElement && target.parentElement.dataset.zone === 'hand') {
                    e.stopPropagation();
                    const dropZone = document.querySelector('.my-side .drop-zone');
                    dropZone.appendChild(target);
                    sendMoveData(target);
                    updateHandCount();
                    updateDropCount();
                    selectedCount++;
                    if (selectedCount >= count) {
                        document.body.classList.remove('targeting-mode');
                        document.removeEventListener('click', handler, true);
                        resolve(true);
                    }
                }
            };
            document.addEventListener('click', handler, true);
        });
        return result;
    }

    function promptCallSpecificFromSoul(cardToCall) {
        if (!cardToCall) return;
        const inSoul = soulPool.find(c => c.id === cardToCall.id);
        if (inSoul) {
            const idx = soulPool.indexOf(inSoul);
            soulPool.splice(idx, 1);
            alert("เลือก RC เพื่อคอลยูนิท");
            document.body.classList.add('targeting-mode');
            const handler = (e) => {
                const circle = e.target.closest('.my-side .circle.rc');
                if (circle) {
                    e.stopPropagation();
                    if (circle.querySelector('.card')) {
                        const old = circle.querySelector('.card');
                        soulPool.push(old);
                        sendMoveData(old, 'soul');
                        old.remove();
                    }
                    circle.appendChild(inSoul);
                    inSoul.classList.remove('rest');
                    updateSoulUI();
                    sendMoveData(inSoul);
                    document.body.classList.remove('targeting-mode');
                    document.removeEventListener('click', handler, true);
                    alert(`${inSoul.dataset.name} called to RC!`);
                }
            };
            document.addEventListener('click', handler, true);
        }
    }

    function promptRichardVC(onComplete) {
        const rgs = document.querySelectorAll('.my-side .circle.rc .card:not(.opponent-card)');
        if (rgs.length === 0) {
            alert("No Rear-guards to pay the cost! Ability failed.");
            if (onComplete) onComplete();
            return;
        }

        alert("Select 1 of your Rear-guards to put into Soul.");
        document.body.classList.add('targeting-mode');

        const selectionHandler = (e) => {
            const rg = e.target.closest('.circle.rc .card:not(.opponent-card)');
            if (rg) {
                e.stopPropagation();
                soulPool.push(rg);
                // Important: sendMoveData while it's in soulPool but before DOM removal might not work perfectly because
                // sendMoveData check parentZone first.
                // Better: Explicitly send it.
                sendMoveData(rg, 'soul');
                rg.remove();
                updateSoulUI();
                syncCounts(); // Still good to sync totals
                document.body.classList.remove('targeting-mode');
                document.removeEventListener('click', selectionHandler, true);

                alert("Cost paid! Draw 1 card.");
                drawCard(true);
                if (onComplete) onComplete();
            }
        };
        document.addEventListener('click', selectionHandler, true);
    }

    // Consolidated soulCharge into one version at the start of original script section

    async function promptCallMultipleFromSoul(maxCount, message, filterFn = null, callCount = 0) {
        if (callCount >= maxCount || soulPool.length === 0) return;
        const openRCs = Array.from(document.querySelectorAll('.my-side .circle.rc')).filter(circle => !circle.querySelector('.card'));
        if (openRCs.length === 0) return;

        let displayPool = filterFn ? soulPool.filter(filterFn) : soulPool;
        if (displayPool.length === 0) {
            alert("No valid cards in Soul to call!");
            return;
        }

        const nameToDisplay = callCount === 0 ? "1st" : (callCount === 1 ? "2nd" : (callCount === 2 ? "3rd" : `${callCount + 1}th`));
        if (await vgConfirm(`${message}: [${nameToDisplay} Card] คุณต้องการคอลยูนิทจากโซลหรือไม่?`)) {
            await new Promise(resolve => {
                promptSoulCall(true, resolve, filterFn); // isSelective=true, callback=resolve, filterFn
            });
            await promptCallMultipleFromSoul(maxCount, message, filterFn, callCount + 1); // Recursive call
        }
    }

    // Consolidated selective soul call with optionality and callback
    function promptSoulCall(isSelective = false, onComplete, filterFn = null) {
        if (soulPool.length === 0) {
            alert("Soul is empty!");
            if (onComplete) onComplete();
            return;
        }
        let displayPool = filterFn ? soulPool.filter(filterFn) : soulPool;
        if (displayPool.length === 0) {
            alert("No valid cards in Soul to call based on filter!");
            if (onComplete) onComplete();
            return;
        }

        openViewer("Select 1 card to CALL from Soul", displayPool);

        const selectionHandler = (e) => {
            const clicked = e.target.closest('.card');
            if (clicked && clicked.parentElement === viewerGrid) {
                const originalId = clicked.dataset.originalId;
                const originalIndex = soulPool.findIndex(c => c.id === originalId);

                if (originalIndex !== -1) {
                    const card = soulPool.splice(originalIndex, 1)[0];
                    zoneViewer.classList.add('hidden');
                    viewerGrid.removeEventListener('click', selectionHandler);

                    alert("Select an empty Rear-guard Circle to call.");
                    document.body.classList.add('targeting-mode');

                    const callHandler = (ev) => {
                        const circle = ev.target.closest('.circle.rc');
                        if (circle && !circle.querySelector('.card')) { // Ensure circle is empty
                            ev.stopPropagation();
                            if (circle.querySelector('.card')) { // This should not happen if filtered for empty, but as a safeguard
                                const old = circle.querySelector('.card:not(.opponent-card)');
                                if (old) {
                                    soulPool.push(old);
                                    sendMoveData(old, 'soul');
                                    old.remove();
                                }
                            }
                            circle.appendChild(card);
                            card.classList.remove('rest');
                            card.style.transform = 'none';
                            applyStaticBonuses(card); // Apply bonuses to the newly called card
                            sendMoveData(card);
                            updateSoulUI();
                            document.body.classList.remove('targeting-mode');
                            document.removeEventListener('click', callHandler, true);
                            alert(`${card.dataset.name} called from Soul!`);
                            if (onComplete) onComplete();
                        } else if (circle) {
                            alert("That circle is not empty! Please select an empty RC.");
                        }
                    };
                    document.addEventListener('click', callHandler, true);
                }
            }
        };
        viewerGrid.addEventListener('click', selectionHandler);
    }

    function promptDropToSoul() {
        const dropCards = Array.from(document.querySelectorAll('.my-side .drop-zone .card:not(.opponent-card)'));
        if (dropCards.length === 0) {
            alert("Drop Zone is empty!");
            return;
        }
        openViewer("Select 1 card to put into Soul", dropCards);

        const selectionHandler = (e) => {
            const clicked = e.target.closest('.card');
            if (clicked && clicked.parentElement === viewerGrid) {
                const originalId = clicked.dataset.originalId;
                const card = document.getElementById(originalId);
                if (card) {
                    soulPool.push(card);
                    card.remove();
                    zoneViewer.classList.add('hidden');
                    updateSoulUI();
                    updateDropCount();
                    sendData({ type: 'syncSoulCount', count: soulPool.length });
                    alert("Card moved to Soul.");
                    viewerGrid.removeEventListener('click', selectionHandler);
                }
            }
        };
        viewerGrid.addEventListener('click', selectionHandler);
    }

    function promptTopDeckCall(count, maxGrade) {
        const top5 = deckPool.slice(-count).reverse();
        if (top5.length === 0) return;

        // Show cards in viewer
        const tempCards = top5.map(data => createCardElement(data));
        openViewer(`Top ${count}: Select G${maxGrade} or lower`, tempCards);

        const selectionHandler = (e) => {
            const clicked = e.target.closest('.card');
            if (clicked && clicked.parentElement === viewerGrid) {
                if (parseInt(clicked.dataset.grade) > maxGrade) {
                    alert(`Choose a card with Grade ${maxGrade} or lower.`);
                    return;
                }

                const cardName = clicked.dataset.name;
                const deckIdx = deckPool.findLastIndex(c => c.name === cardName);
                if (deckIdx !== -1) {
                    const cardData = deckPool.splice(deckIdx, 1)[0];
                    zoneViewer.classList.add('hidden');
                    viewerGrid.removeEventListener('click', selectionHandler);
                    updateDeckCounter();

                    const card = createCardElement(cardData);
                    alert(`เรียก ${cardData.name}! โปรดเลือกช่อง RC ที่ว่างอยู่`);

                    document.body.classList.add('targeting-mode');
                    const call = (ev) => {
                        const circle = ev.target.closest('.circle.rc');
                        if (circle && !circle.querySelector('.card')) {
                            ev.stopPropagation();
                            circle.appendChild(card);
                            sendMoveData(card);
                            document.body.classList.remove('targeting-mode');
                            document.removeEventListener('click', call, true);

                            deckPool.sort(() => 0.5 - Math.random());
                            updateDeckCounter();
                        }
                    };
                    document.addEventListener('click', call, true);
                }
            }
        };
        viewerGrid.addEventListener('click', selectionHandler);
    }

    // Placeholder for checkBruceBattleAbility, assuming it exists elsewhere or will be added.
    async function checkBruceBattleAbility() {
        // Implement Bruce's start of battle phase ability here
        console.log("Checking Bruce's Battle Phase ability...");
        if (isFinalRush && !isFinalBurst) {
            if (await vgConfirm("Bruce: Enter Final Burst? (Also activates Persona Ride!)")) {
                isFinalBurst = true;
                personaRideActive = true; // Final Burst includes Persona Ride
                alert("Bruce: FINAL BURST activated!");
                updateFinalRushStaticBonuses(true);
                sendData({ type: 'bruceStatus', isFinalRush: true, isFinalBurst: true, isPersona: true });
            }
        }
    }

    function updateFinalRushStaticBonuses(apply) {
        document.querySelectorAll('.my-side .circle .card:not(.opponent-card)').forEach(card => {
            applyStaticBonuses(card);
        });
    }

    function resetMyUnits() {
        console.log("Resetting unit power/critical for new turn...");
        personaRideActive = false; // Reset Persona Ride
        isOpponentPersonaRide = false;
        document.querySelectorAll('.my-side .circle .card:not(.opponent-card), .my-side .vc .card:not(.opponent-card)').forEach(c => {
            // Clean up all persistent skill flags
            const flags = [
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
            ];
            flags.forEach(flag => delete c.dataset[flag]);

            // Reset power and critical to base values
            c.dataset.power = c.dataset.basePower;
            c.dataset.critical = c.dataset.baseCritical;
            syncPowerDisplay(c);
        });
    }

    function promptReturnToHand() {
        const handCards = Array.from(playerHand.querySelectorAll('.card'));
        openViewer("Select a card to return to hand", handCards);
        const sel = (e) => {
            const clicked = e.target.closest('.card');
            if (clicked && clicked.parentElement === viewerGrid) {
                viewerGrid.removeEventListener('click', sel);
                zoneViewer.classList.add('hidden');

                const realCard = document.getElementById(clicked.id);
                if (realCard) {
                    playerHand.appendChild(realCard);
                    updateHandCount();
                    updateDropCount();
                    sendMoveData(realCard);
                    alert(`Returned ${clicked.dataset.name} to hand!`);
                }
            }
        };
        viewerGrid.addEventListener('click', sel);
    }

    function promptLookTop5ForStrategy() {
        const top5 = deckPool.slice(0, 5);
        openViewer("Asagi Milestone: Top 5", top5);
        const sel = (e) => {
            const clicked = e.target.closest('.card');
            if (clicked && clicked.parentElement === viewerGrid) {
                if (clicked.dataset.name.includes('Strategy')) {
                    viewerGrid.removeEventListener('click', sel);
                    zoneViewer.classList.add('hidden');
                    const id = clicked.dataset.originalId;
                    const originalIdx = deckPool.findIndex(c => c.id === id);
                    const chosenData = deckPool.splice(originalIdx, 1)[0];
                    const chosenElem = createCardElement(chosenData);
                    playerHand.appendChild(chosenElem);
                    updateHandSpacing();
                    sendMoveData(chosenElem);
                    alert(`นำ Strategy: ${clicked.dataset.name} ขึ้นมือ!`);
                    deckPool.sort(() => 0.5 - Math.random());
                    updateDeckCounter();
                }
            }
        };
        viewerGrid.addEventListener('click', sel);
        const closeH = () => {
            deckPool.sort(() => 0.5 - Math.random());
            updateDeckCounter();
            closeViewerBtn.removeEventListener('click', closeH);
        };
        closeViewerBtn.addEventListener('click', closeH);
    }

    function promptSearchAndAddHand(filterFn, title = "Select a card to add to Hand") {
        const matches = deckPool.filter(filterFn);
        if (matches.length === 0) {
            alert("ไม่พบการ์ดที่ต้องการในกองการ์ด!");
            return;
        }

        openViewer(title, matches);

        const selHandler = (e) => {
            const clicked = e.target.closest('.card');
            if (clicked && clicked.parentElement === viewerGrid) {
                const targetName = clicked.dataset.name;
                const idx = deckPool.findIndex(c => c.name === targetName);
                if (idx !== -1) {
                    const cardData = deckPool.splice(idx, 1)[0];
                    zoneViewer.classList.add('hidden');
                    viewerGrid.removeEventListener('click', selHandler);

                    const card = createCardElement(cardData);
                    playerHand.appendChild(card);
                    updateHandSpacing();
                    sendMoveData(card);
                    updateDeckCounter();
                    alert(`นำ ${cardData.name} ขึ้นมือ!`);

                    deckPool.sort(() => 0.5 - Math.random());
                    updateDeckCounter();
                }
            }
        };
        viewerGrid.addEventListener('click', selHandler);
    }

    function promptMajestyLookTop7(done) {
        if (deckPool.length === 0) { if (done) done(); return; }
        const top7 = [];
        for (let i = 0; i < 7; i++) {
            if (deckPool.length > 0) top7.push(deckPool.pop());
        }
        updateDeckCounter();

        openViewer("Top 7 Cards (Select Grade 2 'Blaster' to hand)", top7);

        let revealed = false;
        const sel = (e) => {
            const clicked = e.target.closest('.card');
            if (clicked && clicked.parentElement === viewerGrid) {
                const name = clicked.dataset.name;
                const grade = parseInt(clicked.dataset.grade);
                if (name.includes('Blaster') && grade === 2) {
                    revealed = true;
                    viewerGrid.removeEventListener('click', sel);
                    zoneViewer.classList.add('hidden');

                    const idx = top7.findIndex(c => c.name === name);
                    const chosen = top7.splice(idx, 1)[0];
                    const cardNode = createCardElement(chosen);
                    playerHand.appendChild(cardNode);
                    updateHandSpacing();
                    sendMoveData(cardNode);
                    alert(`นำ ${chosen.name} ขึ้นมือ!`);

                    deckPool.push(...top7);
                    deckPool.sort(() => 0.5 - Math.random());
                    updateDeckCounter();
                    if (done) done();
                } else {
                    alert("ต้องเป็นเกรด 2 ที่มีชื่อ 'Blaster' เท่านั้น!");
                }
            }
        };
        viewerGrid.addEventListener('click', sel);

        const closeH = () => {
            if (!revealed) {
                deckPool.push(...top7);
                deckPool.sort(() => 0.5 - Math.random());
                updateDeckCounter();

                vgConfirm("ไม่ได้นำการ์ดขึ้นมือ ต้องการคอล 'Wingul Brave' จากโซลหรือไม่?").then(res => {
                    if (res) {
                        promptCallFromSoulByName('Wingul Brave');
                    }
                    if (done) done();
                });
            }
            closeViewerBtn.removeEventListener('click', closeH);
        };
        closeViewerBtn.addEventListener('click', closeH);
    }

    function promptMajestyRetireOrDraw(done) {
        const oppRGs = Array.from(document.querySelectorAll('.opponent-side .circle.rc .card'));
        const validTargets = oppRGs.filter(c => !isCardResistant(c));

        if (validTargets.length > 0) {
            alert("เลือกเรียร์การ์ดคู่แข่ง 1 ใบเพื่อรีไทร์");
            document.body.classList.add('targeting-mode');
            const h = (e) => {
                const t = e.target.closest('.opponent-side .circle.rc .card');
                if (t) {
                    if (isCardResistant(t)) {
                        alert("ยูนิทนี้มี Resist! ไม่สามารถเลือกได้");
                        return;
                    }
                    e.stopPropagation();
                    const oppDrop = document.querySelector('.opponent-side .drop-zone');
                    oppDrop.appendChild(t);
                    sendMoveData(t);
                    alert("รีไทร์เรียร์การ์ดคู่แข่งสำเร็จ!");
                    card.dataset.actUsed = "true";
                    document.body.classList.remove('targeting-mode');
                    document.removeEventListener('click', h, true);
                    if (done) done();
                }
            };
            document.addEventListener('click', h, true);
        } else {
            alert("คู่แข่งไม่มีเรียร์การ์ดให้รีไทร์! ทำการจั่วการ์ด 1 ใบแทน");
            drawCard(true);
            if (done) done();
        }
    }

    function promptCallFromSoulByName(targetName) {
        const soulIdx = soulPool.findIndex(c => c.dataset.name === targetName);
        if (soulIdx !== -1) {
            const card = soulPool.splice(soulIdx, 1)[0];
            alert(`เลือกช่อง RC ที่ว่างอยู่เพื่อคอล ${targetName}`);
            document.body.classList.add('targeting-mode');
            const h = (e) => {
                const circle = e.target.closest('.circle.rc');
                if (circle && !circle.querySelector('.card')) {
                    e.stopPropagation();
                    circle.appendChild(card);
                    card.classList.remove('rest');
                    applyStaticBonuses(card);
                    sendMoveData(card);
                    updateSoulUI();
                    document.body.classList.remove('targeting-mode');
                    document.removeEventListener('click', h, true);
                }
            };
            document.addEventListener('click', h, true);
        } else {
            alert(`ไม่พบ ${targetName} ในโซล!`);
        }
    }

    function promptLookTop7ForPrayerDragon() {
        if (deckPool.length === 0) return;
        const top7 = [];
        for (let i = 0; i < 7; i++) {
            if (deckPool.length > 0) top7.push(deckPool.pop());
        }
        updateDeckCounter();

        openViewer("Top 7 Cards (Select <Prayer Dragon> to add to hand)", top7);

        const sel = (e) => {
            const clicked = e.target.closest('.card');
            if (clicked && clicked.parentElement === viewerGrid) {
                const name = clicked.dataset.name;
                const isPD = name.includes('Equip Dragon');
                if (isPD) {
                    const idx = top7.findIndex(c => c.name === name);
                    const chosen = top7.splice(idx, 1)[0];
                    zoneViewer.classList.add('hidden');
                    viewerGrid.removeEventListener('click', sel);

                    const cardNode = createCardElement(chosen);
                    playerHand.appendChild(cardNode);
                    updateHandSpacing();
                    sendMoveData(cardNode);
                    alert(`เพิ่ม ${chosen.name} ขึ้นมือ!`);

                    deckPool.push(...top7);
                    deckPool.sort(() => 0.5 - Math.random());
                    updateDeckCounter();
                } else {
                    alert("ต้องเป็น <Prayer Dragon> (Equip Dragon) เท่านั้น!");
                }
            }
        };
        viewerGrid.addEventListener('click', sel);
    }

    // --- Rock Paper Scissors ---
    let rpsDecided = false;
    let rpsResendInterval = null;

    function startRPS() {
        const overlay = document.getElementById('rps-overlay');
        const options = document.getElementById('rps-options');
        const status = document.getElementById('rps-status');

        rpsDecided = false;
        myRpsChoice = null;
        oppRpsChoice = null;
        if (rpsResendInterval) clearInterval(rpsResendInterval);

        overlay.classList.remove('hidden');
        options.classList.remove('hidden');
        status.textContent = "Choose your move!";

        document.querySelectorAll('.rps-btn').forEach(btn => {
            btn.onclick = () => {
                myRpsChoice = btn.dataset.choice;
                options.classList.add('hidden');
                status.textContent = "Waiting for Rival's choice...";
                sendData({ type: 'rpsChoice', choice: myRpsChoice });

                // Resend mechanism in case packet drops
                rpsResendInterval = setInterval(() => {
                    if (myRpsChoice && !oppRpsChoice) {
                        sendData({ type: 'rpsChoice', choice: myRpsChoice });
                    }
                }, 1000);

                checkRpsResult();
            };
        });

        // Check if opponent already sent their choice
        checkRpsResult();
    }

    function checkRpsResult() {
        if (!myRpsChoice || !oppRpsChoice || rpsDecided) return;
        rpsDecided = true;
        if (rpsResendInterval) clearInterval(rpsResendInterval);

        const resultText = document.getElementById('rps-result-text');
        const myPickDisplay = document.getElementById('my-rps-pick');
        const oppPickDisplay = document.getElementById('opp-rps-pick');
        const rpsResultUI = document.getElementById('rps-result');
        const status = document.getElementById('rps-status');

        status.textContent = "RESULTS";
        rpsResultUI.classList.remove('hidden');

        const symbols = { rock: '✊', paper: '✋', scissors: '✌️' };
        myPickDisplay.textContent = symbols[myRpsChoice];
        oppPickDisplay.textContent = symbols[oppRpsChoice];

        let result = ""; // tie, win, lose
        if (myRpsChoice === oppRpsChoice) {
            result = "tie";
            resultText.textContent = "IT'S A TIE! REPLAYING...";

            setTimeout(() => {
                rpsResultUI.classList.add('hidden');
                startRPS();
            }, 2000);
        } else if (
            (myRpsChoice === 'rock' && oppRpsChoice === 'scissors') ||
            (myRpsChoice === 'paper' && oppRpsChoice === 'rock') ||
            (myRpsChoice === 'scissors' && oppRpsChoice === 'paper')
        ) {
            result = "win";
            resultText.textContent = "YOU WIN! YOU GO FIRST.";
            isFirstPlayer = true;
            window.isFirstPlayer = true;
            isMyTurn = true;
            setTimeout(() => startMulligan(), 2500);
        } else {
            result = "lose";
            resultText.textContent = "YOU LOSE! YOU GO SECOND.";
            isFirstPlayer = false;
            window.isFirstPlayer = false;
            isMyTurn = false;
            setTimeout(() => startMulligan(), 2500);
        }
    }

    // --- Mulligan ---
    function startMulligan() {
        document.getElementById('rps-overlay').classList.add('hidden');
        const overlay = document.getElementById('mulligan-overlay');
        const grid = document.getElementById('mulligan-grid');
        overlay.classList.remove('hidden');
        grid.innerHTML = '';

        // Draw initial 5
        deckPool = [...currentDeck.mainDeck];
        deckPool.sort(() => 0.5 - Math.random());
        const initialHand = deckPool.splice(0, 5);

        initialHand.forEach(cardData => {
            const cardElem = createCardElement(cardData);
            cardElem.classList.add('mulligan-card');
            cardElem.draggable = false; // Prevent dragging during mulligan
            cardElem.onclick = () => cardElem.classList.toggle('to-mulligan');
            grid.appendChild(cardElem);
        });

        document.getElementById('confirm-mulligan-btn').onclick = () => {
            const toReturn = Array.from(grid.querySelectorAll('.card.to-mulligan'));
            const keep = Array.from(grid.querySelectorAll('.card:not(.to-mulligan)'));

            // Return to deck
            toReturn.forEach(node => {
                deckPool.push(JSON.parse(node.dataset.cardData));
            });
            deckPool.sort(() => 0.5 - Math.random());
            updateDeckCounter();

            // Clear hand area and grid
            playerHand.innerHTML = '';

            // Draw new cards
            const newCardsCount = toReturn.length;
            const finalCards = keep.map(node => JSON.parse(node.dataset.cardData));

            for (let i = 0; i < newCardsCount; i++) {
                finalCards.push(deckPool.shift());
            }

            finalCards.forEach(c => {
                const node = createCardElement(c);
                playerHand.appendChild(node);
            });

            overlay.classList.add('hidden');
            grid.innerHTML = ''; // Clear grid to avoid ghost cards
            hasConfirmedMulligan = true;
            sendData({ type: 'mulliganReady' });
            checkGameStart();
        };
    }

    function checkGameStart() {
        if (hasConfirmedMulligan && oppConfirmedMulligan) {
            alert("Both players ready! GAME START!");
            updateHandCount();
            updateHandSpacing();
            updatePhaseUI(false);
            syncCounts(); // Ensure initial counts are synced to opponent

            // Starter skill check if second player
            if (!isFirstPlayer) {
                const starter = document.querySelector('.my-side .circle.vc .card');
                if (starter && starter.dataset.grade == "0") {
                    alert("You go second! Draw 1 card via starter ability.");
                    drawCard();
                }
            }
        } else {
            alert("Waiting for Rival to finish Mulligan...");
        }
    }

    // --- Game Navigation ---
    async function updatePhaseUI(broadcast = true) {
        phaseSteps.forEach((step, index) => {
            step.classList.remove('active', 'passed');
            if (index < currentPhaseIndex) step.classList.add('passed');
            else if (index === currentPhaseIndex) step.classList.add('active');
        });

        const mySide = document.querySelector('.my-side');
        const oppSide = document.querySelector('.opponent-side');

        // Determine if it's my turn
        // Determine if it's my turn: First player starts (Odd turns), Second player follows (Even turns)
        isMyTurn = (currentTurn % 2 !== 0 && isFirstPlayer) || (currentTurn % 2 === 0 && !isFirstPlayer);

        // Reset power/critical ONLY at the start of YOUR turn's stand phase
        if (isMyTurn && currentPhaseIndex === 0) { // Stand phase
            // Reset turn-based flags
            hasRiddenThisTurn = false;
            hasDiscardedThisTurn = false;
            hasDrawnThisTurn = false;
            turnAttackCount = 0;
            orderPlayedThisTurn = false;
            ordersPlayedCount = 0;
            maxOrdersPerTurn = 1;
            nextSetOrderFree = false;
            bomberDustingPowerBuff = false;
            bomberDustingNoIntercept = false;
            bomberDustingNoBlitz = false;
            window.myRGRetiredThisTurn = false;
            strategyActivatedThisTurn = false;
            shockStrategyActive = false;
            strategyActivatedCount = 0;
            lastStrategyPutIntoSoulName = "";
            strategyPutToOrderZoneThisTurn = false;

            // State expiration check
            if (currentTurn > finalRushTurnLimit && isFinalRush) {
                isFinalRush = false;
                isFinalBurst = false;
                updateStatusUI();
                alert("Bruce: Final Rush state has expired.");
                sendData({ type: 'bruceStatus', isFinalRush: false, isFinalBurst: false });
            }

            resetMyUnits();

            // Re-apply Final Rush bonuses if still active
            updateAllStaticBonuses();

            pendingPowerIncrease = 0;
            pendingCriticalIncrease = 0;
            isWaitingForGuard = false;
            const statusText = document.getElementById('game-status-text');
            if (statusText) statusText.textContent = "Network Ready";
            document.body.classList.remove('targeting-mode');
        }

        // Update button interactivity
        nextPhaseBtn.disabled = !isMyTurn;
        nextTurnBtn.disabled = !isMyTurn;
        nextPhaseBtn.style.opacity = isMyTurn ? "1" : "0.5";
        nextTurnBtn.style.opacity = isMyTurn ? "1" : "0.5";

        if (isMyTurn) {
            mySide.classList.remove('side-disabled');
            oppSide.classList.add('side-disabled');
            turnIndicator.textContent = `Turn ${currentTurn} (Your Turn)`;
            turnIndicator.classList.add('pulse');
        } else {
            mySide.classList.add('side-disabled');
            oppSide.classList.remove('side-disabled');
            turnIndicator.textContent = `Turn ${currentTurn} (Opponent's Turn)`;
            turnIndicator.classList.remove('pulse');
        }

        const currentPhaseName = phases[currentPhaseIndex];

        // Automatic Logic for My Turn
        if (isMyTurn) {
            if (currentPhaseName === 'stand') {
                console.log("Auto Phase: Stand");
                document.querySelectorAll('.my-side .circle .card.rest').forEach(c => c.classList.remove('rest'));

                // Auto advance to draw after 1 second
                setTimeout(() => {
                    if (currentPhaseIndex === 0) { // Still in stand
                        currentPhaseIndex++;
                        updatePhaseUI(true);
                    }
                }, 1000);
            } else if (currentPhaseName === 'draw') {
                console.log("Auto Phase: Draw");
                if (!hasDrawnThisTurn) {
                    drawCard();
                    hasDrawnThisTurn = true;
                }

                // Auto advance to ride after 1 second
                setTimeout(() => {
                    if (currentPhaseIndex === 1) { // Still in draw
                        currentPhaseIndex++;
                        updatePhaseUI(true);
                    }
                }, 1000);
            } else if (currentPhaseName === 'battle') {
                // Bruce's Start of Battle Phase Ability
                checkBruceBattleAbility();
            } else if (currentPhaseName === 'end') {
                // Inlet Pulse Dragon [AUTO](RC) End of Turn Ability
                const inletPluseUnits = Array.from(document.querySelectorAll('.my-side .circle.rc .card:not(.opponent-card)'))
                    .filter(c => c.dataset.name.includes('Inlet Pulse Dragon'));

                if (inletPluseUnits.length > 0 && turnAttackCount >= 4) {
                    await processInletPulse(inletPluseUnits);
                }
            }
        }

        if (broadcast) {
            sendData({ type: 'phaseChange', phaseIndex: currentPhaseIndex, isFirstPlayer: isFirstPlayer });
        }
    }

    nextPhaseBtn.addEventListener('click', async () => {
        if (document.body.classList.contains('targeting-mode')) {
            alert("กรุณาเลือกเป้าหมายให้เสร็จก่อน!");
            return;
        }
        if (currentPhaseIndex < phases.length - 1) {
            currentPhaseIndex++;
            await updatePhaseUI(true);
        }
    });

    nextTurnBtn.addEventListener('click', async () => {
        if (document.body.classList.contains('targeting-mode')) {
            alert("กรุณาเลือกเป้าหมายให้เสร็จก่อน!");
            return;
        }
        if (isWaitingForGuard || currentAttackResolving) {
            alert("กรุณารอให้การต่อสู้จบก่อน!");
            return;
        }
        currentTurn++;
        currentPhaseIndex = 0;
        hasRiddenThisTurn = false;
        hasDiscardedThisTurn = false;
        strategyActivatedThisTurn = false;
        shockStrategyActive = false;
        strategyActivatedCount = 0;
        ordersPlayedCount = 0;
        maxOrdersPerTurn = 1;
        nextSetOrderFree = false;
        bomberDustingPowerBuff = false;
        bomberDustingNoIntercept = false;
        bomberDustingNoBlitz = false;
        lastStrategyPutIntoSoulName = "";
        strategyPutToOrderZoneThisTurn = false;

        // Reset "Until end of turn" flags
        window.promptedEndTurn = false;
        resetMyUnits();
        window.otStoicheiaActive = false;
        window.killshroudDebuffActive = false;
        document.querySelectorAll('.my-side .circle .card').forEach(c => {
            if (c.dataset.turnEndBuffActive === "true") {
                c.dataset.turnEndBuffActive = "false";
            }
            if (c.dataset.avantStandReady === "true") {
                c.dataset.avantStandReady = "false";
            }
            if (c.dataset.deathWindsAttackTrigger === "true") {
                c.dataset.deathWindsAttackTrigger = "false";
            }
            applyStaticBonuses(c);
        });

        await updatePhaseUI(false);
        sendData({ type: 'nextTurn', currentTurn: currentTurn });
    });

    // --- Multiplayer Logic ---
    function initPeer(customId = null) {
        console.log("Initializing PeerJS with STUN/TURN...");

        const peerOptions = {
            config: {
                'iceServers': [
                    { 'urls': 'stun:stun.l.google.com:19302' },
                    { 'urls': 'stun:stun1.l.google.com:19302' },
                    { 'urls': 'stun:stun2.l.google.com:19302' },
                    { 'urls': 'stun:stun3.l.google.com:19302' },
                    { 'urls': 'stun:stun4.l.google.com:19302' },
                    { 'urls': 'stun:global.stun.twilio.com:3478' }
                ]
            }
        };

        if (peer && !peer.destroyed) return;
        if (customId) {
            peer = new Peer(customId, peerOptions);
        } else {
            peer = new Peer(peerOptions);
        }

        peer.on('open', (id) => {
            console.log('Peer ID generated:', id);
            if (role === 'host') {
                if (matchmakingSubtitle) matchmakingSubtitle.textContent = 'Share ID with your friend:';
                if (idDisplayBox) idDisplayBox.classList.remove('hidden');
                if (gamePeerIdDisplay) gamePeerIdDisplay.textContent = id;
            }
            if (gameStatusText) gameStatusText.textContent = 'Network Ready';
            const dot = document.querySelector('.status-dot');
            if (dot) dot.classList.add('online');
        });

        peer.on('connection', (newConn) => {
            console.log("Incoming connection from:", newConn.peer);

            if (gameStarted) {
                console.log("Game already in progress. Ignoring.");
                newConn.close();
                return;
            }

            conn = newConn;
            isHost = true;
            isFirstPlayer = true;

            // Temporary listener to wait for guestJoin
            const waitForJoin = (data) => {
                if (data.type === 'guestJoin') {
                    console.log("Real guest detected! Starting game.");
                    gameStarted = true;
                    conn.off('data', waitForJoin); // Remove this temporary listener

                    const lobbyContent = document.querySelector('.lobby-content');
                    if (lobbyContent) lobbyContent.classList.add('effect-match-found');

                    const deckNameLookup = { bruce: 'bruce', magnolia: 'magnolia', nirvana: 'nirvana', majesty: 'majesty' };
                    let currentDeckName = 'bruce';
                    if (currentDeck === magnoliaDeck) currentDeckName = 'magnolia';
                    else if (currentDeck === nirvanaJhevaDeck) currentDeckName = 'nirvana';
                    else if (currentDeck === majestyDeck) currentDeckName = 'majesty';

                    // Start game immediately to avoid losing messages during the 1s delay
                    setupConnection();
                    // Sync deck info
                    sendData({ type: 'hostAck', deck: currentDeckName });
                }
            };

            conn.on('data', waitForJoin);

            conn.on('close', () => {
                if (gameStarted) {
                    alert('Lost connection to rival.');
                    window.location.href = 'lobby.html';
                }
            });

            if (gameStatusText) gameStatusText.textContent = 'Rival attempting to join...';
        });

        peer.on('error', (err) => {
            console.error('PeerJS error:', err.type);
            if (gameStatusText) gameStatusText.textContent = `Error: ${err.type}`;
            const dot = document.querySelector('.status-dot');
            if (dot) dot.classList.remove('online');
        });
    }

    function setupConnection() {
        console.log("Activating Game UI and listeners...");
        gameStarted = true;

        if (matchmakingOverlay) matchmakingOverlay.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        gameContainer.classList.add('page-enter'); // Add smooth page enter animation

        if (isHost) {
            networkInfo.textContent = 'Online (Host)';
        } else {
            networkInfo.textContent = 'Online (Guest)';
        }
        initGame();

        // Primary game data listener
        conn.on('data', handleIncomingData);
    }

    function sendData(data) {
        if (conn && conn.open) conn.send(data);
    }

    function openSkillViewer(card) {
        if (!skillViewer) return;

        skillCardName.textContent = card.dataset.name;
        skillCardGrade.textContent = `Grade: ${card.dataset.grade}`;
        skillCardPower.textContent = `Power: ${card.dataset.power}`;
        skillCardShield.textContent = `Shield: ${card.dataset.shield}`;
        skillText.textContent = card.dataset.skill;

        // Apply background image to modal
        const modal = skillViewer.querySelector('.skill-modal');
        if (modal) {
            const url = card.dataset.imageUrl;
            if (url) modal.style.setProperty('--card-art-url', `url('${url}')`);
            else modal.style.removeProperty('--card-art-url');
        }

        // Show Activate button if it's an [ACT] skill on my field
        const activateBtn = document.getElementById('activate-skill-btn');
        if (activateBtn) {
            const isMyCard = !card.classList.contains('opponent-card');
            const isOnField = card.parentElement && card.parentElement.classList.contains('circle');
            const inHand = card.parentElement && card.parentElement.dataset.zone === 'hand';
            const hasAct = card.dataset.skill && card.dataset.skill.includes('[ACT]');
            const hasHandAct = card.dataset.skill && card.dataset.skill.includes('[ACT](Hand)');
            const isMainPhase = phases[currentPhaseIndex] === 'main';

            if (isMyCard && (isOnField || (inHand && hasHandAct)) && hasAct && isMyTurn && isMainPhase) {
                activateBtn.classList.remove('hidden');
                activateBtn.onclick = async () => {
                    await activateCardSkill(card);
                    skillViewer.classList.add('hidden');
                };
            } else {
                activateBtn.classList.add('hidden');
            }
        }

        const playOrderBtn = document.getElementById('play-order-btn');
        if (playOrderBtn) {
            const skillLC = (card.dataset.skill || "").toLowerCase();
            const isOrder = skillLC.includes('[order]') || skillLC.includes('[set order]') || skillLC.includes('[blitz order]');
            const inHand = card.parentElement && card.parentElement.dataset.zone === 'hand';

            if (isOrder && inHand && isMyTurn) {
                playOrderBtn.classList.remove('hidden');
                playOrderBtn.onclick = async () => {
                    await playOrder(card);
                    skillViewer.classList.add('hidden');
                };
            } else {
                playOrderBtn.classList.add('hidden');
            }
        }

        const xoverBtn = document.getElementById('x-overdress-btn');
        if (xoverBtn) {
            const skillLC = (card.dataset.skill || "").toLowerCase();
            const inHand = card.parentElement && card.parentElement.dataset.zone === 'hand';
            const isMainPhase = phases[currentPhaseIndex] === 'main';
            const isVairina = (card.dataset.name || "").includes("Vairina");
            const isXOD = isVairina && (skillLC.includes('x-overdress') || skillLC.includes('xoverdress'));
            const isOD = isVairina && skillLC.includes('overdress') && !isXOD;

            if (inHand && isMyTurn && isMainPhase && (isXOD || isOD)) {
                xoverBtn.classList.remove('hidden');
                xoverBtn.textContent = isXOD ? "Perform X-overDress" : "Perform overDress";
                xoverBtn.onclick = async () => {
                    skillViewer.classList.add('hidden');
                    if (isXOD) await performXoverDress(card);
                    else await performOverDress(card);
                };
            } else {
                xoverBtn.classList.add('hidden');
            }
        }

        skillViewer.classList.remove('hidden');
    }

    async function performOverDress(odCard) {
        const materialName = "Trickstar";
        alert(`overDress: เลือก ${materialName} จากสนาม`);
        document.body.classList.add('targeting-mode');
        const mat = await new Promise(resolve => {
            const listener = (e) => {
                const target = e.target.closest('.circle.rc .card:not(.opponent-card)');
                if (target && target.dataset.name.includes(materialName)) {
                    e.stopPropagation();
                    document.body.classList.remove('targeting-mode');
                    document.removeEventListener('click', listener, true);
                    resolve(target);
                }
            };
            document.addEventListener('click', listener, true);
        });

        alert("เลือกช่อง RC เพื่อคอลยูนิท overDress");
        document.body.classList.add('targeting-mode');
        const circle = await new Promise(resolve => {
            const listener = (ev) => {
                const targetCircle = ev.target.closest('.circle.rc');
                if (targetCircle) {
                    ev.stopPropagation();
                    document.body.classList.remove('targeting-mode');
                    document.removeEventListener('click', listener, true);
                    resolve(targetCircle);
                }
            };
            document.addEventListener('click', listener, true);
        });

        odCard.originalDress = [{
            name: mat.dataset.name,
            grade: mat.dataset.grade,
            power: mat.dataset.power,
            shield: mat.dataset.shield,
            skill: mat.dataset.skill
        }];

        odCard.unitSoul = [mat];
        mat.remove();

        circle.innerHTML = '';
        circle.appendChild(odCard);
        odCard.classList.remove('rest');
        odCard.dataset.isOverDress = "true";

        let badge = odCard.querySelector('.dress-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'dress-badge';
            badge.style.position = 'absolute';
            badge.style.bottom = '-8px';
            badge.style.left = '50%';
            badge.style.transform = 'translateX(-50%)';
            badge.style.backgroundColor = '#9333ea';
            badge.style.color = '#fff';
            badge.style.padding = '2px 6px';
            badge.style.borderRadius = '8px';
            badge.style.fontSize = '0.65rem';
            badge.style.fontWeight = 'bold';
            badge.style.zIndex = '5';
            badge.style.pointerEvents = 'none';
            odCard.appendChild(badge);
        }
        badge.textContent = 'OD';
        applyStaticBonuses(odCard);
        sendMoveData(odCard);
        updateSoulUI();
        updateHandCount();

        await checkOnPlaceAbilities(odCard);
        alert(`${odCard.dataset.name} overDress สำเร็จ!`);
    }

    async function performXoverDress(vairinaCard) {
        const skillLC = (vairinaCard.dataset.skill || "").toLowerCase();
        let material1Name = "Trickstar";
        let material2Name = "Equip Dragon"; // Default

        if (skillLC.includes('graillumirror')) material2Name = "Graillumirror";
        else if (skillLC.includes('galondight')) material2Name = "Galondight";
        else material2Name = "Equip Dragon"; // Fallback for Baur/Stragallio etc.

        alert(`X-overDress: เลือก ${material1Name} และ ${material2Name} จากสนาม`);

        // Step 1: Select Material 1
        alert(`Step 1: เลือก ${material1Name} จากสนาม`);
        document.body.classList.add('targeting-mode');
        const mat1 = await new Promise(resolve => {
            const listener = (e) => {
                const target = e.target.closest('.circle.rc .card:not(.opponent-card)');
                if (target && target.dataset.name.includes(material1Name)) {
                    e.stopPropagation();
                    document.body.classList.remove('targeting-mode');
                    document.removeEventListener('click', listener, true);
                    resolve(target);
                }
            };
            document.addEventListener('click', listener, true);
        });

        // Step 2: Select Material 2
        alert(`Step 2: เลือก ${material2Name} (Equip Dragon) จากสนาม`);
        document.body.classList.add('targeting-mode');
        const mat2 = await new Promise(resolve => {
            const listener = (e) => {
                const target = e.target.closest('.circle.rc .card:not(.opponent-card)');
                if (target && (target.dataset.name.includes(material2Name) || target.dataset.name.includes("Equip Dragon"))) {
                    if (target === mat1) {
                        alert("เลือกซ้ำไม่ได้!");
                        return;
                    }
                    e.stopPropagation();
                    document.body.classList.remove('targeting-mode');
                    document.removeEventListener('click', listener, true);
                    resolve(target);
                }
            };
            document.addEventListener('click', listener, true);
        });

        // Step 3: Choose where to Call Vairina
        alert("Step 3: เลือกช่อง RC เพื่อคอลยูนิท X-overDress");
        document.body.classList.add('targeting-mode');
        const circle = await new Promise(resolve => {
            const listener = (ev) => {
                const targetCircle = ev.target.closest('.circle.rc');
                if (targetCircle) {
                    ev.stopPropagation();
                    document.body.classList.remove('targeting-mode');
                    document.removeEventListener('click', listener, true);
                    resolve(targetCircle);
                }
            };
            document.addEventListener('click', listener, true);
        });

        // Resolve X-overDress
        const mats = [mat1, mat2];
        vairinaCard.originalDress = mats.map(m => {
            return {
                name: m.dataset.name,
                grade: m.dataset.grade,
                power: m.dataset.power,
                shield: m.dataset.shield,
                skill: m.dataset.skill,
                isPG: m.dataset.isPG === "true"
            };
        });

        vairinaCard.unitSoul = mats;
        mats.forEach(m => {
            m.remove();
        });

        circle.innerHTML = '';
        circle.appendChild(vairinaCard);
        vairinaCard.classList.remove('rest');
        vairinaCard.dataset.isXoverDress = "true";

        let badge = vairinaCard.querySelector('.dress-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'dress-badge';
            badge.style.position = 'absolute';
            badge.style.bottom = '-8px';
            badge.style.left = '50%';
            badge.style.transform = 'translateX(-50%)';
            badge.style.backgroundColor = '#e11d48';
            badge.style.color = '#fff';
            badge.style.padding = '2px 6px';
            badge.style.borderRadius = '8px';
            badge.style.fontSize = '0.65rem';
            badge.style.fontWeight = 'bold';
            badge.style.zIndex = '5';
            badge.style.pointerEvents = 'none';
            vairinaCard.appendChild(badge);
        }
        badge.textContent = 'X-OD';

        applyStaticBonuses(vairinaCard);
        sendMoveData(vairinaCard);
        updateSoulUI();
        updateHandCount();

        alert(`${vairinaCard.dataset.name} X-overDress สำเร็จ!`);

        // --- OriginalDress Triggers (When becoming material) ---
        for (const mData of vairinaCard.originalDress) {
            if (mData.name.includes('Stragallio')) {
                if (await vgConfirm("Stragallio: [AUTO] เมื่อกลายเป็นการ์ดซ้อน (originalDress) [CB1] เพื่อคอล Trickstar จากดรอบ?")) {
                    if (payCounterBlast(1)) {
                        promptCallFromDrop(1, (c) => c.dataset.name.includes("Trickstar"));
                    }
                }
            }
            if (mData.name.includes('Galondight')) {
                // [AUTO]: When this card becomes an originalDress, power +5000,
                // and if the outerDress is "Garou Vairina", it gets another [Power] +5000.
                let bonus = 5000;
                if (vairinaCard.dataset.name.includes('Garou Vairina')) bonus = 10000;
                vairinaCard.dataset.turnEndBuffPower = (parseInt(vairinaCard.dataset.turnEndBuffPower || "0") + bonus).toString();
                vairinaCard.dataset.turnEndBuffActive = "true";
                applyStaticBonuses(vairinaCard);
                alert(`Galondight (Material): มอบพลังให้ ${vairinaCard.dataset.name} +${bonus} (จนจบเทิร์น)!`);
            }
        }

        // --- On-Place & Dresser Skills ---
        // Vils Vairina On-Place
        if (vairinaCard.dataset.name.includes('Vils Vairina')) {
            if (await vgConfirm("Vils Vairina: [AUTO] เมื่อลงด้วย X-overDress เลือกการ์ด X-overDress 1 ใบจากดรอบขึ้นมือ?")) {
                promptAddFromDropToHand((c) => c.dataset.skill && c.dataset.skill.includes("X-overDress") && !c.dataset.name.includes("Vils Vairina"));
            }
        }

        // Mirrors Vairina On-Place
        if (vairinaCard.dataset.name.includes('Mirrors Vairina')) {
            if (await vgConfirm("Mirrors Vairina: [AUTO] เมื่อลงด้วย X-overDress เลือก 'Vairina' 2 ใบจากดรอบมาซ้อนใต้?")) {
                promptDressMultipleFromDrop(vairinaCard, 2, (c) => c.dataset.name.includes("Vairina"));
            }
        }


        await checkOnPlaceAbilities(vairinaCard);
        // Material skills already triggered above
    }

    function promptDressMultipleFromDrop(vairinaCard, maxCount, filterFn, count = 0) {
        if (count >= maxCount) return;
        const dropZone = document.querySelector('.my-side .drop-zone');
        const cards = Array.from(dropZone.querySelectorAll('.card')).filter(filterFn);
        if (cards.length === 0) return;

        openViewer(`เลือกการ์ดใบที่ ${count + 1}/${maxCount} เพื่อซ้อนใต้ ${vairinaCard.dataset.name}`, cards);
        const sel = (e) => {
            const clicked = e.target.closest('.card');
            if (clicked && clicked.parentElement === viewerGrid) {
                const originalId = clicked.dataset.originalId;
                const originalCard = document.getElementById(originalId);
                if (originalCard) {
                    viewerGrid.removeEventListener('click', sel);
                    zoneViewer.classList.add('hidden');

                    // Track originalDress
                    if (!vairinaCard.originalDress) vairinaCard.originalDress = [];
                    vairinaCard.originalDress.push({
                        name: originalCard.dataset.name,
                        grade: originalCard.dataset.grade,
                        power: originalCard.dataset.power,
                        shield: originalCard.dataset.shield,
                        skill: originalCard.dataset.skill
                    });

                    if (!vairinaCard.unitSoul) vairinaCard.unitSoul = [];
                    vairinaCard.unitSoul.push(originalCard);
                    originalCard.remove();
                    updateSoulUI();
                    updateDropCount();
                    promptDressMultipleFromDrop(vairinaCard, maxCount, filterFn, count + 1);
                }
            }
        };
        viewerGrid.addEventListener('click', sel);
    }

    function promptAddFromDropToHand(filterFn, onSuccess) {
        const dropZone = document.querySelector('.my-side .drop-zone');
        const cards = Array.from(dropZone.querySelectorAll('.card')).filter(filterFn);
        if (cards.length === 0) return;

        openViewer("เลือกการ์ดจาก Drop Box ขึ้นมือ", cards);
        const sel = (e) => {
            const clicked = e.target.closest('.card');
            if (clicked && clicked.parentElement === viewerGrid) {
                const originalId = clicked.dataset.originalId;
                const originalCard = document.getElementById(originalId);
                if (originalCard) {
                    viewerGrid.removeEventListener('click', sel);
                    zoneViewer.classList.add('hidden');
                    playerHand.appendChild(originalCard);
                    updateHandSpacing();
                    sendMoveData(originalCard);
                    updateDropCount();
                    alert(`นำ ${originalCard.dataset.name} ขึ้นมือสำเร็จ!`);
                    if (onSuccess) onSuccess();
                }
            }
        };
        viewerGrid.addEventListener('click', sel);
    }

    async function playOrder(card) {
        const skillText = (card.dataset.skill || "").toLowerCase();
        const isSetOrder = skillText.includes('set order');
        const isBlitzOrder = skillText.includes('blitz order');

        const orderGrade = parseInt(card.dataset.grade || 0);
        const vgCard = document.querySelector('.my-side .circle.vc .card');
        const vgGrade = vgCard ? parseInt(vgCard.dataset.grade || 0) : 0;

        if (orderGrade > vgGrade) {
            alert(`ไม่สามารถใช้งาน Order เกรด ${orderGrade} ได้ เนื่องจากแวนการ์ดของคุณคือเกรด ${vgGrade}!`);
            return;
        }

        if (isBlitzOrder) {
            if (window.currentIncomingAttack && window.currentIncomingAttack.bomberNoBlitz) {
                alert("Bomber Strategy Dusting! คุณไม่สามารถใช้งาน Blitz Order ได้!");
                return;
            }
        } else {
            // Normal Order or Set Order can only be played in Main Phase
            if (phases[currentPhaseIndex] !== 'main') {
                alert("Order สามารถเล่นได้เฉพาะใน Main Phase เท่านั้น!");
                return;
            }
        }

        let isFree = false;
        if (isSetOrder && nextSetOrderFree) {
            isFree = true;
            nextSetOrderFree = false; // Consume free status
        }

        if (ordersPlayedCount >= maxOrdersPerTurn && !isFree) {
            alert(`คุณสามารถเล่นทักษะ Order ได้สูงสุด ${maxOrdersPerTurn} ครั้งในเทิร์นนี้!`);
            return;
        }

        const confirmPlay = await vgConfirm(`Play Order: ${card.dataset.name}?`);
        if (!confirmPlay) return;

        // Note: For now activateCardSkill triggers costs. If isFree, we should ideally bypass CB/SB.
        // For simplicity with Habitable Zone, we'll assume the prompt says "without paying its cost".
        // In full implementation, activateCardSkill needs to take an 'isFree' parameter.
        if (isFree) card.dataset.playOrderFree = "true";

        const skillResult = await activateCardSkill(card);

        if (isFree) card.dataset.playOrderFree = "false";

        if (skillResult === false) return;

        if (isSetOrder) {
            const orderZone = document.querySelector('.my-side .order-zone');
            if (orderZone) {
                // Remove existing strategy if you want only one set order active?
                // In Vanguard, you can have multiple. But often for strategies you might swap.
                // Re-playing same strategy replaces? Let's keep multiple for now as per rules.
                orderZone.appendChild(card);
                sendMoveData(card);
                updateHandCount();
                orderPlayedThisTurn = true;
                strategyActivatedThisTurn = true;
                if (card.dataset.name.includes("Strategy")) {
                    strategyPutToOrderZoneThisTurn = true;
                }
                ordersPlayedCount++;
                sendData({ type: 'strategyActivated', active: true }); // Sync strategy activation
                alert(`Played Set Order: ${card.dataset.name}`);
                return;
            }
        }

        // Move to drop zone
        const dropZone = document.querySelector('.my-side .drop-zone');
        if (dropZone) {
            dropZone.appendChild(card);
            sendMoveData(card);
            updateHandCount();
            updateDropCount();
            orderPlayedThisTurn = true;
            strategyActivatedThisTurn = true;
            ordersPlayedCount++;
            sendData({ type: 'strategyActivated', active: true }); // Sync strategy activation
            alert(`Played Order: ${card.dataset.name}`);
        }
    }

    async function activateCardSkill(card) {
        if (card.dataset.actUsed === "true") {
            alert("ความสามารถ [ACT] นี้ถูกใช้งานไปแล้วในเทิร์นนี้! (1/Turn)");
            return;
        }
        const name = card.dataset.name;
        const isJhevaOrGrail = name.includes('Nirvana Jheva'); // Removed Graillumirror duplicate

        // --- Departure Towards the Dawn [Order] ---
        if (name.includes('Departure Towards the Dawn')) {
            if (await vgConfirm("Departure Towards the Dawn: [CB1] ดู 5 ใบ เลือก 'Blaster' 1 ใบขึ้นมือ?")) {
                if (payCounterBlast(1)) {
                    const top5 = deckPool.slice(0, 5);
                    openViewer("Departure Towards the Dawn: Top 5", top5);
                    const sel = (e) => {
                        const clicked = e.target.closest('.card');
                        if (clicked && clicked.parentElement === viewerGrid) {
                            const cName = clicked.dataset.name;
                            if (cName.includes('Blaster')) {
                                viewerGrid.removeEventListener('click', sel);
                                zoneViewer.classList.add('hidden');

                                const id = clicked.dataset.originalId;
                                const originalIdx = deckPool.findIndex(c => c.id === id);
                                const chosenData = deckPool.splice(originalIdx, 1)[0];

                                const chosenElem = createCardElement(chosenData);
                                playerHand.appendChild(chosenElem);
                                updateHandSpacing();
                                sendMoveData(chosenElem);
                                alert(`นำ ${cName} ขึ้นมือ!`);

                                deckPool.sort(() => 0.5 - Math.random());
                                updateDeckCounter();
                            }
                        }
                    };
                    viewerGrid.addEventListener('click', sel);

                    const closeH = () => {
                        deckPool.sort(() => 0.5 - Math.random());
                        updateDeckCounter();
                        closeViewerBtn.removeEventListener('click', closeH);
                    };
                    closeViewerBtn.addEventListener('click', closeH);
                    return true;
                } else return false;
            } else return false;
        }


        // --- Avantgarda Richter (Hand ACT) ---
        if (name.includes('Richter')) {
            const inHand = card.parentElement && card.parentElement.dataset.zone === 'hand';
            if (inHand) {
                const oppVG = document.querySelector('.opponent-side .circle.vc .card');
                const oppGrade = oppVG ? parseInt(oppVG.dataset.grade || "0") : 0;
                if (oppGrade >= 3) {
                    if (await vgConfirm("Richter: [ACT](Hand) [Reveal & Bind Avant from VC] เพื่อ Ride [Stand] และรับ ACT Skill?")) {
                        const vg = document.querySelector('.my-side .circle.vc .card');
                        if (vg && vg.dataset.name.includes('"Skyrender" Avantgarda')) {
                            // Cost: Bind VG
                            bindPool.push(vg);
                            vg.remove();
                            updateSoulUI(); // Sync indices

                            // Ride Richter
                            const vc = document.querySelector('.my-side .circle.vc');
                            vc.appendChild(card);
                            card.classList.remove('rest');
                            card.dataset.inheritedAvantAct = "true";
                            applyStaticBonuses(card);
                            sendMoveData(card);
                            sendData({ type: 'syncBindCount', count: bindPool.length });
                            updateAllStaticBonuses();
                            alert("Richter: Ride สำเร็จ! และได้รับ ACT ของใบที่ Bind");
                            return;
                        } else {
                            alert("ต้องมี \"Skyrender\" Avantgarda บนช่องแวนการ์ด!");
                        }
                    }
                } else {
                    alert("ความสามารถนี้ใช้ได้เมื่อคู่แข่งเกรด 3 ขึ้นไป!");
                }
                return;
            }
        }

        // --- Avantgarda (ACT) ---
        const lowerName = name.toLowerCase();
        if (lowerName.includes('avantgarda') || (lowerName.includes('richter') && card.dataset.inheritedAvantAct === "true")) {
            if (await vgConfirm(`${name}: [ACT] [ใส่ Strategy ใน Order Zone เข้าโซล] เพื่อจั่ว 1, พลัง +5000 และได้รับ Restand Skill?`)) {
                const hasSora = soulPool.some(c => c.dataset.name.includes('Sora Period'));
                if (!hasSora) {
                    alert("ต้องมี Blue Deathster, Sora Period ในโซลเพื่อใช้งานความสามารถนี้!");
                    return;
                }
                const strategiesOnFieldIdx = Array.from(document.querySelectorAll('.my-side .order-zone .card:not(.opponent-card)'));
                if (strategiesOnFieldIdx.length === 0) {
                    alert("ไม่มี Strategy ใน Order Zone เพื่อจ่ายคอสต์!");
                    return;
                }

                const strats = Array.from(document.querySelectorAll('.my-side .order-zone .card:not(.opponent-card)'))
                    .map(c => ({ src: 'order', id: c.id, name: c.dataset.name, dom: c }));
                const viewerData = strats.map(c => ({
                    name: c.name, id: c.id, grade: c.dom.dataset.grade, power: c.dom.dataset.power, shield: c.dom.dataset.shield, skill: c.dom.dataset.skill, imageUrl: c.dom.dataset.imageUrl
                }));

                openViewer("เลือก Strategy 1 ใบเข้าโซล", viewerData);
                const strat = await new Promise(resolve => {
                    const sel = (e) => {
                        const tgt = e.target.closest('.card');
                        if (tgt && tgt.parentElement === viewerGrid) {
                            const cname = tgt.dataset.name;
                            const refCard = strats.find(c => c.name === cname);
                            if (refCard) {
                                viewerGrid.removeEventListener('click', sel);
                                zoneViewer.classList.add('hidden');
                                resolve(refCard.dom);
                            }
                        }
                    };
                    viewerGrid.addEventListener('click', sel);
                });

                if (strat) {
                    const stratName = strat.dataset.name;
                    soulPool.push(strat);
                    sendMoveData(strat, 'soul'); // Tell opponent card moved to soul
                    strat.remove();
                    updateSoulUI();
                    sendData({ type: 'syncSoulCount', count: soulPool.length });
                    alert("จ่ายคอสต์สำเร็จ! จั่วการ์ด 1 ใบ");
                    drawCard(1);

                    card.dataset.avantSkillPowerBuffed = "true";
                    applyStaticBonuses(card);

                    // Standard Avantgarda ACT effect (Restand for V) - Richter DOES NOT inherit this part
                    if (name.includes('Avantgarda') && !name.includes('Richter')) {
                        card.dataset.avantStandReady = "true";
                        alert("Avantgarda: Power +5000 และได้รับความสามารถ Restand เมื่อโจมตีฮิตหรือ Persona Ride!");
                    } else {
                        alert(`${name}: Power +5000 และได้รับความสามารถพิเศษจาก Strategy!`);
                    }

                    // --- Death Winds Soul Bonus ---
                    if (stratName.includes('Death Winds')) {
                        const oppVG = document.querySelector('.opponent-side .circle.vc .card');
                        const oppGrade = oppVG ? parseInt(oppVG.dataset.grade || "0") : 0;
                        if (oppGrade >= 3) {
                            card.dataset.deathWindsAttackTrigger = "true";
                            alert("Death Winds Bonus: เมื่อยูนิตนี้โจมตี แถวหน้าทั้งหมดพลัง +5000!");
                        }
                    }

                    // --- Bomber Strategy: Dusting Soul Bonus ---
                    if (stratName.includes('Dusting')) {
                        bomberDustingPowerBuff = true;
                        bomberDustingNoIntercept = true;
                        bomberDustingNoBlitz = true;
                        updateAllStaticBonuses(); // Apply power immediately
                        alert("Bomber Strategy Dusting Bonus: แวนการ์ดพลัง +10000 และคู่แข่งไม่สามารถ Intercept หรือใช้งาน Blitz Order ได้จนจบเทิร์น!");
                    }

                    // --- Disruption Strategy: Killshroud Soul Bonus ---
                    if (stratName.includes('Killshroud')) {
                        alert("Killshroud: เลือกเรียร์การ์ดคู่แข่ง 1 ใบเพื่อรีไทร์");
                        document.body.classList.add('targeting-mode');
                        const retireHandler = (e) => {
                            const target = e.target.closest('.opponent-side .circle.rc .card');
                            if (target) {
                                e.stopPropagation();
                                document.body.classList.remove('targeting-mode');
                                document.removeEventListener('click', retireHandler, true);
                                const dropZone = document.querySelector('.opponent-side .drop-zone');
                                dropZone.appendChild(target);
                                sendMoveData(target);
                                alert("รีไทร์เรียร์การ์ดคู่แข่งสำเร็จ!");

                                // Power +5000 to Vanguard handled via flag in applyStaticBonuses
                                card.dataset.killshroudPowerBuffed = "true";
                                updateAllStaticBonuses();

                                alert(`${card.dataset.name}: พลัง +5000 และได้รับ Guard Restrict จนจบเทิร์น!`);
                                card.dataset.killshroudGuardRestrict = "true";
                                sendMoveData(card);
                                sendData({ type: 'killshroudDebuff' }); // Synchronize debuff state to opponent
                            } else if (e.target.classList.contains('targeting-mode')) {
                                // Cancel
                                document.body.classList.remove('targeting-mode');
                                document.removeEventListener('click', retireHandler, true);
                            }
                        };
                        document.addEventListener('click', retireHandler, true);
                    }

                    lastStrategyPutIntoSoulName = stratName; // Save for Ala Dargente
                    updateAllStaticBonuses(); // Recalculate Milestone power immediately
                    syncPowerDisplay(card);
                    card.dataset.actUsed = "true";
                    sendMoveData(card);
                }
                return;
            }
        }

        if (isJhevaOrGrail && card.parentElement.classList.contains('vc')) {
            const skillName = 'Nirvana Jheva';
            if (await vgConfirm(`${skillName}: [ACT][ทิ้งการ์ด 1 ใบ] คอล Trickstar และ Prayer Dragon จาก Drop?`)) {
                if (await payDiscard(1)) {
                    alert("Step 1: เลือก Trickstar 1 ใบจาก Drop");
                    promptCallFromDrop(1, (c) => c.dataset.name.includes('Trickstar'), 0, () => {
                        alert("Step 2: เลือก Prayer Dragon (Equip Dragon) 1 ใบจาก Drop");
                        promptCallFromDrop(1, (c) => c.dataset.name.includes('Equip Dragon'), 0, () => {
                            card.dataset.actUsed = "true";
                            alert("Nirvana Jheva: คอลเรียบร้อย!");
                        });
                    });
                }
            }
        }

        if (name.includes('Bojalcorn')) {
            if (await vgConfirm("Bojalcorn: [ACT] จ่าย CB1 เพื่อรับความสามารถโจมตีแถวหน้าทั้งหมดจากแถวหลัง?")) {
                if (payCounterBlast(1)) {
                    card.dataset.bojalcornActive = "true";
                    card.dataset.actUsed = "true";
                    alert("Bojalcorn: ได้รับความสามารถโจมตีแถวหน้าทั้งหมดแล้ว! (ต้องโจมตีจากแถวหลัง)");
                    sendMoveData(card);
                }
            }
        }

        // --- Charis (VC) ACT ---
        if (name.includes('Charis') && card.parentElement.classList.contains('vc')) {
            if (await vgConfirm("Charis: [ACT](VC) [SB1] จั่ว 2 และทิ้งการ์ด?")) {
                if (await paySoulBlast(1)) {
                    drawCard(true);
                    drawCard(true);

                    const handCards = Array.from(playerHand.querySelectorAll('.card'));
                    const orders = handCards.filter(c => c.dataset.skill && c.dataset.skill.includes('[Order]'));

                    let discarded = false;
                    if (orders.length > 0) {
                        if (await vgConfirm("Charis: คุณต้องการทิ้ง Order หรือไม่? (ถ้าไม่ทิ้งต้องทิ้งการ์ด 2 ใบ)")) {
                            alert("เลือก Order 1 ใบเพื่อทิ้ง");
                            document.body.classList.add('targeting-mode');
                            await new Promise(resolve => {
                                const orderDiscardListener = (e) => {
                                    const target = e.target.closest('.card');
                                    if (target && target.parentElement && target.parentElement.dataset.zone === 'hand' && target.dataset.skill.includes('[Order]')) {
                                        e.stopPropagation();
                                        const dropZone = document.querySelector('.my-side .drop-zone');
                                        dropZone.appendChild(target);
                                        sendMoveData(target);
                                        updateHandCount();
                                        updateDropCount();
                                        discarded = true;
                                        document.body.classList.remove('targeting-mode');
                                        document.removeEventListener('click', orderDiscardListener, true);
                                        resolve();
                                    }
                                };
                                document.addEventListener('click', orderDiscardListener, true);
                            });
                        }
                    }

                    if (!discarded) {
                        alert("เลือกการ์ด 2 ใบจากมือเพื่อทิ้ง");
                        for (let i = 0; i < 2; i++) {
                            document.body.classList.add('targeting-mode');
                            await new Promise(resolve => {
                                const normalDiscardListener = (e) => {
                                    const target = e.target.closest('.card');
                                    if (target && target.parentElement && target.parentElement.dataset.zone === 'hand') {
                                        e.stopPropagation();
                                        const dropZone = document.querySelector('.my-side .drop-zone');
                                        dropZone.appendChild(target);
                                        sendMoveData(target);
                                        updateHandCount();
                                        updateDropCount();
                                        document.body.classList.remove('targeting-mode');
                                        document.removeEventListener('click', normalDiscardListener, true);
                                        resolve();
                                    }
                                };
                                document.addEventListener('click', normalDiscardListener, true);
                            });
                        }
                    }
                    alert("Charis Skill: สำเร็จแล้ว!");
                    card.dataset.actUsed = "true";
                }
            }
        }

        // --- Lattice (RC) ACT ---
        if (name.includes('Lattice') && card.parentElement.classList.contains('rc')) {
            const vg = document.querySelector('.my-side .circle.vc .card');
            const oppVgElem = document.querySelector('.opponent-side .circle.vc .card');
            const oppGrade = oppVgElem ? parseInt(oppVgElem.dataset.grade) : 0;

            if (vg && vg.dataset.name.includes('Magnolia') && oppGrade >= 3) {
                if (await vgConfirm("Lattice: [ACT](RC) [CB1 & นำยูนิทนี้เข้าสู่โซล] เพื่อไรด์ Magnolia Elder เกรด 4 จากมือเป็น [Stand]?")) {
                    const elderInHand = Array.from(playerHand.querySelectorAll('.card')).find(c => c.dataset.name.includes('Elder') && parseInt(c.dataset.grade) === 4);

                    if (elderInHand) {
                        if (payCounterBlast(1)) {
                            // Cost: Put this into soul
                            soulPool.push(card);
                            sendMoveData(card, 'soul');
                            card.remove();
                            updateSoulUI();

                            // Ride Elder from hand
                            const vc = document.querySelector('.my-side .circle.vc');
                            const currentVG = vc.querySelector('.card');
                            if (currentVG) {
                                soulPool.push(currentVG);
                                sendMoveData(currentVG, 'soul');
                                currentVG.remove();
                            }
                            vc.appendChild(elderInHand);
                            elderInHand.classList.remove('rest');
                            elderInHand.style.transform = 'none';

                            applyStaticBonuses(elderInHand);
                            sendMoveData(elderInHand);
                            handleRideAbilities(elderInHand);
                            updateSoulUI();
                            alert("Lattice Skill: Magnolia Elder ปรากฏกาย!");
                        }
                    } else {
                        alert("ไม่พบ Magnolia Elder เกรด 4 บนมือของคุณ!");
                    }
                }
            } else {
                alert("เงื่อนไขไม่ครบ: ต้องมี Magnolia บนแวนการ์ดและแวนการ์ดคู่แข่งต้องเกรด 3 ขึ้นไป");
            }
        }

        // --- Spiritual Body Condensation [Order] ---
        if (name.includes('Spiritual Body Condensation')) {
            if (await vgConfirm("Spiritual Body Condensation: [SB1] นำ 1 ใบจากดร็อปโซนลง (RC) ใบนั้นรับพลัง +5000?")) {
                if (await paySoulBlast(1)) {
                    promptCallFromDrop(1, (c) => {
                        const vg = document.querySelector('.my-side .circle.vc .card');
                        const vgGrade = vg ? parseInt(vg.dataset.grade) : 0;
                        return parseInt(c.dataset.grade) <= vgGrade;
                    }, 5000);
                    return true;
                } else return false;
            } else return false;
        }

        // --- In the Dim Darkness, the Frozen Resentment [Order] ---
        if (name.includes('In the Dim Darkness')) {
            if (await vgConfirm("In the Dim Darkness: [SB1] ดู 3 ใบจากกองการ์ด นำ 1 ใบเข้ามือ นำ 1 ใบจากดร็อปลง (RC)?")) {
                if (await paySoulBlast(1)) {
                    const topCards = deckPool.slice(0, 3);
                    if (topCards.length > 0) {
                        openViewer("Choose a card to discard", topCards);
                        const discardSelector = async (e) => {
                            const clickedNode = e.target.closest('.card');
                            if (clickedNode && clickedNode.parentElement === viewerGrid) {
                                viewerGrid.removeEventListener('click', discardSelector);
                                const originalId = clickedNode.dataset.originalId;
                                const originalIdx = deckPool.findIndex(c => c.id === originalId);
                                if (originalIdx !== -1) {
                                    const discarded = deckPool.splice(originalIdx, 1)[0];
                                    deckPool.sort(() => 0.5 - Math.random());
                                    updateDeckCounter();
                                    const dropZone = document.querySelector('.my-side .drop-zone');
                                    const discardedElem = createCardElement(discarded);
                                    dropZone.appendChild(discardedElem);
                                    sendMoveData(discardedElem);
                                    updateDropCount();
                                    zoneViewer.classList.add('hidden');
                                    alert("Discarded card and shuffled deck. Now choose a card to call from drop.");
                                    promptCallFromDrop(1, (c) => {
                                        const vg = document.querySelector('.my-side .circle.vc .card');
                                        const vgGrade = vg ? parseInt(vg.dataset.grade) : 0;
                                        return parseInt(c.dataset.grade) <= vgGrade;
                                    }, 0);
                                }
                            }
                        };
                        viewerGrid.addEventListener('click', discardSelector);
                    } else {
                        alert("Deck is empty!");
                    }
                }
            }
        }
    }

    if (closeSkillBtn) {
        closeSkillBtn.onclick = () => skillViewer.classList.add('hidden');
    }

    function handleIncomingData(data) {
        console.log('Data received:', data.type);
        const oppSide = document.querySelector('.opponent-side');

        switch (data.type) {
            case 'syncCounts':
                if (oppHandCountNum) oppHandCountNum.textContent = data.hand;
                if (oppDeckCountNum) oppDeckCountNum.textContent = data.deck;
                if (oppDropCountNum) oppDropCountNum.textContent = data.drop;
                if (oppDamageCountNum) oppDamageCountNum.textContent = data.damage;
                const oqDrop = document.getElementById('opp-quick-drop-num');
                const oqDamage = document.getElementById('opp-quick-damage-num');
                const oqOrder = document.getElementById('opp-quick-order-num');
                if (oqDrop) oqDrop.textContent = data.drop;
                if (oqDamage) oqDamage.textContent = data.damage;
                if (oqOrder) oqOrder.textContent = data.order || 0;
                if (oppSoulBadge) {
                    if (data.soul > 0) {
                        oppSoulBadge.classList.remove('hidden');
                        oppSoulBadge.textContent = `Soul: ${data.soul}`;
                        window.oppSoulPool = data.soulCards || [];
                    } else {
                        oppSoulBadge.classList.add('hidden');
                        window.oppSoulPool = [];
                    }
                }
                break;
            case 'moveCard':
                syncRemoteMove(data);
                break;
            case 'removeCard':
                const remCard = document.getElementById(`opp-${data.cardId}`);
                if (remCard) {
                    remCard.classList.add('effect-retired');
                    setTimeout(() => remCard.remove(), 500);
                }
                break;
            case 'phaseChange':
                currentPhaseIndex = data.phaseIndex;
                updatePhaseUI(false);
                break;
            case 'nextTurn':
                currentTurn = data.currentTurn;
                currentPhaseIndex = 0;
                strategyActivatedThisTurn = false;
                shockStrategyActive = false;
                strategyActivatedCount = 0;
                window.promptedEndTurn = false;
                updatePhaseUI(false);
                break;
            case 'gameOver':
                showGameOver('Win');
                break;
            case 'declareAttack':
                showGuardDecision(data);
                break;
            case 'guardDecision':
                handleGuardDecision(data);
                break;
            case 'finishGuard':
                handleFinishGuard(data);
                break;
            case 'resolveAttack':
                resolveRemoteAttack(data);
                break;
            case 'revealDrive':
                showOpponentDriveCheck(data);
                break;
            case 'strategyActivated':
                strategyActivatedThisTurn = data.active;
                updateAllStaticBonuses();
                break;
            case 'bruceStatus':
                isOpponentFinalRush = data.isFinalRush;
                isOpponentFinalBurst = data.isFinalBurst;
                isOpponentPersonaRide = data.isPersona || false;
                updateStatusUI();
                break;
            case 'killshroudDebuff':
                window.killshroudDebuffActive = true;
                updateAllStaticBonuses();
                break;
            case 'hostAck': // Guest receives deck info from host
                if (data.deck === 'magnolia') {
                    // Host is Magnolia, Guest keeps Bruce (or whatever they picked)
                }
                console.log("Host deck info received:", data.deck);
                break;
            case 'rpsChoice':
                oppRpsChoice = data.choice;
                checkRpsResult();
                break;
            case 'mulliganReady':
                oppConfirmedMulligan = true;
                checkGameStart();
                break;
            case 'syncSoulCount':
                if (oppSoulBadge) {
                    oppSoulBadge.textContent = `Soul: ${data.count}`;
                    if (data.count > 0) oppSoulBadge.classList.remove('hidden');
                    else oppSoulBadge.classList.add('hidden');
                }
                break;
            case 'syncBindCount': {
                const bBadge = document.getElementById('opp-bind-counter');
                if (bBadge) {
                    bBadge.textContent = `Bind: ${data.count}`;
                    if (data.count > 0) bBadge.classList.remove('hidden');
                    else bBadge.classList.add('hidden');
                }
                break;
            }
            case 'retireOpponentRG': // New case for Eden's skill
                promptOpponentRetireRG(data.attackerName);
                break;
            case 'announcePersona':
                isOpponentPersonaRide = true;
                alert("RIVAL ACTIVE: PERSONA RIDE! Their front row units gain +10000 Power!");
                updateAllStaticBonuses();
                break;
            case 'forceRetire':
                const frCard = document.getElementById(data.cardId) || document.getElementById(`opp-${data.cardId}`);
                if (frCard) {
                    frCard.classList.add('effect-retired');
                    setTimeout(() => {
                        const side = frCard.classList.contains('opponent-card') ? '.opponent-side' : '.my-side';
                        const dropZone = document.querySelector(`${side} .drop-zone`);
                        if (dropZone) dropZone.appendChild(frCard);
                        frCard.classList.remove('effect-retired', 'rest', 'face-down');
                        if (!frCard.classList.contains('opponent-card')) window.myRGRetiredThisTurn = true;
                        updateDropCount();
                        updateAllStaticBonuses();
                    }, 500);
                    alert(`ยูนิทฝั่ง ${frCard.classList.contains('opponent-card') ? 'ตรงข้าม' : 'ของคุณ'} ถูกรีไทร์!`);
                }
                break;
            case 'retireColumn':
                retireMyColumn(data.column);
                break;
        }
    }

    function promptOpponentRetireRG(attackerName) {
        alert(`${attackerName}: เลือกเรียร์การ์ดของคุณ 1 ใบเพื่อรีไทร์ (Retire)`);
        document.body.classList.add('targeting-mode');

        const retireListener = (e) => {
            const targetRG = e.target.closest('.card:not(.opponent-card)');
            if (targetRG && targetRG.parentElement && targetRG.parentElement.classList.contains('rc')) {
                // Check for Resist
                if (isCardResistant(targetRG)) {
                    alert("ยูนิทนี้มีความสามารถ RESIST! ไม่สามารถเลือกได้โดยคู่แข่ง");
                    return;
                }
                e.stopPropagation();
                const dropZone = document.querySelector('.my-side .drop-zone');
                dropZone.appendChild(targetRG);
                window.myRGRetiredThisTurn = true;
                sendMoveData(targetRG); // Send back to attacker to confirm move to their drop
                updateDropCount();
                updateAllStaticBonuses();
                document.body.classList.remove('targeting-mode');
                document.removeEventListener('click', retireListener, true);
                alert("รีไทร์สำเร็จ!");
            } else if (targetRG && targetRG.classList.contains('opponent-card')) {
                alert("ต้องเลือกเรียร์การ์ดของตัวคุณเอง!");
            }
        };
        document.addEventListener('click', retireListener, true);
    }

    async function promptRetireColumn() {
        alert("Bram Vairina: เลือก 1 Column ของคุณ เพื่อรีไทร์ยูนิทคู่แข่งในแถวนั้นทั้งหมด");
        document.body.classList.add('targeting-mode');

        return new Promise(resolve => {
            const choiceListener = (e) => {
                const circle = e.target.closest('.my-side .circle');
                if (circle) {
                    const zone = circle.dataset.zone || "";
                    let col = null;
                    if (zone.includes('left')) col = 'left';
                    else if (zone.includes('right')) col = 'right';
                    else if (zone.includes('center')) col = 'center';

                    if (col) {
                        e.stopPropagation();
                        sendData({ type: 'retireColumn', column: col });
                        alert(`เลือกแถวตั้ง ${col}! ยูนิทคู่แข่งในแถวนั้นจะถูกรีไทร์`);
                        document.body.classList.remove('targeting-mode');
                        document.removeEventListener('click', choiceListener, true);
                        resolve(true);
                    }
                }
            };
            document.addEventListener('click', choiceListener, true);
        });
    }

    function retireMyColumn(column) {
        const colZones = column === 'left' ? ['rc_front_left', 'rc_back_left'] :
            column === 'right' ? ['rc_front_right', 'rc_back_right'] :
                ['vc', 'rc_back_center'];

        colZones.forEach(z => {
            const circle = document.querySelector(`.my-side .circle[data-zone="${z}"]`);
            if (circle) {
                const card = circle.querySelector('.card:not(.opponent-card)');
                if (card && !circle.classList.contains('vc')) {
                    if (isCardResistant(card)) {
                        alert(`ยูนิทในช่อง ${z} มี Resist! ไม่สามารถรีไทร์ได้`);
                        return;
                    }
                    const dropZone = document.querySelector('.my-side .drop-zone');

                    // Drop Materials first
                    if (card.unitSoul && card.unitSoul.length > 0) {
                        card.unitSoul.forEach(m => {
                            dropZone.appendChild(m);
                            sendMoveData(m);
                        });
                        card.unitSoul = [];
                    }

                    dropZone.appendChild(card);
                    card.classList.remove('rest');
                    sendMoveData(card);
                    updateDropCount();
                }
            }
        });
        alert(`แถวตั้ง ${column} ของคุณถูกรีไทร์แล้ว!`);
    }

    function promptGiunoslaPowerTransfer(giunoslaCard) {
        const currentPower = parseInt(giunoslaCard.dataset.power);
        alert(`Giunosla: เลือกเรียร์การ์ดใบอื่น 1 ใบเพื่อรับพลัง +${currentPower}`);
        document.body.classList.add('targeting-mode');

        const transferListener = (e) => {
            const targetRG = e.target.closest('.card:not(.opponent-card)');
            if (targetRG && targetRG !== giunoslaCard && targetRG.parentElement && targetRG.parentElement.classList.contains('rc')) {
                e.stopPropagation();
                targetRG.dataset.power = parseInt(targetRG.dataset.power) + currentPower;
                syncPowerDisplay(targetRG);
                sendMoveData(targetRG);
                alert(`${targetRG.dataset.name} ได้รับพลัง +${currentPower}!`);
                document.body.classList.remove('targeting-mode');
                document.removeEventListener('click', transferListener, true);
            } else if (targetRG === giunoslaCard) {
                alert("เลือกยูนิทใบอื่นที่ไม่ใช่ Giunosla ตัวนี้!");
            }
        };
        document.addEventListener('click', transferListener, true);
    }

    function showOpponentDriveCheck(data) {
        const cardData = data.cardData;
        const checkCard = createCardElement(cardData);
        checkCard.classList.add('opponent-card');
        checkCard.style.position = 'absolute';
        checkCard.style.top = '20%'; // Show it near the top of the screen
        checkCard.style.left = '50%';
        checkCard.style.zIndex = '9999';
        // Disable grabbing
        checkCard.draggable = false;
        checkCard.classList.add('effect-trigger'); // Apply trigger flash
        document.body.appendChild(checkCard);

        setTimeout(() => {
            checkCard.remove();
        }, 2000);
    }

    function showGuardDecision(attackData) {
        window.currentIncomingAttack = attackData; // Store globally for restrict check
        let overlay = document.getElementById('guard-decision-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'guard-decision-overlay';
            overlay.className = 'overlay glass-panel';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.flexDirection = 'column';
            overlay.style.zIndex = '10000';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
            overlay.style.backdropFilter = 'blur(15px)';
            document.body.appendChild(overlay);
        }

        let restrictMsg = "";
        if (attackData.guardRestrictGrades && attackData.guardRestrictGrades.length > 0) {
            restrictMsg += `<p style="color:#ff2a6d; font-weight:bold; margin-top:10px;">GUARD RESTRICT: ยูนิทมือเกรด ${attackData.guardRestrictGrades.join(', ')} คอลไม่ได้!</p>`;
        }
        if (attackData.guardRestrictCount && attackData.guardRestrictCount > 1) {
            restrictMsg += `<p style="color:#ff2a6d; font-weight:bold; margin-top:5px;">GUARD RESTRICT: ต้อง Guard ด้วยการ์ดจากมือครั้งละ ${attackData.guardRestrictCount} ใบขึ้นไป!</p>`;
        }

        overlay.innerHTML = `
            <div class="mobile-guard-box" style="width: 90%; max-width: 500px; text-align: center; padding: 2rem; background: rgba(20,20,30,0.8); border: 2px solid var(--accent-vanguard); border-radius: 20px; box-shadow: 0 0 30px rgba(255, 42, 109, 0.4);">
                <h3 style="color: var(--accent-vanguard); font-family: 'Orbitron'; margin-bottom: 10px; font-size: 1.2rem;">INCOMING ATTACK!</h3>
                <h2 style="color: white; font-size: 1.5rem; font-family: 'Orbitron', sans-serif; text-shadow: 0 0 10px #f87171; margin-bottom: 30px;">
                    ${attackData.attackerName} (${attackData.totalPower}) → ${attackData.targetName}
                </h2>
                ${restrictMsg}
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <button id="btn-guard" class="glass-btn highlight-btn" style="padding: 1.2rem; font-size: 1.3rem; background: var(--accent-blue); color: #001020; border: none; width: 100%;">GUARD</button>
                    <button id="btn-no-guard" class="glass-btn" style="padding: 1.2rem; font-size: 1.3rem; background: rgba(248, 113, 113, 0.2); color: #fecaca; border: 1px solid #f87171; width: 100%;">NO GUARD</button>
                </div>
            </div>
        `;

        document.getElementById('btn-guard').addEventListener('click', () => {
            overlay.style.display = 'none';
            isGuarding = true;
            document.querySelectorAll('.guardian-circle').forEach(gc => gc.classList.add('zone-highlight'));
            sendData({ type: 'guardDecision', decision: 'guard', attackData: attackData });
            showEndGuardButton(attackData);
        });

        document.getElementById('btn-no-guard').addEventListener('click', () => {
            overlay.style.display = 'none';
            window.currentIncomingAttack = null;
            sendData({ type: 'guardDecision', decision: 'no-guard', attackData: attackData });
        });

        overlay.style.display = 'flex';
    }

    function showEndGuardButton(attackData) {
        let btn = document.createElement('button');
        btn.innerHTML = "CONFIRM GUARD <span style='font-size: 0.8rem; display: block; opacity: 0.7;'>TAP CARD THEN GC</span>";
        btn.className = "btn glass-btn highlight-btn guard-confirm-btn";
        btn.style.position = "fixed";
        btn.style.bottom = "120px";
        btn.style.left = "50%";
        btn.style.transform = "translateX(-50%)";
        btn.style.zIndex = "2000";
        btn.style.padding = "1rem 2rem";
        btn.style.fontSize = "1.2rem";
        btn.style.width = "80%";
        btn.style.maxWidth = "300px";
        btn.style.boxShadow = "0 0 20px var(--accent-blue)";

        btn.onclick = () => {
            // Calculate Total Shield and PG check
            const gc = document.querySelector('.guardian-circle');
            const guardCards = gc ? gc.querySelectorAll('.card') : [];

            // Check Guard Restrict Count (Garou Vairina / Killshroud)
            const fromHandCount = Array.from(guardCards).filter(c => c.dataset.fromHand === "true").length;
            if (attackData.guardRestrictCount && attackData.guardRestrictCount > 1 && fromHandCount > 0 && fromHandCount < attackData.guardRestrictCount) {
                alert(`GUARD RESTRICT: ต้อง Guard ด้วยการ์ดจากบนมืออย่างน้อย ${attackData.guardRestrictCount} ใบ! (ตอนนี้เลือกไว้ ${fromHandCount} ใบ)`);
                alert("ระบบจะส่งการ์ดกลับขึ้นมือเพื่อให้คุณเลือก Guard ใหม่อีกครั้ง");
                
                // Return all guards to hand if restriction not met
                guardCards.forEach(c => {
                    const hand = document.getElementById('player-hand');
                    if (hand) {
                        hand.appendChild(c);
                        sendMoveData(c);
                    }
                });
                updateHandSpacing();
                updateGCShield();
                return; // Keep isGuarding = true and the button visible
            }

            // If check passed, proceed to finish guarding
            isGuarding = false;
            document.querySelectorAll('.guardian-circle').forEach(gc => gc.classList.remove('zone-highlight'));

            let totalShieldAdded = 0;
            let isPGActivated = false;

            guardCards.forEach(c => {
                let baseShield = parseInt(c.dataset.shield || "0");
                let bonusShield = 0;

                // Rule: Draw/Front Triggers +5000 if Opponent VG is Grade 3+
                const isDraw = c.dataset.trigger === 'Draw' || (c.dataset.name && c.dataset.name.toLowerCase().includes('draw'));
                const isFront = c.dataset.trigger === 'Front' || (c.dataset.name && c.dataset.name.toLowerCase().includes('front'));
                const oppVGGrade = parseInt(attackData.vanguardGrade || "0");

                if ((isDraw || isFront) && oppVGGrade >= 3) {
                    bonusShield = 5000;
                }

                totalShieldAdded += (baseShield + bonusShield);

                if (bonusShield > 0) {
                    console.log(`Applied +5000 Shield to ${c.dataset.name} (Rule: Opponent VG G3+)`);
                }

                if ((c.dataset.name && c.dataset.name.includes('Perfect Guard')) || c.dataset.isPG === "true") {
                    isPGActivated = true;
                }

                // Return guards to drop zone
                const dropZone = document.querySelector('.my-side .drop-zone');
                dropZone.appendChild(c);
                c.classList.remove('rest');
                c.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
                sendMoveData(c);
            });
            updateDropCount();
            updateGCShield();

            btn.remove();
            sendData({
                type: 'finishGuard',
                attackData: attackData,
                totalShield: totalShieldAdded,
                isPG: isPGActivated
            });
        };
        document.body.appendChild(btn);
    }

    async function triggerIvankaOnHitRC(attackData) {
        if (attackData.boosterName && attackData.boosterName.includes('Ivanka') && attackData.isTargetVanguard && isFinalRush) {
            setTimeout(async () => {
                if (await vgConfirm("Ivanka: [AUTO] เมื่อบูสต์ฮิตแวนการ์ด! [CB1 & นำเรียร์ที่ถูกบูสต์ไว้ใต้กอง] เพื่อจั่ว 1 และให้พลัง +5000 แก่ยูนิทอื่น?")) {
                    if (payCounterBlast(1)) {
                        const attackerElem = document.getElementById(attackData.attackerId);
                        if (attackerElem && attackerElem.parentElement.classList.contains('rc')) {
                            const cardInfo = {
                                name: attackerElem.dataset.name,
                                grade: parseInt(attackerElem.dataset.grade || "0"),
                                power: parseInt(attackerElem.dataset.power || "0"),
                                shield: parseInt(attackerElem.dataset.shield || "0"),
                                critical: parseInt(attackerElem.dataset.critical || "1"),
                                skill: attackerElem.dataset.skill || ""
                            };
                            deckPool.unshift(cardInfo); // Put to bottom of deck
                            updateDeckCounter();

                            // Remove from board remotely and locally
                            const dropZone = document.querySelector('.my-side .drop-zone');
                            dropZone.appendChild(attackerElem); // Temporary move to let syncRemoteMove catch a 'zone change'
                            sendMoveData(attackerElem);
                            attackerElem.remove(); // Then completely destroy it

                            alert("นำเรียร์การ์ดที่ถูกบูสต์กลับไปไว้ใต้กองการ์ดแล้ว");
                        }
                        drawCard(1);
                        alert("เลือกยูนิทอื่นเพื่อรับพลัง +5000 จนจบเทิร์น");
                        document.body.classList.add('targeting-mode');
                        const ivTarget = (e) => {
                            const targetUnit = e.target.closest('.card:not(.opponent-card)');
                            if (targetUnit && targetUnit !== attackerElem) {
                                e.stopPropagation();
                                targetUnit.dataset.power = parseInt(targetUnit.dataset.power) + 5000;
                                syncPowerDisplay(targetUnit);
                                sendMoveData(targetUnit);
                                alert(`Ivanka: เพิ่มพลังให้ ${targetUnit.dataset.name} เรีบบร้อย!`);
                                document.body.classList.remove('targeting-mode');
                                document.removeEventListener('click', ivTarget, true);
                            }
                        };
                        document.addEventListener('click', ivTarget, true);
                    }
                }
            }, 1000);
        }
    }

    let currentAttackResolving = false; // Guard against double resolve

    async function handleGuardDecision(data) {
        if (currentAttackResolving) return;

        const decision = data.decision;
        const attackData = data.attackData;
        const statusText = document.getElementById('game-status-text');
        if (statusText) statusText.textContent = "Network Ready";

        if (decision === 'no-guard') {
            currentAttackResolving = true;
            alert("Opponent chose: NO GUARD!");
            if (attackData.isVanguardAttacker) {
                currentAttackData = { ...attackData, opponentShield: 0 };
                const grade = parseInt(attackData.vanguardGrade || "0");
                let checks = attackData.driveCount !== undefined ? attackData.driveCount : (grade >= 4 ? 3 : (grade >= 3 ? 2 : 1));
                if (attackData.tripleDrive) checks = Math.max(checks, 3);
                if (attackData.majestyDriveBuff) checks++;
                driveCheck(checks, attackData.totalCritical);
            } else {
                // Rearguard attack check vs base target power
                const target = document.getElementById('opp-' + attackData.targetId);
                let isHit = false;
                const attackerPower = parseInt(attackData.totalPower || "0");
                if (target) {
                    const targetPower = parseInt(target.dataset.power || "0");
                    isHit = attackerPower >= targetPower;
                } else {
                    isHit = true; // Fallback
                }

                if (isHit) {
                    alert("Rearguard attack hit! Resolving damage/retire...");
                    // Eden On-Hit Retirement
                    if (attackData.attackerName.includes('Eden') && isFinalRush) {
                        setTimeout(async () => {
                            if (await vgConfirm("Eden: Cost CB 1 to retire an opponent's Rear-guard?")) {
                                if (payCounterBlast(1)) {
                                    sendData({ type: 'retireOpponentRG', attackerName: attackData.attackerName });
                                    alert("Eden: Opponent is choosing a Rear-guard to retire.");
                                } else {
                                    alert("Eden: Counter Blast not paid. Ability not activated.");
                                }
                            }
                        }, 500);
                    }
                    triggerIvankaOnHitRC(attackData);
                } else {
                    alert("Rearguard attack missed.");
                }

                sendData({ type: 'resolveAttack', attackData: { ...attackData, isHit: isHit } });
            }
            setTimeout(() => {
                currentAttackResolving = false;
                isWaitingForGuard = false;
                checkAllAttackersRested();
            }, 500);
        } else if (decision === 'guard') {
            alert("Opponent chose: GUARD! They are placing defending units now. Await their confirmation.");
        }
    }

    async function handleFinishGuard(data) {
        const attackData = data.attackData;
        const totalShield = data.totalShield || 0;
        alert(`Opponent finished placing guards! (+${totalShield} Shield)`);

        const statusText = document.getElementById('game-status-text');
        if (statusText) statusText.textContent = "Network Ready";

        currentAttackData = {
            ...attackData,
            opponentShield: totalShield
        };

        if (attackData.isVanguardAttacker) {
            const grade = parseInt(attackData.vanguardGrade || "0");
            let checks = attackData.driveCount !== undefined ? attackData.driveCount : (grade >= 4 ? 3 : (grade >= 3 ? 2 : 1));
            if (attackData.tripleDrive) checks = Math.max(checks, 3);
            if (attackData.majestyDriveBuff) checks++;
            driveCheck(checks, attackData.totalCritical, data.isPG); // Pass PG to driveCheck
        } else {
            const attacker = document.getElementById(attackData.attackerId);
            const driveAdded = attacker ? parseInt(attacker.dataset.driveAdded || "0") : 0;
            if (attacker && (attacker.dataset.baurDriveCheck === "true" || driveAdded > 0 || window.otKeterActive)) {
                let rcChecks = driveAdded > 0 ? driveAdded : 1;
                if (window.otKeterActive) rcChecks = Math.max(rcChecks, 1);
                driveCheck(rcChecks, attackData.totalCritical, data.isPG);
            } else {
                // Recalculate Rearguard attack hit immediately
                const target = document.getElementById('opp-' + attackData.targetId);
                let finalPower = attacker ? parseInt(attacker.dataset.power) + (attackData.boostPower || 0) : parseInt(attackData.totalPower || "0");
                let isHit = false;

                if (target) {
                    let targetDefPower = parseInt(target.dataset.power) + (data.totalShield || 0);
                    isHit = finalPower >= targetDefPower;
                } else {
                    isHit = true;
                }

                if (data.isPG) {
                    alert("Perfect Guard nullified the Rear-guard attack!");
                    isHit = false;
                }

                if (isHit) {
                    // Eden On-Hit Retirement
                    if (attackData.attackerName.includes('Eden') && isFinalRush) {
                        setTimeout(async () => {
                            if (await vgConfirm("Eden: Cost CB 1 to retire an opponent's Rear-guard?")) {
                                if (payCounterBlast(1)) {
                                    sendData({ type: 'retireOpponentRG', attackerName: attackData.attackerName });
                                    alert("Eden: Opponent is choosing a Rear-guard to retire.");
                                }
                            }
                        }, 500);
                    }
                    triggerIvankaOnHitRC(attackData);
                }

                await handleEndOfBattle(attacker, attackData);
                sendData({ type: 'resolveAttack', attackData: { ...currentAttackData, isHit: isHit, isPG: data.isPG } });

                setTimeout(() => {
                    isWaitingForGuard = false;
                    checkAllAttackersRested();
                }, 500);
            }
            currentAttackData = null;
        }
    }

    async function handleEndOfBattle(attacker, attackData) {
        if (!attacker) return;

        // --- Richter [AUTO] ---
        if (attacker.dataset.name.includes('Richter')) {
            const hasSora = soulPool.some(c => c.dataset.name.includes('Sora Period'));
            if (hasSora) {
                const baseAvant = bindPool.find(c => c.dataset.name.includes('"Skyrender" Avantgarda'));
                if (baseAvant) {
                    if (await vgConfirm("Richter: [AUTO] [ทิ้งการ์ด 2 ใบจากมือ] ไรด์ \"Skyrender\" Avantgarda จากไบนด์แบบ [Stand]?")) {
                        if (await payDiscard(2)) {
                            const idx = bindPool.indexOf(baseAvant);
                            bindPool.splice(idx, 1);

                            const vc = document.querySelector('.my-side .circle.vc');
                            attacker.remove();
                            soulPool.push(attacker);
                            sendMoveData(attacker, 'soul');

                            vc.appendChild(baseAvant);
                            baseAvant.classList.remove('rest');
                            baseAvant.dataset.power = parseInt(baseAvant.dataset.power) + 10000;
                            baseAvant.dataset.drive = "1";
                            baseAvant.dataset.avantStandReady = "true";
                            syncPowerDisplay(baseAvant);
                            updateSoulUI();
                            sendMoveData(baseAvant);
                            sendData({ type: 'syncBindCount', count: bindPool.length });
                            alert("Avantgarda: Ride จาก Bind สำเร็จ! Power +10000 / Drive -1 / ได้รับความสามารถ Restand!");
                        }
                    }
                }
            }
        }

        // --- Avantgarda [AUTO] Restand ---
        if (attacker.dataset.name.includes('Avantgarda') && attacker.dataset.avantStandReady === "true") {
            const isHitVG = attackData.isHit && attackData.isTargetVanguard;
            const isPersona = personaRideActive;
            if (isHitVG || isPersona) {
                if (await vgConfirm("Avantgarda: [CB1 & ทิ้งมือ 1 ใบ] Stand ยูนิทนี้ และไดรฟ์ -1 จนจบเทิร์น?")) {
                    if (await payDiscard(1)) {
                        if (payCounterBlast(1)) {
                            attacker.classList.remove('rest');
                            attacker.dataset.avantStandReady = "false"; // Only once per turn

                            let currentDrive = parseInt(attacker.dataset.drive || (parseInt(attacker.dataset.grade) >= 3 ? "2" : "1"));
                            attacker.dataset.drive = Math.max(0, currentDrive - 1);
                            alert(`Avantgarda: Stand! Drive ปรับเป็น ${attacker.dataset.drive}`);
                            sendMoveData(attacker);
                        }
                    }
                }
            }
        }
        const name = attacker.dataset.name;
        const boosterId = attackData.boosterId;
        // The following code snippet seems to be misplaced or malformed.
        // If the intention was to modify `createCardElement` to add `originalId`
        // for cards displayed in `openViewer`, that modification should be
        // within the `createCardElement` function itself, not here.
        // As per the instruction, I'm inserting it as provided,
        // but please note it will cause a syntax error and is likely incorrect.
        // It looks like a partial `if/else` block from another context.
        // } else {
        //     node = createCardElement(originalCard);
        //     // Preserve original ID for matching back to deckPool/source data
        //     if (originalCard.id) {
        //         node.dataset.originalId = originalCard.id;
        //     }
        // }
        // rId) { // This part is definitely a syntax error.
        // I will comment out the problematic part to avoid breaking the code,
        // assuming the user will clarify its intended placement.
        // If the intent was to modify `createCardElement`, that function needs to be provided.

        // --- Painkiller Angel Post-Battle ---
        if (boosterId) {
            const booster = document.getElementById(boosterId);
            if (booster && booster.dataset.name.includes('Painkiller Angel')) {
                if (await vgConfirm("Painkiller Angel: [SB1 & Retire] จั่วการ์ด 1 ใบ?")) {
                    if (await paySoulBlast(1)) {
                        const circle = booster.parentElement;
                        const dropZone = document.querySelector('.my-side .drop-zone');
                        if (circle) circle.removeChild(booster);
                        dropZone.appendChild(booster);
                        window.myRGRetiredThisTurn = true;
                        updateDropCount();
                        updateAllStaticBonuses();
                        sendMoveData(booster);
                        drawCard(true);
                        alert("Painkiller Angel: ถูกรีไทร์! จั่วการ์ด 1 ใบ");
                    }
                }
            }
        }

        // --- Ordeal Dragon Post-Battle ---
        if (name.includes('Ordeal Dragon') || (boosterId && document.getElementById(boosterId).dataset.name.includes('Ordeal Dragon'))) {
            const unit = name.includes('Ordeal Dragon') ? attacker : document.getElementById(boosterId);
            if (await vgConfirm("Ordeal Dragon: [เข้าโซล] ดูกอง 7 ใบเพื่อหา 'Blaster' ขึ้นมือ?")) {
                const circle = unit.parentElement;
                if (circle) circle.removeChild(unit);
                soulPool.push(unit);
                updateSoulUI();
                sendMoveData(unit);

                const top7 = deckPool.slice(0, 7);
                openViewer("Ordeal Dragon: Top 7", top7);
                const sel = (e) => {
                    const clicked = e.target.closest('.card');
                    if (clicked && clicked.parentElement === viewerGrid) {
                        const cName = clicked.dataset.name;
                        if (cName.includes('Blaster')) {
                            viewerGrid.removeEventListener('click', sel);
                            zoneViewer.classList.add('hidden');

                            const id = clicked.dataset.originalId;
                            const idx = deckPool.findIndex(c => c.id === id);
                            const chosen = deckPool.splice(idx, 1)[0];
                            const cardNode = createCardElement(chosen);
                            playerHand.appendChild(cardNode);
                            updateHandSpacing();
                            sendMoveData(cardNode);
                            alert(`นำ ${cName} ขึ้นมือ!`);

                            deckPool.sort(() => 0.5 - Math.random());
                            updateDeckCounter();
                        }
                    }
                };
                viewerGrid.addEventListener('click', sel);

                const closeH = () => {
                    deckPool.sort(() => 0.5 - Math.random());
                    updateDeckCounter();
                    closeViewerBtn.removeEventListener('click', closeH);
                };
                closeViewerBtn.addEventListener('click', closeH);
            }
        }

        // --- Cordiela Post-Battle Booster ---
        if (boosterId) {
            const booster = document.getElementById(boosterId);
            if (booster && booster.dataset.name.includes('Cordiela') && booster.parentElement.dataset.zone === 'rc_back_center') {
                const vgNode = document.querySelector('.my-side .circle.vc .card');
                if (vgNode && vgNode.dataset.name.includes('Majesty')) {
                    if (await vgConfirm("Cordiela: [CB1] คอล Blade และ Dark จากโซลลงคอลัมน์เดียวกัน?")) {
                        if (payCounterBlast(1)) {
                            const hasBlade = soulPool.some(c => c.dataset.name.includes('Blaster Blade'));
                            const hasDark = soulPool.some(c => c.dataset.name.includes('Blaster Dark'));

                            let mode = "both";
                            if (hasBlade && hasDark) {
                                if (!await vgConfirm("ยืนยันคอล 'ทั้งสองใบ' ใช่หรือไม่? (กด CANCEL เพื่อเลือกเพียงใบเดียว)")) {
                                    mode = await vgConfirm("คอลเฉพาะ 'Blaster Blade' ใช่หรือไม่? (กด CANCEL เพื่อคอล Blaster Dark)") ? "blade" : "dark";
                                }
                            }

                            alert(`เลือกคอลัมน์ที่ต้องการคอล ${mode === "both" ? "(ซ้ายหรือขวา)" : "ยูนิท"}`);
                            showColumnSelection((col) => {
                                if (!col || col === 'center') return;
                                const fZone = col === 'left' ? 'rc_front_left' : 'rc_front_right';
                                const bZone = col === 'left' ? 'rc_back_left' : 'rc_back_right';
                                const fCirc = document.querySelector(`.my-side .circle[data-zone="${fZone}"]`);
                                const bCirc = document.querySelector(`.my-side .circle[data-zone="${bZone}"]`);

                                if (mode === "both" && (fCirc.querySelector('.card') || bCirc.querySelector('.card'))) {
                                    alert("คอลัมน์นี้ไม่ว่าง! ไม่สามารถคอลได้ทั้งสองใบ");
                                    return;
                                }

                                if (mode === "both" || mode === "blade") {
                                    const bladeIdx = soulPool.findIndex(c => c.dataset.name.includes('Blaster Blade'));
                                    if (bladeIdx !== -1) {
                                        if (fCirc.querySelector('.card')) {
                                            alert("ช่องหน้าไม่ว่าง! คอลไม่ได้");
                                        } else {
                                            const c = soulPool.splice(bladeIdx, 1)[0];
                                            fCirc.appendChild(c);
                                            c.classList.remove('rest');
                                            applyStaticBonuses(c);
                                            sendMoveData(c);
                                        }
                                    }
                                }

                                if (mode === "both" || mode === "dark") {
                                    const darkIdx = soulPool.findIndex(c => c.dataset.name.includes('Blaster Dark'));
                                    if (darkIdx !== -1) {
                                        if (bCirc.querySelector('.card')) {
                                            alert("ช่องหลังไม่ว่าง! คอลไม่ได้");
                                        } else {
                                            const c = soulPool.splice(darkIdx, 1)[0];
                                            bCirc.appendChild(c);
                                            c.classList.remove('rest');
                                            applyStaticBonuses(c);
                                            sendMoveData(c);
                                        }
                                    }
                                }
                                updateSoulUI();
                                updateAllStaticBonuses();
                                alert(`Cordiela: การคอลเสร็จสิ้น! (${mode})`);
                            });
                        }
                    }
                }
            }
        }

        // --- Alpin Post-Battle Bind ---
        if (name.includes('Alpin') && attacker.dataset.alpinBindReady === "true") {
            if (await vgConfirm("Alpin: Bind? (CC1/SC1)")) {
                attacker.classList.add('effect-retired');
                setTimeout(() => { attacker.remove(); }, 500);
                soulCharge(1); counterCharge(1);
                sendRemoveData(attacker);
            }
        }

        // --- Goildoat Post-Battle Retire ---
        if (name.includes('Goildoat') && attacker.dataset.goildoatRetireReady === "true") {
            if (confirm("Goildoat: [End of Battle] บังคับ Retire ตัวเองเพื่อจั่วการ์ด 1 ใบ?")) {
                const dropZone = document.querySelector('.my-side .drop-zone');
                dropZone.appendChild(attacker);
                attacker.classList.remove('rest');
                sendMoveData(attacker);
                alert("Goildoat: ถูกรีไทร์แล้ว! จั่วการ์ด 1 ใบ");
                drawCard(true);
                updateDropCount();
            }
        }

        // --- Eden On-Hit (Moved here for consistency) ---
        if (attackData.isHit && name.includes('Eden') && isFinalRush) {
            // Already handled in handleFinishGuard for RGs, but lets keep it clean
        }

        // --- Magnolia G3 Post-Attack (VC) ---
        if (name.includes('Sylvan Horned Beast King, Magnolia') && attacker.parentElement.classList.contains('vc')) {
            if (isMyTurn && !attacker.dataset.magnoliaUsedInThisBattle) {
                attacker.dataset.magnoliaUsedInThisBattle = "true";
                if (await vgConfirm("Magnolia: [AUTO](VC) เมื่อจบการต่อสู้ [CB1] เพื่อเลือกยูนิทแถวหลังโจมตีและพลัง +5000?")) {
                    if (payCounterBlast(1)) {
                        const count = personaRideActive ? 3 : 1;
                        alert(`เลือกเรียร์การ์ด ${count} ใบ เพื่อให้โจมตีจากแถวหลังได้และพลัง +5000`);

                        for (let i = 0; i < count; i++) {
                            document.body.classList.add('targeting-mode');
                            await new Promise(resolve => {
                                const choiceListener = (e) => {
                                    const target = e.target.closest('.circle.rc .card:not(.opponent-card)');
                                    if (target) {
                                        e.stopPropagation();
                                        target.dataset.canAttackFromBack = "true";
                                        target.dataset.power = parseInt(target.dataset.power) + 5000;
                                        syncPowerDisplay(target);
                                        sendMoveData(target);
                                        alert(`ยูนิท ${target.dataset.name} สามารถโจมตีจากแถวหลังได้แล้ว!`);
                                        document.body.classList.remove('targeting-mode');
                                        document.removeEventListener('click', choiceListener, true);
                                        resolve();
                                    }
                                };
                                document.addEventListener('click', choiceListener, true);
                            });
                        }
                    }
                }
            }
        }

        // --- Baur Vairina Reset ---
        attacker.dataset.baurDriveCheck = "false"; 
        attacker.dataset.baurDriveUsed = "false"; 
        attacker.dataset.driveAdded = "0";

        if (attacker.dataset.baurPwrAdded && attacker.dataset.baurPwrAdded !== "0") {
            const pwrAdded = parseInt(attacker.dataset.baurPwrAdded);
            attacker.dataset.power = parseInt(attacker.dataset.power) - pwrAdded;
            attacker.dataset.baurPwrAdded = "0";
            if (attacker.dataset.emmelineAtkBonus) {
                attacker.dataset.power = (parseInt(attacker.dataset.power) - parseInt(attacker.dataset.emmelineAtkBonus)).toString();
                attacker.dataset.emmelineAtkBonus = "0";
            }
            syncPowerDisplay(attacker);
        }

        // --- Mirrors Vairina Reset ---
        if (attacker.dataset.mirrorsPowerAdded === "true") {
            attacker.dataset.power = parseInt(attacker.dataset.power) - 10000;
            attacker.dataset.mirrorsPowerAdded = "false";
            syncPowerDisplay(attacker);
        }

        // Reset temporary flags
        attacker.dataset.magnoliaUsedInThisBattle = "false";
        attacker.dataset.alpinBindReady = "false";
        attacker.dataset.goildoatRetireReady = "false";
        attacker.dataset.gabrestrict = "false";
        attacker.dataset.guardRestrictGrades = "";
        attacker.dataset.guardRestrictCount = "0";
    }

    function counterCharge(count) {
        const closedCards = Array.from(document.querySelectorAll('.my-side .damage-zone .card.face-down'));
        const toTurn = Math.min(count, closedCards.length);
        for (let i = 0; i < toTurn; i++) {
            closedCards[i].classList.remove('face-down');
            sendMoveData(closedCards[i]);
        }
        if (toTurn > 0) alert(`Counter Charge ${toTurn}!`);
    }


    function resolveRemoteAttack(data) {
        const attackData = data.attackData;
        console.log("Receiving Remote Attack Settlement:", attackData);

        if (attackData.isPG === true || attackData.isHit === false) {
            const reason = attackData.isPG ? "Perfect Guard" : "Power check";
            alert(`Attack blocked! (${reason}) Opponent's ${attackData.attackerName} (Power: ${attackData.totalPower}) did not hit your ${attackData.targetName}.`);
            return;
        }

        let targetId = attackData.targetId;
        const targetCard = document.getElementById(targetId);

        if (attackData.isTargetVanguard) {
            let totalDmg = parseInt(attackData.totalCritical || "1");
            alert(`You are taking ${totalDmg} damage! (${attackData.attackerName} hit your Vanguard)`);
            dealDamage(totalDmg);
        } else {
            if (targetCard) {
                alert(`Your ${attackData.targetName} was retired!`);
                triggerShake();

                // Retired animation before moving to drop
                targetCard.classList.add('effect-retired');

                setTimeout(() => {
                    const dropZone = document.querySelector('.my-side .drop-zone');
                    dropZone.appendChild(targetCard);
                    window.myRGRetiredThisTurn = true;
                    targetCard.classList.remove('effect-retired', 'rest');
                    targetCard.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
                    sendMoveData(targetCard);
                    updateDropCount();
                    updateAllStaticBonuses();
                }, 500);
            }
        }
        window.currentIncomingAttack = null;
    }

    function showGameOver(result) {
        if (result === 'Lose') {
            sendData({ type: 'gameOver' });
        }

        let overlay = document.getElementById('game-over-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'game-over-overlay';
            overlay.className = 'overlay glass-panel';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.flexDirection = 'column';
            overlay.style.zIndex = '10000';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
            document.body.appendChild(overlay);
        }

        overlay.innerHTML = `
            <h1 style="font-size: 4rem; color: ${result === 'Win' ? '#4ade80' : '#f87171'}; text-shadow: 0 0 20px ${result === 'Win' ? '#4ade80' : '#f87171'}; font-family: 'Orbitron', sans-serif; text-transform: uppercase;">You ${result}!</h1>
            <button id="return-lobby-btn" class="btn mt-4 glow-effect" style="margin-top: 30px; padding: 15px 40px; font-size: 1.5rem; font-family: 'Orbitron', sans-serif; cursor: pointer;">Return to Lobby</button>
        `;

        document.getElementById('return-lobby-btn').addEventListener('click', () => {
            if (peer) peer.destroy();
            window.location.href = 'lobby.html';
        });
    }

    function syncRemoteMove(data) {
        const oppSide = document.querySelector('.opponent-side');
        // Comprehensive mapping for mirroring
        const zoneMap = {
            'rc_front_left': 'rc_front_right',
            'rc_front_right': 'rc_front_left',
            'rc_back_left': 'rc_back_right',
            'rc_back_right': 'rc_back_left',
            'rc_back_center': 'rc_back_center',
            'vc': 'vc',
            'drop-zone': 'drop-zone',
            'damage-zone': 'damage-zone',
            'soul': 'soul',
            'hand': 'hand'
        };
        const mappedZone = zoneMap[data.zone] || data.zone;

        // Handle Soul move - just remove from field
        if (mappedZone === 'soul') {
            const cardId = data.cardId;
            const card = document.getElementById(cardId) || document.getElementById(`opp-${cardId}`);
            if (card) {
                card.classList.add('effect-retired');
                setTimeout(() => card.remove(), 500);
            }
            return;
        }

        const targetZone = oppSide.querySelector(`[data-zone="${mappedZone}"]`) ||
            oppSide.querySelector(`.circle.${mappedZone}`) ||
            oppSide.querySelector(`.${mappedZone}`);

        if (targetZone) {
            let cardId = (data.cardId.startsWith('h-') || data.cardId.startsWith('g-')) ? `opp-${data.cardId}` : `opp-${data.cardId}`;
            
            // Check if the card is already on our side but not as an opponent card
            const myCard = document.getElementById(data.cardId);
            // Strong Safety: Never let remote commands move our own Vanguard
            if (myCard && !myCard.classList.contains('opponent-card')) {
                const myInVC = myCard.parentElement?.classList.contains('vc');
                if (myInVC) {
                    console.warn("Blocked remote move attempt on local Vanguard:", data.cardId);
                    return;
                }
                
                // If it's another unit of ours being moved (retired), allow only to non-VC zones
                if (data.zone !== 'vc') {
                    targetZone.appendChild(myCard);
                }
                return;
            }

            let card = document.getElementById(cardId);

            if (!card) {
                card = createCardElement({
                    name: data.cardName,
                    grade: data.grade,
                    power: data.power,
                    shield: data.shield,
                    critical: data.critical,
                    skill: data.skill,
                    imageUrl: data.imageUrl
                });
                card.id = cardId;
                card.classList.add('opponent-card');
                card.draggable = false;
            } else {
                // Check if power/crit needs updating (e.g. from triggers)
                let changed = false;
                if (card.dataset.power !== String(data.power)) {
                    card.dataset.power = data.power;
                    changed = true;
                }
                if (data.critical && card.dataset.critical !== String(data.critical)) {
                    card.dataset.critical = data.critical;
                    changed = true;
                }

                if (changed) {
                    const powerSpan = card.querySelector('.card-power');
                    if (powerSpan) {
                        let displayCritical = parseInt(card.dataset.critical) > 1 ? `<span style="color:gold;">★${card.dataset.critical}</span>` : '';
                        powerSpan.innerHTML = `⚔️${parseInt(card.dataset.power) >= 1000000 ? (parseInt(card.dataset.power)/1000000).toFixed(1) + 'M' : card.dataset.power} ${displayCritical}`;
                    }
                }
            }

            // Handle Vanguard replacement or OverDress replacement clears circle first
            // Handle Vanguard replacement: ONLY clear if moving to VC AND IDs are different
            if (data.zone === 'vc') {
                targetZone.querySelectorAll('.card').forEach(c => {
                    if (c.id !== cardId) {
                        console.log("Replacing remote Vanguard:", c.id, "with", cardId);
                        c.remove();
                    }
                });
            } else if (targetZone.classList.contains('circle') && (data.isOD || data.isXOD)) {
                // OverDress replacement
                targetZone.querySelectorAll('.card').forEach(c => c.remove());
            }

            if (card.parentElement !== targetZone) {
                targetZone.appendChild(card);
            }

            // Handle visual orientation
            if (data.isRest) card.classList.add('rest');
            else card.classList.remove('rest');

            if (data.isFaceDown) card.classList.add('face-down');
            else card.classList.remove('face-down');

            // Set OD / X-OD badges
            if (data.isOD || data.isXOD) {
                let badge = card.querySelector('.dress-badge');
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'dress-badge';
                    badge.style.position = 'absolute';
                    badge.style.bottom = '-8px';
                    badge.style.left = '50%';
                    badge.style.transform = 'translateX(-50%)';
                    badge.style.color = '#fff';
                    badge.style.padding = '2px 6px';
                    badge.style.borderRadius = '8px';
                    badge.style.fontSize = '0.65rem';
                    badge.style.fontWeight = 'bold';
                    badge.style.zIndex = '5';
                    badge.style.pointerEvents = 'none';
                    card.appendChild(badge);
                }
                badge.style.backgroundColor = data.isXOD ? '#e11d48' : '#9333ea';
                badge.textContent = data.isXOD ? 'X-OD' : 'OD';
            } else {
                const badge = card.querySelector('.dress-badge');
                if (badge) badge.remove();
            }

            updateDropCount();
        }
    }

    function initGame() {
        deckPool = [...currentDeck.mainDeck];
        updateDeckCounter();
        const rideDeckZone = document.getElementById('ride-deck');
        const vanguardCircle = document.querySelector('.my-side .circle.vc');
        rideDeckZone.innerHTML = '<span class="zone-label">Ride Deck</span>';

        const starter = currentDeck.rideDeck.find(c => c.grade === 0);
        if (starter) {
            const starterCard = createCardElement(starter);
            vanguardCircle.appendChild(starterCard);
            sendMoveData(starterCard);
        }

        currentDeck.rideDeck.filter(c => c.grade > 0)
            .sort((a, b) => b.grade - a.grade)
            .forEach(c => rideDeckZone.appendChild(createCardElement(c)));

        // Start RPS sequence instead of drawing 5
        startRPS();
    }

    // --- URL Parameters Orchestration ---
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    const friendId = urlParams.get('friendId');
    const deckChoice = urlParams.get('deck');
    const customId = urlParams.get('customId');

    if (deckChoice === 'magnolia') currentDeck = magnoliaDeck;
    else if (deckChoice === 'nirvana') currentDeck = nirvanaJhevaDeck;
    else if (deckChoice === 'majesty') currentDeck = majestyDeck;
    else if (deckChoice === 'avantgarda') currentDeck = avantgardaDeck;

    if (role === 'host') {
        initPeer(customId);
    } else if (role === 'guest' && friendId) {
        if (matchmakingSubtitle) matchmakingSubtitle.textContent = `Searching Arena: ${friendId}...`;
        initPeer();

        const checkReady = setInterval(() => {
            if (peer && peer.id) {
                clearInterval(checkReady);
                if (gameStatusText) gameStatusText.textContent = 'Connecting to Host...';

                console.log("Guest connecting to:", friendId);
                conn = peer.connect(friendId, { reliable: true });
                isHost = false;
                isFirstPlayer = false;
                window.isFirstPlayer = false;

                conn.on('open', () => {
                    console.log("Connected! Handshaking...");
                    if (gameStatusText) gameStatusText.textContent = 'Handshaking...';

                    const lobbyContent = document.querySelector('.lobby-content');
                    if (lobbyContent) lobbyContent.classList.add('effect-match-found');

                    // Small delay to ensure host is ready for data and play animation
                    setTimeout(() => {
                        sendData({ type: 'guestJoin' });
                        setupConnection();
                    }, 1000);
                });

                conn.on('error', (err) => {
                    console.error("Connection error:", err);
                    if (gameStatusText) gameStatusText.textContent = "Connection Failed. Retrying...";
                    setTimeout(() => window.location.reload(), 2000);
                });
            }
        }, 800);
    }

    function openViewer(title, cards) {
        if (!zoneViewer || !viewerTitle || !viewerGrid) return;
        viewerTitle.textContent = title;
        viewerGrid.innerHTML = '';

        cards.forEach(originalCard => {
            // Support both DOM elements and data objects
            let node;
            if (originalCard instanceof HTMLElement) {
                node = originalCard.cloneNode(true);
                node.dataset.originalId = originalCard.id;
            } else {
                node = createCardElement(originalCard);
                if (originalCard.id) {
                    node.dataset.originalId = originalCard.id;
                }
            }

            node.classList.remove('dragging', 'rest', 'opponent-card');
            node.style.position = 'relative';
            node.style.transform = 'none';
            node.style.top = 'auto';
            node.style.left = 'auto';
            node.style.margin = '0';
            viewerGrid.appendChild(node);
        });

        zoneViewer.classList.remove('hidden');
    }

    if (copyGameIdBtn) {
        copyGameIdBtn.addEventListener('click', () => {
            const id = gamePeerIdDisplay.textContent;
            // Create a full URL for easier joining
            const joinUrl = `${window.location.origin}${window.location.pathname.replace('index.html', 'lobby.html')}?id=${id}`;

            if (navigator.share) {
                navigator.share({
                    title: 'Join my Vanguard Match!',
                    text: `Enter my Arena with ID: ${id}`,
                    url: joinUrl
                }).catch(err => {
                    navigator.clipboard.writeText(joinUrl);
                    alert('Match Link Copied!');
                });
            } else {
                navigator.clipboard.writeText(joinUrl);
                alert('Match Link Copied!');
            }
        });
    }

    document.querySelectorAll('.zone, .circle.vc, .circle.rc, .guardian-circle').forEach(el => {
        // DRAG AND DROP
        el.addEventListener('dragover', (e) => {
            e.preventDefault();
            el.classList.add('zone-highlight');
        });

        el.addEventListener('dragleave', () => {
            el.classList.remove('zone-highlight');
        });

        el.addEventListener('drop', async (e) => {
            e.preventDefault();
            el.classList.remove('zone-highlight');
            if (draggedCard) {
                await await validateAndMoveCard(draggedCard, el);
                draggedCard = null;
            }
        });

        el.addEventListener('click', async (e) => {
            // TAP TO MOVE EXECUTION
            if (selectedCard) {
                const moved = await validateAndMoveCard(selectedCard, el);
                if (moved) {
                    selectedCard.classList.remove('card-selected');
                    selectedCard = null;
                    return;
                }
            }

            // PRE-EXISTING CLICK LOGIC (Viewers, etc)
            // Target checks
            const isBadge = e.target.classList.contains('soul-badge');
            const isCard = e.target.classList.contains('card') || e.target.closest('.card');
            const isCircleBody = e.target === el || e.target.classList.contains('glow-ring') || e.target.classList.contains('circle-label');

            if (el.classList.contains('vc') && !isCard) {
                const isOpponentSide = el.closest('.opponent-side');
                if (isOpponentSide) {
                    const badge = el.querySelector('.soul-badge');
                    alert(`Opponent's Soul count: ${badge ? badge.textContent.split(': ')[1] : '0'}`);
                } else {
                    handleSoulView(e);
                }
                return;
            }

            // Damage/Drop viewing logic
            const zoneType = el.dataset.zone;
            if (zoneType === 'damage' || zoneType === 'drop') {
                if (!isCard) {
                    const isOpponentSide = el.closest('.opponent-side');
                    const sidePrefix = isOpponentSide ? 'Opponent ' : 'Your ';
                    const cards = el.querySelectorAll('.card');
                    openViewer(`${sidePrefix}${zoneType.charAt(0).toUpperCase() + zoneType.slice(1)} Zone (${cards.length})`, Array.from(cards));
                }
            }
        });
    });

    function updateStatusUI() {
        const myBadge = document.getElementById('bruce-status-badge');
        const oppBadge = document.getElementById('opp-bruce-status-badge');

        // Update My Status
        if (myBadge) {
            if (isFinalRush) {
                myBadge.classList.remove('hidden');
                myBadge.textContent = isFinalBurst ? "Final Burst" : "Final Rush";
                if (isFinalBurst) myBadge.classList.add('burst-status');
                else myBadge.classList.remove('burst-status');
            } else {
                myBadge.classList.add('hidden');
            }
        }

        // Update Opponent Status
        if (oppBadge) {
            if (isOpponentFinalRush) {
                oppBadge.classList.remove('hidden');
                oppBadge.textContent = isOpponentFinalBurst ? "Rival Burst" : "Rival Rush";
                if (isOpponentFinalBurst) oppBadge.classList.add('burst-status');
                else oppBadge.classList.remove('burst-status');
            } else {
                oppBadge.classList.add('hidden');
            }
        }
    }

    // inlet pulse logic moved up
    function checkBruceBattleAbility() {
        if (!isMyTurn) return;
        const vanguard = document.querySelector('.my-side .circle.vc .card');
        if (!vanguard) {
            console.log("Bruce Ability: No Vanguard found.");
            return;
        }

        const name = (vanguard.dataset.name || "").toLowerCase();
        const isBruce = name.includes('bruce');
        const isViamance = name.includes('viamance');

        console.log(`Bruce Ability Check: Name="${name}", isBruce=${isBruce}, isViamance=${isViamance}`);

        if (!isBruce && !isViamance) return;

        // Check if all units on field are "Diabolos"
        // Get all cards on player's circles
        const myUnits = document.querySelectorAll('.my-side .circle .card:not(.opponent-card)');
        console.log(`Bruce Ability Check: Found ${myUnits.length} units.`);

        if (myUnits.length === 0) return;

        const allDiabolos = Array.from(myUnits).every(u => {
            const uName = (u.dataset.name || "").toLowerCase();
            const hasDiabolos = uName.includes('diabolos');
            if (!hasDiabolos) console.log("Ability blocked by non-Diabolos unit:", uName);
            return hasDiabolos;
        });

        console.log(`Bruce Ability Check: allDiabolos=${allDiabolos}`);

        if (allDiabolos) {
            isFinalRush = true;
            finalRushTurnLimit = currentTurn + 1; // Until end of opponent's next turn

            const oppVanguard = document.querySelector('.opponent-side .circle.vc .card');
            const oppGrade = oppVanguard ? parseInt(oppVanguard.dataset.grade || "0") : 0;

            if (oppGrade >= 3) {
                isFinalBurst = true;
                alert("DIABOLOS: Entering FINAL BURST state!");
            } else {
                isFinalBurst = false;
                alert("DIABOLOS: Entering FINAL RUSH state!");
            }
            updateStatusUI();
            sendData({ type: 'bruceStatus', isFinalRush, isFinalBurst });
        } else {
            // Optional: Alert the user why it failed if they expected it
            console.log("Diabolos Ability: Requirements not met (All units must be Diabolos).");
        }
    }

    // Event Listeners for Viewer
    // View Order Zone function
    window.viewOrderZone = (side) => {
        const selector = side === 'my' ? '.my-side .order-zone' : '.opponent-side .order-zone';
        const zone = document.querySelector(selector);
        if (!zone) return;
        const cards = Array.from(zone.querySelectorAll('.card'));
        if (cards.length === 0) {
            alert(`Order Zone (${side === 'my' ? 'Mine' : "Opponent's"}) is empty.`);
            return;
        }
        openViewer(`${side === 'my' ? 'My' : "Opponent's"} Order Zone`, cards);
    };

    if (closeViewerBtn) {
        closeViewerBtn.addEventListener('click', () => zoneViewer.classList.add('hidden'));
    }
});
