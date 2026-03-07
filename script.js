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
    const dropCountNum = document.getElementById('drop-count-num');
    const viewDropBtn = document.getElementById('view-drop-btn');
    const zoneViewer = document.getElementById('zone-viewer');
    const viewerTitle = document.getElementById('viewer-title');
    const viewerGrid = document.getElementById('viewer-grid');
    const closeViewerBtn = document.getElementById('close-viewer-btn');

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
    let pendingDamageChecks = 0; // Queue damage until drive checks finish
    let currentAttackData = null; // Store for recalculation after buffs
    // Track if it's currently my turn

    // --- Deck Definitions ---
    function generateMainDeck(unitPool, triggerPool) {
        let deck = [];
        for (let i = 0; i < 16; i++) {
            deck.push({ ...triggerPool[i % triggerPool.length], id: `trigger-${i}` });
        }
        for (let i = 0; i < 30; i++) {
            deck.push({ ...unitPool[i % unitPool.length], id: `unit-${i}` });
        }
        // Use a consistent shuffle if needed, but for now we just ensure it exists
        return deck.sort(() => 0.5 - Math.random());
    }

    const bruceDeck = {
        rideDeck: [
            { name: 'Diabolos, "Innocent" Matt', grade: 0, power: 6000, shield: 10000 },
            { name: 'Diabolos, "Bad" Steve', grade: 1, power: 8000, shield: 5000 },
            { name: 'Diabolos, "Anger" Richard', grade: 2, power: 10000, shield: 5000 },
            { name: 'Diabolos, "Violence" Bruce', grade: 3, power: 13000, persona: true }
        ],
        mainDeck: generateMainDeck(
            [
                { name: 'Diabolos Boys, Eden', grade: 2, power: 10000, shield: 5000 },
                { name: 'Diabolos Madonna, Mabel', grade: 1, power: 8000, shield: 5000 },
                { name: 'Diabolos Girls, Stefanie', grade: 1, power: 8000, shield: 10000 }
            ],
            [
                { name: 'Hades Dragon Deity, Gallmageveld', grade: 0, power: 5000, shield: 50000, trigger: 'Over', overPower: '100 Million' },
                { name: 'Critical Trigger', grade: 0, power: 5000, shield: 15000, trigger: 'Critical' },
                { name: 'Heal Trigger', grade: 0, power: 5000, shield: 15000, trigger: 'Heal' },
                { name: 'Front Trigger', grade: 0, power: 5000, shield: 15000, trigger: 'Front' }
            ]
        )
    };

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
                { name: 'Critical Trigger', grade: 0, power: 5000, shield: 15000, trigger: 'Critical' },
                { name: 'Draw Trigger', grade: 0, power: 5000, shield: 5000, trigger: 'Draw' },
                { name: 'Heal Trigger', grade: 0, power: 5000, shield: 15000, trigger: 'Heal' }
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
    }

    function updateDropCount() {
        const count = document.querySelectorAll('.player-side.my-side .drop-zone .card').length;
        if (dropCountNum) dropCountNum.textContent = count;
    }

    function updateDeckCounter() {
        const deckNum = document.getElementById('deck-count-num');
        const count = deckPool.length;
        if (deckNum) deckNum.textContent = count;

        // Visual thickness effect
        const deckZones = document.querySelectorAll('.deck-zone');
        deckZones.forEach(zone => {
            const shadowSize = Math.ceil(count / 5); // 1px shadow per 5 cards
            let shadowStr = "";
            for (let i = 1; i <= shadowSize; i++) {
                shadowStr += `0 ${i * 2}px 0 ${i % 2 === 0 ? '#111' : '#222'}${i === shadowSize ? '' : ','}`;
            }
            zone.style.boxShadow = shadowStr || 'none';
        });
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

        card.innerHTML = `
            <div class="card-header">
                <span class="card-grade">G${cardData.grade}</span>
                ${triggerIcon}
            </div>
            <div class="card-art">${artText}</div>
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
                    e.preventDefault();
                    return;
                }
            }
            if (card.parentElement.classList.contains('drop-zone')) {
                e.preventDefault();
                return;
            }
            draggedCard = card;
            setTimeout(() => card.classList.add('dragging'), 0);
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', card.id);
        });

        card.addEventListener('dragend', () => {
            if (draggedCard) draggedCard.classList.remove('dragging');
            draggedCard = null;
            updateHandSpacing();
        });

        card.addEventListener('click', (e) => {
            if (pendingPowerIncrease > 0) {
                if (card.parentElement.classList.contains('circle') && !card.classList.contains('opponent-card')) {
                    let currentPower = parseInt(card.dataset.power);
                    let currentCrit = parseInt(card.dataset.critical);

                    card.dataset.power = currentPower + pendingPowerIncrease;
                    card.dataset.critical = currentCrit + pendingCriticalIncrease;

                    const powerSpan = card.querySelector('.card-power');
                    if (powerSpan) {
                        let displayCritical = parseInt(card.dataset.critical) > 1 ? `<span style="color:gold;">★${card.dataset.critical}</span>` : '';
                        powerSpan.innerHTML = `⚔️${card.dataset.power >= 100000 ? '100M' : card.dataset.power} ${displayCritical}`;
                    }

                    sendMoveData(card);
                    alert(`Effects applied to ${card.dataset.name}!`);

                    pendingPowerIncrease = 0;
                    pendingCriticalIncrease = 0;
                    document.body.classList.remove('targeting-mode');
                } else if (card.classList.contains('opponent-card')) {
                    alert("You must select your own unit!");
                }
                return;
            }

            if (!isMyTurn) return; // Strict turn check

            const currentPhase = phases[currentPhaseIndex];
            if (currentPhase === 'battle') {
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
            if (card.parentElement.classList.contains('circle')) {
                card.classList.toggle('rest');
                sendMoveData(card);
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

    function driveCheck(checksLeft = 1, initialCritical = 1) {
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
                updateHandSpacing();
                sendData({ type: 'syncHandCount', count: playerHand.querySelectorAll('.card').length });

                if (checksLeft > 1) {
                    setTimeout(() => driveCheck(checksLeft - 1, initialCritical), 800);
                } else {
                    // ALL DRIVE CHECKS COMPLETE - Now resolve the hit
                    setTimeout(() => {
                        resolveFinalAttack(initialCritical);
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

    function resolveFinalAttack() {
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
        let targetPower = parseInt(target.dataset.power);

        const isHit = finalPower >= targetPower;

        if (!isHit) {
            alert(`Attack missed! ${finalPower} Power is not enough to hit ${targetPower} Power.`);
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

        currentAttackData = null;
        pendingCriticalIncrease = 0;
    }

    function resolveTrigger(cardData, isDamageCheck = false) {
        let triggerType = cardData.trigger;
        let powerIncrease = triggerType === 'Over' ? 100000000 : 10000;

        alert(`Trigger! ${triggerType} effect activating...`);

        if (triggerType === 'Draw') {
            if (!isDamageCheck) drawCard(true); // Draw unconditionally only if it's drive check
        } else if (triggerType === 'Heal') {
            const myDamage = document.querySelectorAll('.my-side .damage-zone .card').length;
            const oppDamage = parseInt(document.getElementById('opp-damage-count')?.textContent || "0");

            if (myDamage > 0 && myDamage >= oppDamage) {
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

        if (triggerType === 'Critical') {
            pendingCriticalIncrease++;
        }

        pendingPowerIncrease += powerIncrease;
        document.body.classList.add('targeting-mode');
        // Mobile users might need an extra hint
        let msg = `Trigger! Select a unit TO RECEIVE +${powerIncrease >= 100000 ? '100Million' : powerIncrease} Power`;
        if (triggerType === 'Critical') msg += ' and +1 Critical';
        alert(msg);
    }

    function performAttack(attacker, target) {
        if (!target.classList.contains('opponent-card') && !confirm("Attack your own card?")) {
            return;
        }

        let targetId = target.id;
        if (targetId.startsWith('opp-')) targetId = targetId.substring(4);

        if (!confirm(`Attack ${target.dataset.name} with ${attacker.dataset.name}?`)) {
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

    // --- Interaction Setup ---
    boardAreas.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
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
            if (!isMyTurn && !isGuarding) return;

            if (isGuarding) {
                if (zone.dataset.zone !== 'gc_player') {
                    alert("During Guard Step, you can only drop cards onto your Guardian Circle (GC)!");
                    return;
                }
                zone.appendChild(draggedCard);
                draggedCard.classList.remove('rest');
                draggedCard.style.transform = 'none';
                sendMoveData(draggedCard);
                updateHandCount();
                updateDropCount();
                return;
            }

            const currentPhase = phases[currentPhaseIndex];

            // Validation Logic
            if (zone.classList.contains('circle')) {
                const cardGrade = parseInt(draggedCard.dataset.grade);
                const vanguard = document.querySelector('.my-side .circle.vc .card');
                const vanguardGrade = vanguard ? parseInt(vanguard.dataset.grade) : 0;

                if (zone.classList.contains('vc')) {
                    if (currentPhase !== 'ride') { alert("Only Ride during Ride Phase!"); return; }
                    if (hasRiddenThisTurn) { alert("Only Ride once per turn!"); return; }
                    if (cardGrade !== vanguardGrade + 1 && !(cardGrade === 3 && vanguardGrade === 3)) {
                        alert(`Cannot Ride Grade ${cardGrade} over ${vanguardGrade}!`);
                        return;
                    }
                    if (draggedCard.parentElement.id === 'ride-deck' && !hasDiscardedThisTurn) {
                        alert("Must discard 1 for Ride from Ride Deck!");
                        return;
                    }
                    if (vanguard) {
                        soulPool.push(vanguard);
                        vanguard.remove();
                        updateSoulUI();
                    }
                    hasRiddenThisTurn = true;
                } else if (zone.classList.contains('rc')) {
                    if (currentPhase !== 'main') { alert("Only Call during Main Phase!"); return; }
                    if (cardGrade > vanguardGrade) {
                        alert(`Cannot Call Grade ${cardGrade} (VG is G${vanguardGrade})!`);
                        return;
                    }
                }
            }

            if (zone.classList.contains('drop-zone')) {
                if (currentPhase === 'ride' && !hasDiscardedThisTurn) hasDiscardedThisTurn = true;
                draggedCard.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            } else {
                draggedCard.style.transform = 'none';
            }

            zone.appendChild(draggedCard);
            draggedCard.classList.remove('rest');

            // Add drop impact animation
            draggedCard.classList.add('effect-drop');
            setTimeout(() => draggedCard.classList.remove('effect-drop'), 400);

            sendMoveData(draggedCard);
            updateHandCount();
            updateDropCount();
        });
    });

    playerHand.addEventListener('dragover', e => e.preventDefault());
    playerHand.addEventListener('drop', e => {
        e.preventDefault();
        if (draggedCard) {
            playerHand.appendChild(draggedCard);
            draggedCard.classList.remove('rest');
            draggedCard.style.transform = 'none';

            // Catch-all drop effect for hand
            draggedCard.classList.add('effect-drop');
            setTimeout(() => draggedCard.classList.remove('effect-drop'), 400);

            sendMoveData(draggedCard);
            updateHandCount();
        }
    });

    function resetMyUnits() {
        document.querySelectorAll('.my-side .circle .card:not(.opponent-card)').forEach(c => {
            let changed = false;
            if (c.dataset.basePower && c.dataset.power !== c.dataset.basePower) {
                c.dataset.power = c.dataset.basePower;
                changed = true;
            }
            if (c.dataset.baseCritical && c.dataset.critical !== c.dataset.baseCritical) {
                c.dataset.critical = c.dataset.baseCritical;
                changed = true;
            }

            if (changed) {
                const powerSpan = c.querySelector('.card-power');
                if (powerSpan) {
                    let displayCritical = parseInt(c.dataset.critical) > 1 ? `<span style="color:gold;">★${c.dataset.critical}</span>` : '';
                    powerSpan.innerHTML = `⚔️${c.dataset.basePower} ${displayCritical}`;
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
        isMyTurn = isFirstPlayer;

        // Reset power/critical at the start of ANY turn's stand phase
        if (currentPhaseIndex === 0) { // Stand phase
            resetMyUnits();
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
        isFirstPlayer = !isFirstPlayer;
        if (isFirstPlayer) currentTurn++;
        currentPhaseIndex = 0;
        hasRiddenThisTurn = false;
        hasDiscardedThisTurn = false;
        turnIndicator.textContent = `Turn ${currentTurn} (${isFirstPlayer ? 'First Player' : 'Second Player'})`;
        updatePhaseUI(false);
        sendData({ type: 'nextTurn', currentTurn: currentTurn, isFirstPlayer: isFirstPlayer });
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
            case 'syncHandCount':
                const oppHandCount = document.getElementById('opp-hand-count');
                if (oppHandCount) oppHandCount.textContent = data.count;
                break;
            case 'syncDamageCount':
                let oppDamageCount = document.getElementById('opp-damage-count');
                if (!oppDamageCount) {
                    oppDamageCount = document.createElement('span');
                    oppDamageCount.id = 'opp-damage-count';
                    oppDamageCount.style.display = 'none';
                    document.body.appendChild(oppDamageCount);
                }
                oppDamageCount.textContent = data.count;
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
                isFirstPlayer = !data.isFirstPlayer;
                currentTurn = data.currentTurn;
                currentPhaseIndex = 0;
                turnIndicator.textContent = `Turn ${currentTurn} (${isFirstPlayer ? 'First' : 'Second'})`;
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
            overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
            document.body.appendChild(overlay);
        }

        overlay.innerHTML = `
            <h2 style="color: white; font-size: 2rem; font-family: 'Orbitron', sans-serif; text-shadow: 0 0 10px #f87171; text-align: center; margin-bottom: 30px;">
                Opponent's ${attackData.attackerName} (Power: ${attackData.totalPower}, Critical: ${attackData.totalCritical}) attacks your ${attackData.targetName}!
            </h2>
            <div style="display: flex; gap: 20px;">
                <button id="btn-guard" class="btn" style="padding: 15px 30px; font-size: 1.2rem; background: #60a5fa; cursor: pointer;">Guard</button>
                <button id="btn-no-guard" class="btn" style="padding: 15px 30px; font-size: 1.2rem; background: #f87171; cursor: pointer;">No Guard (Take it)</button>
            </div>
        `;

        document.getElementById('btn-guard').addEventListener('click', () => {
            overlay.style.display = 'none';
            isGuarding = true;
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
        btn.textContent = "Finish Guarding";
        btn.className = "btn glass-btn highlight-btn";
        btn.style.position = "fixed";
        btn.style.bottom = "20px";
        btn.style.right = "20px";
        btn.style.zIndex = "1000";
        btn.style.padding = "15px 30px";
        btn.style.fontSize = "1.2rem";

        btn.onclick = () => {
            isGuarding = false;
            btn.remove();
            sendData({ type: 'finishGuard', attackData: attackData });

            // Return guards to drop zone immediately
            document.querySelectorAll('.my-side .guardian-circle .card').forEach(c => {
                document.querySelector('.my-side .drop-zone').appendChild(c);
                c.classList.remove('rest');
                c.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
                sendMoveData(c);
            });
            updateDropCount();
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
                currentAttackData = attackData; // Store to resolve after drive checks
                const grade = parseInt(attackData.vanguardGrade || "0");
                const checks = grade >= 3 ? 2 : 1;
                driveCheck(checks, attackData.totalCritical);
            } else {
                sendData({ type: 'resolveAttack', attackData: attackData });
            }
        } else if (decision === 'guard') {
            alert("Opponent chose: GUARD! They are placing defending units now. Await their confirmation.");
        }
    }

    function handleFinishGuard(data) {
        const attackData = data.attackData;
        alert("Opponent finished placing guards!");
        if (attackData.isVanguardAttacker) {
            currentAttackData = attackData;
            const grade = parseInt(attackData.vanguardGrade || "0");
            const checks = grade >= 3 ? 2 : 1;
            driveCheck(checks, attackData.totalCritical);
        }
    }

    function resolveRemoteAttack(data) {
        const attackData = data.attackData;

        if (attackData.isHit === false) {
            alert(`Attack failed! Opponent's ${attackData.attackerName} (Power: ${attackData.totalPower}) did not reach your ${attackData.targetName}'s power.`);
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

    viewDropBtn.addEventListener('click', () => {
        const cards = document.querySelectorAll('.my-side .drop-zone .card');
        openViewer('Drop Zone', Array.from(cards));
    });
    closeViewerBtn.addEventListener('click', () => zoneViewer.classList.add('hidden'));
});
