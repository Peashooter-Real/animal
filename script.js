document.addEventListener('DOMContentLoaded', () => {
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

    // Opponent info
    const oppHandCountNum = document.getElementById('opp-hand-count');
    const oppDeckCountNum = document.getElementById('opp-deck-count-num');
    const oppDropCountNum = document.getElementById('opp-drop-count-num');
    const oppDamageCountNum = document.getElementById('opp-damage-count-num');
    const oppSoulBadge = document.getElementById('opp-soul-counter');
    if (oppSoulBadge) {
        oppSoulBadge.addEventListener('click', (e) => {
            e.stopPropagation();
            const countStr = oppSoulBadge.textContent.split(': ')[1] || "0";
            alert(`Opponent's Soul count: ${countStr}`);
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
    let isFirstPlayer = true;
    const phases = ['stand', 'draw', 'ride', 'main', 'battle', 'end'];
    let currentPhaseIndex = 0;
    let hasRiddenThisTurn = false;
    let hasDiscardedThisTurn = false;
    let hasDrawnThisTurn = false;
    let soulPool = [];

    // --- Multiplayer State ---
    let peer = null;
    let conn = null;
    let isHost = false;
    let isMyTurn = false;
    let gameStarted = false; // Add flag to track if game has actually begun
    let isGuarding = false; // Add guard checking state
    let pendingPowerIncrease = 0;
    let pendingCriticalIncrease = 0;
    let targetingType = null; // 'power' or 'critical' or 'both'
    let pendingDamageChecks = 0; // Queue damage until drive checks finish
    let currentAttackData = null; // Store for recalculation after buffs
    let selectedCard = null; // Track selected card for tap-to-move
    let personaRideActive = false; // Track if Persona Ride buff is active for this turn

    // --- Card Image Database ---
    const cardImages = {
        // Bruce Deck
        'Diabolos, "Innocent" Matt': 'picture/grade0_bruce.jpg',
        'Diabolos, "Bad" Steve': '',
        'Diabolos, "Anger" Richard': '',
        'Diabolos, "Viamance" Bruce': 'picture/viamance_bruce.jpg',
        'Diabolos Diver, Julian': 'picture/145378.jpg',
        'Diabolos Madonna, Megan': '',

        // Magnolia Deck
        'Sylvan Horned Beast, Lotte': '',
        'Sylvan Horned Beast, Charis': '',
        'Sylvan Horned Beast, Lattice': '',
        'Sylvan Horned Beast King, Magnolia': 'https://s3-ap-northeast-1.amazonaws.com/cf-img-mono-vanguard-card-front/201201_3879_1_c.jpg', // Example link
        'Sylvan Horned Beast, Giunosla': '',
        'Sylvan Horned Beast, Enpix': '',

        // Triggers - Dark States (Bruce)
        'Critical Trigger (Dark States)': '',
        'Draw Trigger (Dark States)': '',
        'Front Trigger (Dark States)': '',
        'Heal Trigger (Dark States)': '',
        'Hades Dragon Deity, Gallmageveld': '',

        // Triggers - Stoicheia (Magnolia)
        'Critical Trigger (Stoicheia)': '',
        'Draw Trigger (Stoicheia)': '',
        'Front Trigger (Stoicheia)': '',
        'Heal Trigger (Stoicheia)': '',
        'Source Dragon Deity, Blessfavor': ''
    };

    // --- Deck Definitions ---
    // --- Deck Definitions ---
    const bruceDeck = {
        rideDeck: [
            { name: 'Diabolos, "Innocent" Matt', grade: 0, power: 6000, shield: 10000 },
            { name: 'Diabolos, "Bad" Steve', grade: 1, power: 8000, shield: 5000 },
            { name: 'Diabolos, "Anger" Richard', grade: 2, power: 10000, shield: 5000 },
            { name: 'Diabolos, "Viamance" Bruce', grade: 3, power: 13000, persona: true }
        ],
        mainDeck: [
            // G3 (6 cards total - excluding ride deck Bruce)
            ...Array(3).fill({ name: 'Diabolos, "Viamance" Bruce', grade: 3, power: 13000, persona: true }),
            ...Array(3).fill({ name: 'Diabolos Diver, Julian', grade: 3, power: 13000 }),

            // G2 (15 cards total)
            ...Array(4).fill({ name: 'Diabolos Madonna, Megan', grade: 2, power: 10000, shield: 5000 }),
            ...Array(4).fill({ name: 'Diabolos Boys, Eden', grade: 2, power: 10000, shield: 5000 }),
            ...Array(3).fill({ name: 'Diabolos Buckler, Jamil', grade: 2, power: 10000, shield: 5000 }),
            ...Array(4).fill({ name: 'Recusal Hate Dragon (Perfect Guard)', grade: 1, power: 8000, shield: 0, isPG: true }), // PG typically has 0 shield but special effect

            // G1 (13 cards total - PG moved to G1 list for user clarification)
            ...Array(4).fill({ name: 'Diabolos Girls, Stefanie', grade: 1, power: 8000, shield: 10000 }),
            ...Array(3).fill({ name: 'Diabolos Madonna, Mabel', grade: 1, power: 8000, shield: 5000 }),
            ...Array(2).fill({ name: 'Diabolos Girls, Ivanka', grade: 1, power: 8000, shield: 10000 }),

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
            { name: 'Sylvan Horned Beast, Lotte', grade: 0, power: 6000, shield: 10000 },
            { name: 'Sylvan Horned Beast, Charis', grade: 1, power: 8000, shield: 5000 },
            { name: 'Sylvan Horned Beast, Lattice', grade: 2, power: 10000, shield: 5000 },
            { name: 'Sylvan Horned Beast King, Magnolia', grade: 3, power: 13000, persona: true }
        ],
        mainDeck: generateMainDeck(
            [
                { name: 'Sylvan Horned Beast, Giunosla', grade: 2, power: 10000, shield: 5000 },
                { name: 'Sylvan Horned Beast, Enpix', grade: 1, power: 8000, shield: 10000 }
            ],
            [
                { name: 'Source Dragon Deity, Blessfavor', grade: 0, power: 5000, shield: 50000, trigger: 'Over', overPower: '100 Million' },
                { name: 'Critical Trigger (Stoicheia)', grade: 0, power: 5000, shield: 15000, trigger: 'Critical' },
                { name: 'Draw Trigger (Stoicheia)', grade: 0, power: 5000, shield: 5000, trigger: 'Draw' },
                { name: 'Heal Trigger (Stoicheia)', grade: 0, power: 5000, shield: 15000, trigger: 'Heal' },
                { name: 'Front Trigger (Stoicheia)', grade: 0, power: 5000, shield: 15000, trigger: 'Front' }
            ]
        )
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

        sendData({
            type: 'syncCounts',
            damage: myDamage,
            drop: myDrop,
            hand: myHand,
            soul: mySoul,
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

            clone.onclick = () => {
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
                }
                zoneViewer.classList.add('hidden');
                if (onComplete) onComplete();
            };
            viewerGrid.appendChild(clone);
        });
    }

    function promptRetireToSoulForDraw(onComplete) {
        const rearGuards = document.querySelectorAll('.my-side .circle.rc .card:not(.opponent-card)');
        if (rearGuards.length === 0) {
            alert("No Rear-guards to pay for Richard's ability!");
            if (onComplete) onComplete();
            return;
        }

        if (confirm("Use Richard's ability? Cost: Put 1 Rear-guard into Soul to draw 1 card.")) {
            alert("Select a Rear-guard to put into Soul.");
            document.body.classList.add('targeting-mode');

            const costListener = (e) => {
                const card = e.target.closest('.card');
                if (card && card.parentElement && card.parentElement.classList.contains('rc') && !card.classList.contains('opponent-card')) {
                    e.stopPropagation();
                    soulPool.push(card);
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
        if (!queue || queue.length === 0) return;

        if (queue.length === 1) {
            queue[0].resolve(() => { });
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
                    setTimeout(() => resolveAbilityQueue(nextQueue), 300);
                });
            };
            viewerGrid.appendChild(tile);
        });
    }

    function checkRideAbilities(oldVanguard, newCard) {
        const queue = [];

        // G0 Matt: When ridden over, if second, draw 1 (Mandatory)
        if (oldVanguard && (oldVanguard.dataset.name === 'Diabolos, "Innocent" Matt')) {
            if (!isFirstPlayer) {
                queue.push({
                    name: 'Matt (G0)',
                    description: "Draw 1 (Go Second Effect)",
                    resolve: (done) => {
                        alert(`Ability: "Innocent" Matt - Draw 1!`);
                        drawCard(true);
                        if (done) done();
                    }
                });
            }
        }

        // G1 Steve: On V, Call from Soul and then SC1 (Mandatory if soul exists)
        if (newCard.dataset.name === 'Diabolos, "Bad" Steve') {
            queue.push({
                name: 'Steve (G1)',
                description: "Call from Soul then Soul Charge 1",
                resolve: (done) => {
                    alert(`Ability: "Bad" Steve - Call from Soul then Soul Charge 1!`);
                    promptSoulCall('rc_back_center', () => {
                        soulCharge(1);
                        if (done) done();
                    }, false); // Mandatory sourcing
                }
            });
        }

        // G2 Richard: On V, Retire RG to Soul to Draw 1 (Optional - Cost)
        if (newCard.dataset.name === 'Diabolos, "Anger" Richard') {
            queue.push({
                name: 'Richard (G2)',
                description: "Cost: Put RG to Soul to Draw 1",
                resolve: (done) => {
                    promptRetireToSoulForDraw(done);
                }
            });
        }

        resolveAbilityQueue(queue);
    }

    function createCardElement(cardData) {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        card.id = `card-${cardIdCounter++}`;
        card.dataset.grade = cardData.grade;
        card.dataset.power = cardData.power;
        card.dataset.basePower = cardData.power;
        card.dataset.critical = cardData.critical || 1;
        card.dataset.baseCritical = card.dataset.critical;
        card.dataset.shield = cardData.shield || 0;
        card.dataset.trigger = cardData.trigger || '';
        card.dataset.name = cardData.name;

        const artText = cardData.name.substring(0, 3).toUpperCase();
        let triggerIcon = cardData.trigger ? `<div class="card-trigger bg-${cardData.trigger.toLowerCase()}">${cardData.trigger[0]}</div>` : '';
        let personaIcon = cardData.persona ? `<div class="card-persona">Persona</div>` : '';
        let displayPower = cardData.overPower ? '100M' : cardData.power;
        let displayCritical = parseInt(card.dataset.critical) > 1 ? `<span style="color:gold;">★${card.dataset.critical}</span>` : '';

        const artUrl = cardData.imageUrl || cardImages[cardData.name] || '';
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

        card.addEventListener('dragstart', (e) => {
            const inHand = card.parentElement.dataset.zone === 'hand';
            const isGrade2FrontRow = card.dataset.grade == "2" && card.parentElement.dataset.zone && card.parentElement.dataset.zone.startsWith('rc_front_');
            const isOnField = card.parentElement.classList.contains('circle');

            const parent = card.parentElement;
            const isRestricted = parent.classList.contains('drop-zone') ||
                parent.classList.contains('damage-zone') ||
                parent.classList.contains('ride-deck-zone');

            if (isRestricted) {
                e.preventDefault();
                return;
            }

            if (!isMyTurn) {
                if (!isGuarding) {
                    e.preventDefault();
                    return;
                } else {
                    if (!inHand && !isGrade2FrontRow) {
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

                    // Allow moving Rear-guards during Main Phase (specifically left/right columns as requested)
                    if (currentPhase === 'main' && !isVanguard && isLeftOrRightRG) {
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
                        powerSpan.innerHTML = `⚔️${card.dataset.power >= 100000 ? '100M' : card.dataset.power} ${displayCritical}`;
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
                            alert("Backrow units cannot attack!");
                            return;
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

    function sendMoveData(card) {
        sendData({
            type: 'moveCard',
            cardId: card.id,
            cardName: card.dataset.name,
            zone: card.parentElement.dataset.zone,
            isRest: card.classList.contains('rest'),
            grade: card.dataset.grade,
            power: card.dataset.power,
            critical: card.dataset.critical,
            shield: card.dataset.shield,
            basePower: card.dataset.basePower,
            baseCritical: card.dataset.baseCritical
        });
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

    function dealDamage(checksLeft = 1) {
        if (checksLeft <= 0) return;
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
                setTimeout(() => dealDamage(checksLeft - 1), 800);
            }
        }
    }

    function attackHitCheck(initialCritical, isOpponentPG = false) {
        if (!currentAttackData) return;

        const attacker = document.getElementById(currentAttackData.attackerId);
        const target = document.getElementById('opp-' + currentAttackData.targetId);

        if (!attacker || !target) {
            currentAttackData = null;
            return;
        }

        // Recalculate based on current state (AFTER DRIVE TRIGGERS)
        let finalPower = parseInt(attacker.dataset.power) + (currentAttackData.boostPower || 0);
        let finalCritical = parseInt(attacker.dataset.critical);

        // Find target power - it's on our locally synced version of opponent's card
        const opponentShield = currentAttackData.opponentShield || 0;
        let targetDefendingPower = parseInt(target.dataset.power) + opponentShield;

        const isHit = finalPower >= targetDefendingPower;

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
                    isHit: false, // Forces miss
                    isPG: true
                }
            });
        } else {
            if (!isHit) {
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

        currentAttackData = null;
        pendingCriticalIncrease = 0;
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
                // Add NEW clean copy to hand to fix sizing bugs
                const cardInHand = createCardElement(cardData);
                playerHand.appendChild(cardInHand);
                updateHandCount();
                sendData({ type: 'syncHandCount', count: playerHand.querySelectorAll('.card').length });

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
            if (!isDamageCheck) drawCard(true);
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
    }

    function performAttack(attacker, target) {
        // Stricter Targeting: Only allow attacking opponent's units on field (circles)
        const targetParent = target.parentElement;
        const isTargetOnField = targetParent && targetParent.classList.contains('circle');
        const isOpponentCard = target.classList.contains('opponent-card');

        if (!isOpponentCard || !isTargetOnField) {
            alert("Invalid Target! You can only attack opponent's units on the field.");
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

        let targetId = target.id;
        if (targetId.startsWith('opp-')) targetId = targetId.substring(4);

        if (!confirm(`Attack ${target.dataset.name} with ${attacker.dataset.name}?`)) {
            attacker.classList.remove('attacking-glow');
            attackingCard = null;
            return;
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
        if (backZoneName) {
            const backCircle = document.querySelector(`.my-side .circle[data-zone="${backZoneName}"]`);
            if (backCircle) {
                const card = backCircle.querySelector('.card:not(.opponent-card)');
                if (card && !card.classList.contains('rest')) {
                    const grade = parseInt(card.dataset.grade);
                    if (grade === 0 || grade === 1) { // Grade 0 and 1 have Boost
                        if (confirm(`Do you want to Boost with your backrow ${card.dataset.name}? (+${card.dataset.power} Power)`)) {
                            card.classList.add('rest');
                            sendMoveData(card);
                            boosterPower = parseInt(card.dataset.power);
                            totalPower += boosterPower;
                            attackerNameFull = `${attacker.dataset.name} (Boosted by ${card.dataset.name})`;
                        }
                    }
                }
            }
        }

        attacker.classList.add('rest');
        sendMoveData(attacker);

        const isVanguardAttacker = attacker.parentElement.classList.contains('vc');
        const isTargetVanguard = target.parentElement.classList.contains('vc');

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
            vanguardGrade: attacker.dataset.grade
        };

        sendData({
            type: 'declareAttack',
            ...attackData
        });

        const statusText = document.getElementById('game-status-text');
        if (statusText) statusText.textContent = "Waiting for opponent to guard...";
    }

    function validateAndMoveCard(card, zone) {
        if (!card || !zone) return false;

        const oldParent = card.parentElement;
        const isFromHand = oldParent && oldParent.dataset.zone === 'hand';
        const isFromField = oldParent && oldParent.classList.contains('circle');
        const isFromVC = oldParent && oldParent.classList.contains('vc');

        // 0. Vanguard Movement Restriction
        if (isFromVC && (zone.classList.contains('rc') || zone.dataset.zone === 'hand')) {
            alert("Vanguard cannot be moved to Rear-guard circle or Hand!");
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

            // Perfect Guard Logic: Discard cost
            const isPG = (card.dataset.name && card.dataset.name.includes('Perfect Guard')) || card.dataset.isPG === "true";
            if (isPG) {
                const cardsInHand = Array.from(playerHand.querySelectorAll('.card'));
                // Filter out the current card being moved to GC if it's from hand
                const otherCardsInHand = cardsInHand.filter(c => c.id !== card.id);

                if (otherCardsInHand.length >= 1) { // If there are other cards left in hand
                    if (confirm("Perfect Guard: Discard 1 card from hand as cost?")) {
                        alert("Select a card from your hand to discard.");
                        document.body.classList.add('targeting-mode');

                        const pgDiscardListener = (e) => {
                            const discardTarget = e.target.closest('.card');
                            if (discardTarget && discardTarget.parentElement && discardTarget.parentElement.dataset.zone === 'hand' && discardTarget.id !== card.id) {
                                e.stopPropagation();
                                const dropZone = document.querySelector('.my-side .drop-zone');
                                dropZone.appendChild(discardTarget);
                                discardTarget.classList.remove('rest');
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

            zone.appendChild(card);
            card.classList.remove('rest');
            card.style.transform = 'none';
            sendMoveData(card);
            updateHandCount();
            updateDropCount();
            updateGCShield();
            return true;
        }

        // 3. Turn Check
        if (!isMyTurn) return false;
        const currentPhase = phases[currentPhaseIndex];

        // 4. Circle Validation (Ride/Call/Move)
        if (zone.classList.contains('circle')) {
            const cardGrade = parseInt(card.dataset.grade);
            const vanguard = document.querySelector('.my-side .circle.vc .card');
            const vanguardGrade = vanguard ? parseInt(vanguard.dataset.grade) : 0;

            if (zone.classList.contains('vc')) {
                if (currentPhase !== 'ride') { alert("Only Ride during Ride Phase!"); return false; }
                if (hasRiddenThisTurn) { alert("Only Ride once per turn!"); return false; }
                if (cardGrade !== vanguardGrade + 1 && !(cardGrade === 3 && vanguardGrade === 3)) {
                    alert(`Cannot Ride Grade ${cardGrade} over ${vanguardGrade}!`);
                    return false;
                }
                // This block handles the actual ride logic, regardless of where the card came from (hand or ride-deck)
                if (vanguard) {
                    const oldV = vanguard.cloneNode(true);
                    Object.assign(oldV.dataset, vanguard.dataset);

                    const oldVName = vanguard.dataset.name;
                    const oldVGrade = parseInt(vanguard.dataset.grade);
                    // Check if it's the same name and grade 3
                    const isPersonaRide = (card.dataset.persona === 'true' || card.dataset.persona === true || card.dataset.name === oldVName) && (oldVGrade === 3) && (parseInt(card.dataset.grade) === 3);

                    soulPool.push(vanguard);
                    vanguard.remove();
                    updateSoulUI();

                    if (isPersonaRide) {
                        alert("PERSONA RIDE! Front row units get +10,000 Power for the turn! Skipping to Main Phase.");
                        personaRideActive = true;
                        drawCard(true); // Persona Ride usually includes draw 1

                        document.querySelectorAll('.my-side .front-row .circle .card:not(.opponent-card)').forEach(unit => {
                            let p = parseInt(unit.dataset.power);
                            unit.dataset.power = p + 10000;
                            const powerSpan = unit.querySelector('.card-power');
                            if (powerSpan) {
                                const critVal = parseInt(unit.dataset.critical || "1");
                                let displayCritical = critVal > 1 ? `<span style="color:gold;">★${critVal}</span>` : '';
                                powerSpan.innerHTML = `⚔️${unit.dataset.power} ${displayCritical}`;
                            }
                            sendMoveData(unit);
                        });

                        // Immediately skip to Main Phase
                        setTimeout(() => {
                            currentPhaseIndex = phases.indexOf('main');
                            updatePhaseUI(true);
                        }, 800);
                    }
                    checkRideAbilities(oldV, card);
                }
                hasRiddenThisTurn = true;
            } else if (zone.classList.contains('rc')) {
                if (currentPhase !== 'main') { alert("Only Call or Move during Main Phase!"); return false; }

                // Only enforce grade limit if calling from hand
                if (isFromHand && cardGrade > vanguardGrade) {
                    alert(`Cannot Call Grade ${cardGrade} (VG is G${vanguardGrade})!`);
                    return false;
                }

                // Persona Ride Passive Power: If we call a unit while Persona Ride node is active, it gets +10k
                if (personaRideActive) {
                    let p = parseInt(card.dataset.power);
                    card.dataset.power = p + 10000;

                    // Immediately update UI for the called card
                    const powerSpan = card.querySelector('.card-power');
                    if (powerSpan) {
                        const critVal = parseInt(card.dataset.critical || "1");
                        let displayCritical = critVal > 1 ? `<span style="color:gold;">★${critVal}</span>` : '';
                        powerSpan.innerHTML = `⚔️${card.dataset.power} ${displayCritical}`;
                    }
                }
            }

            // --- Handle Existing Card (Swap or Retire) ---
            const existingCard = zone.querySelector('.card:not(.opponent-card)');
            if (existingCard && existingCard !== card) {
                if (isFromField && zone.classList.contains('rc')) {
                    // SWAP: Move existing card to old circle (only for RC to RC move)
                    oldParent.appendChild(existingCard);
                    sendMoveData(existingCard);
                } else {
                    // RETIRE: Move existing card to drop zone (if calling from hand or riding)
                    const dropZone = document.querySelector('.my-side .drop-zone');
                    dropZone.appendChild(existingCard);
                    existingCard.classList.remove('rest');
                    existingCard.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
                    sendMoveData(existingCard);
                }
            }
        }

        // 5. Drop Zone Validation (Discard)
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
                        hasDiscardedThisTurn = true;
                        hasRiddenThisTurn = true;
                        setTimeout(() => {
                            if (vanguard) {
                                const oldV = vanguard.cloneNode(true);
                                Object.assign(oldV.dataset, vanguard.dataset);

                                soulPool.push(vanguard);
                                vanguard.remove();
                                updateSoulUI();
                                checkRideAbilities(oldV, nextRideCard);
                            }
                            const vcZone = document.querySelector('.my-side .circle.vc');
                            vcZone.appendChild(nextRideCard);
                            nextRideCard.classList.remove('rest', 'opponent-card');
                            nextRideCard.style.transform = 'none';
                            sendMoveData(nextRideCard);
                            alert(`Auto-Ride: ${nextRideCard.dataset.name}!`);
                            currentPhaseIndex = phases.indexOf('main');
                            updatePhaseUI(true);
                        }, 500);
                    }
                }
            }
            card.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
        } else {
            card.style.transform = 'none';
        }

        // Execute Move
        zone.appendChild(card);
        card.classList.remove('rest');
        card.classList.add('effect-drop');
        setTimeout(() => card.classList.remove('effect-drop'), 400);

        sendMoveData(card);
        updateHandCount();
        updateDropCount();
        return true;
    }

    // --- Interaction Setup ---
    boardAreas.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            if (draggedCard) {
                const isFromHand = draggedCard.parentElement && draggedCard.parentElement.dataset.zone === 'hand';
                if (isFromHand) {
                    const isMySide = zone.closest('.my-side');
                    const isSharedGC = zone.id === 'shared-gc';
                    const isVanguard = zone.classList.contains('vc');
                    const isRearguard = zone.classList.contains('rc');
                    const isDropZone = zone.classList.contains('drop-zone');
                    const allowed = (isMySide && (isVanguard || isRearguard || isDropZone)) || isSharedGC;

                    if (!allowed) {
                        e.dataTransfer.dropEffect = 'none';
                        return;
                    }
                }
            }
            e.preventDefault();
            if (!zone.classList.contains('drag-over') && draggedCard) {
                zone.classList.add('drag-over');
            }
        });

        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            if (!draggedCard) return;
            validateAndMoveCard(draggedCard, zone);
        });
    });

    playerHand.addEventListener('dragover', e => e.preventDefault());
    playerHand.addEventListener('drop', e => {
        e.preventDefault();
        if (draggedCard) {
            playerHand.appendChild(draggedCard);
            draggedCard.classList.remove('rest');
            draggedCard.style.transform = 'none';
            draggedCard.classList.add('effect-drop');
            setTimeout(() => draggedCard.classList.remove('effect-drop'), 400);

            updateHandCount();
            sendMoveData(draggedCard);
            updateHandCount();
        }
    });

    function resetMyUnits() {
        console.log("Resetting unit power/critical for new turn...");
        personaRideActive = false; // Reset Persona Ride
        document.querySelectorAll('.my-side .circle .card:not(.opponent-card), .my-side .vc .card:not(.opponent-card)').forEach(c => {
            let changed = false;
            // Use loose inequality to handle string/number mismatches in dataset
            if (c.dataset.basePower && c.dataset.power != c.dataset.basePower) {
                c.dataset.power = c.dataset.basePower;
                changed = true;
            }
            if (c.dataset.baseCritical && c.dataset.critical != c.dataset.baseCritical) {
                c.dataset.critical = c.dataset.baseCritical;
                changed = true;
            }

            if (changed) {
                const powerSpan = c.querySelector('.card-power');
                if (powerSpan) {
                    const critVal = parseInt(c.dataset.critical || "1");
                    let displayCritical = critVal > 1 ? `<span style="color:gold;">★${critVal}</span>` : '';
                    powerSpan.innerHTML = `⚔️${c.dataset.power} ${displayCritical}`;
                }
                sendMoveData(c);
            }
        });
    }

    // --- Game Navigation ---
    function updatePhaseUI(broadcast = true) {
        phaseSteps.forEach((step, index) => {
            step.classList.remove('active', 'passed');
            if (index < currentPhaseIndex) step.classList.add('passed');
            else if (index === currentPhaseIndex) step.classList.add('active');
        });

        const mySide = document.querySelector('.my-side');
        const oppSide = document.querySelector('.opponent-side');

        // Determine if it's my turn
        // Determine if it's my turn: Host starts (Odd turns), Guest follows (Even turns)
        isMyTurn = (currentTurn % 2 !== 0 && isHost) || (currentTurn % 2 === 0 && !isHost);

        // Reset power/critical at the start of ANY turn's stand phase
        if (currentPhaseIndex === 0) { // Stand phase
            resetMyUnits();
            pendingPowerIncrease = 0;
            pendingCriticalIncrease = 0;
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
                hasDrawnThisTurn = false;

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
            }
        }

        if (broadcast) {
            sendData({ type: 'phaseChange', phaseIndex: currentPhaseIndex, isFirstPlayer: isFirstPlayer });
        }
    }

    nextPhaseBtn.addEventListener('click', () => {
        if (currentPhaseIndex < phases.length - 1) {
            currentPhaseIndex++;
            updatePhaseUI(true);
        }
    });

    nextTurnBtn.addEventListener('click', () => {
        currentTurn++;
        currentPhaseIndex = 0;
        hasRiddenThisTurn = false;
        hasDiscardedThisTurn = false;
        updatePhaseUI(false);
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
                    { 'urls': 'stun:stun2.l.google.com:19302' }
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

                    setTimeout(() => {
                        setupConnection();
                        // Sync deck info
                        sendData({ type: 'hostAck', deck: currentDeck === magnoliaDeck ? 'magnolia' : 'bruce' });
                    }, 1000); // 1s effect duration
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
            initGame();
        } else {
            networkInfo.textContent = 'Online (Guest)';
        }

        // Primary game data listener
        conn.on('data', handleIncomingData);
    }

    function sendData(data) {
        if (conn && conn.open) conn.send(data);
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
                if (oppSoulBadge) {
                    if (data.soul > 0) {
                        oppSoulBadge.classList.remove('hidden');
                        oppSoulBadge.textContent = `Soul: ${data.soul}`;
                    } else {
                        oppSoulBadge.classList.add('hidden');
                    }
                }
                break;
            case 'moveCard':
                syncRemoteMove(data);
                break;
            case 'phaseChange':
                currentPhaseIndex = data.phaseIndex;
                isFirstPlayer = !data.isFirstPlayer;
                updatePhaseUI(false);
                break;
            case 'nextTurn':
                currentTurn = data.currentTurn;
                currentPhaseIndex = 0;
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
        }
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

        overlay.innerHTML = `
            <div class="mobile-guard-box" style="width: 90%; max-width: 500px; text-align: center; padding: 2rem; background: rgba(20,20,30,0.8); border: 2px solid var(--accent-vanguard); border-radius: 20px; box-shadow: 0 0 30px rgba(255, 42, 109, 0.4);">
                <h3 style="color: var(--accent-vanguard); font-family: 'Orbitron'; margin-bottom: 10px; font-size: 1.2rem;">INCOMING ATTACK!</h3>
                <h2 style="color: white; font-size: 1.5rem; font-family: 'Orbitron', sans-serif; text-shadow: 0 0 10px #f87171; margin-bottom: 30px;">
                    ${attackData.attackerName} (${attackData.totalPower}) → ${attackData.targetName}
                </h2>
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
            isGuarding = false;
            document.querySelectorAll('.guardian-circle').forEach(gc => gc.classList.remove('zone-highlight'));

            // Calculate Total Shield and PG check
            let totalShieldAdded = 0;
            let isPGActivated = false;
            const gc = document.querySelector('.guardian-circle');
            const guardCards = gc ? gc.querySelectorAll('.card') : [];

            guardCards.forEach(c => {
                totalShieldAdded += parseInt(c.dataset.shield || "0");
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

    function handleGuardDecision(data) {
        const decision = data.decision;
        const attackData = data.attackData;
        const statusText = document.getElementById('game-status-text');
        if (statusText) statusText.textContent = "Network Ready";

        if (decision === 'no-guard') {
            alert("Opponent chose: NO GUARD!");
            if (attackData.isVanguardAttacker) {
                currentAttackData = { ...attackData, opponentShield: 0 };
                const grade = parseInt(attackData.vanguardGrade || "0");
                const checks = grade >= 3 ? 2 : 1;
                driveCheck(checks, attackData.totalCritical);
            } else {
                // Rearguard attack check vs base target power
                const target = document.getElementById('opp-' + attackData.targetId);
                let isHit = false;
                if (target) {
                    isHit = parseInt(attackData.totalPower) >= parseInt(target.dataset.power);
                } else {
                    isHit = true; // Fallback
                }
                sendData({ type: 'resolveAttack', attackData: { ...attackData, isHit: isHit } });
            }
        } else if (decision === 'guard') {
            alert("Opponent chose: GUARD! They are placing defending units now. Await their confirmation.");
        }
    }

    function handleFinishGuard(data) {
        const attackData = data.attackData;
        const totalShield = data.totalShield || 0;
        alert(`Opponent finished placing guards! (+${totalShield} Shield)`);

        currentAttackData = {
            ...attackData,
            opponentShield: totalShield
        };

        if (attackData.isVanguardAttacker) {
            const grade = parseInt(attackData.vanguardGrade || "0");
            const checks = grade >= 3 ? 2 : 1;
            driveCheck(checks, attackData.totalCritical, data.isPG); // Pass PG to driveCheck
        } else {
            // Recalculate Rearguard attack hit immediately
            const attacker = document.getElementById(attackData.attackerId);
            const target = document.getElementById('opp-' + attackData.targetId);
            if (attacker && target) {
                let finalPower = parseInt(attacker.dataset.power) + (attackData.boostPower || 0);
                let targetDefPower = parseInt(target.dataset.power) + (data.totalShield || 0);

                let isHit = finalPower >= targetDefPower;
                if (data.isPG) {
                    alert("Perfect Guard nullified the Rear-guard attack!");
                    isHit = false;
                }

                sendData({ type: 'resolveAttack', attackData: { ...currentAttackData, isHit: isHit, isPG: data.isPG } });
            }
            currentAttackData = null;
        }
    }

    function resolveRemoteAttack(data) {
        const attackData = data.attackData;

        if (attackData.isPG === true || attackData.isHit === false) {
            const reason = attackData.isPG ? "Perfect Guard" : "Power check";
            alert(`Attack failed! (${reason}) Opponent's ${attackData.attackerName} (Power: ${attackData.totalPower}) did not hit your ${attackData.targetName}.`);
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
                    targetCard.classList.remove('effect-retired', 'rest');
                    targetCard.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
                    sendMoveData(targetCard);
                }, 500);
            }
        }
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
            'vc': 'vc',
            'drop-zone': 'drop-zone',
            'damage-zone': 'damage-zone',
            'hand': 'hand'
        };
        const mappedZone = zoneMap[data.zone] || data.zone;
        const targetZone = oppSide.querySelector(`[data-zone="${mappedZone}"]`) ||
            oppSide.querySelector(`.circle.${mappedZone}`) ||
            oppSide.querySelector(`.${mappedZone}`);

        if (targetZone) {
            let cardId = `opp-${data.cardId}`;
            let card = document.getElementById(cardId);

            if (!card) {
                card = createCardElement({
                    name: data.cardName,
                    grade: data.grade,
                    power: data.power,
                    shield: data.shield,
                    critical: data.critical // Sync critical for new cards
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
                        powerSpan.innerHTML = `⚔️${card.dataset.power >= 100000 ? '100M' : card.dataset.power} ${displayCritical}`;
                    }
                }
            }

            // Handle Vanguard replacement
            if (data.zone === 'vc') {
                targetZone.querySelectorAll('.card').forEach(c => c.remove());
            }

            targetZone.appendChild(card);

            // Handle visual orientation
            if (data.isRest) card.classList.add('rest');
            else card.classList.remove('rest');

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
        if (starter) vanguardCircle.appendChild(createCardElement(starter));

        currentDeck.rideDeck.filter(c => c.grade > 0)
            .sort((a, b) => b.grade - a.grade)
            .forEach(c => rideDeckZone.appendChild(createCardElement(c)));

        for (let i = 0; i < 5; i++) drawCard(true);
        updatePhaseUI();
    }

    // --- URL Parameters Orchestration ---
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    const friendId = urlParams.get('friendId');
    const deckChoice = urlParams.get('deck');
    const customId = urlParams.get('customId');

    if (deckChoice === 'magnolia') currentDeck = magnoliaDeck;

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

                conn.on('open', () => {
                    console.log("Connected! Handshaking...");
                    if (gameStatusText) gameStatusText.textContent = 'Handshaking...';

                    const lobbyContent = document.querySelector('.lobby-content');
                    if (lobbyContent) lobbyContent.classList.add('effect-match-found');

                    // Small delay to ensure host is ready for data and play animation
                    setTimeout(() => {
                        sendData({ type: 'guestJoin' });
                        setupConnection();
                        initGame();
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
            const clone = originalCard.cloneNode(true);
            clone.classList.remove('dragging', 'rest', 'opponent-card');
            clone.style.position = 'relative';
            clone.style.transform = 'none';
            clone.style.top = 'auto';
            clone.style.left = 'auto';
            clone.style.margin = '0';
            viewerGrid.appendChild(clone);
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
        el.addEventListener('click', (e) => {
            // TAP TO MOVE EXECUTION
            if (selectedCard) {
                const moved = validateAndMoveCard(selectedCard, el);
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

    closeViewerBtn.addEventListener('click', () => zoneViewer.classList.add('hidden'));
});
