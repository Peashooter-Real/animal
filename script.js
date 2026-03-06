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
    let soulPool = [];

    // --- Multiplayer State ---
    let peer = null;
    let conn = null;
    let isHost = false;

    // --- Deck Definitions ---
    function generateMainDeck(unitPool, triggerPool) {
        let deck = [];
        for (let i = 0; i < 16; i++) {
            deck.push({ ...triggerPool[i % triggerPool.length], id: `trigger-${i}` });
        }
        for (let i = 0; i < 30; i++) {
            deck.push({ ...unitPool[i % unitPool.length], id: `unit-${i}` });
        }
        return deck.sort(() => Math.random() - 0.5);
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
        const counter = document.getElementById('deck-count-num');
        if (counter) counter.textContent = deckPool.length;
    }

    function createCardElement(cardData) {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        card.id = `card-${cardIdCounter++}`;
        card.dataset.grade = cardData.grade;
        card.dataset.power = cardData.power;
        card.dataset.shield = cardData.shield || 0;
        card.dataset.trigger = cardData.trigger || '';
        card.dataset.name = cardData.name;

        const artText = cardData.name.substring(0, 3).toUpperCase();
        let triggerIcon = cardData.trigger ? `<div class="card-trigger bg-${cardData.trigger.toLowerCase()}">${cardData.trigger[0]}</div>` : '';
        let personaIcon = cardData.persona ? `<div class="card-persona">Persona</div>` : '';
        let displayPower = cardData.overPower ? '100M' : cardData.power;

        card.innerHTML = `
            <div class="card-header">
                <span class="card-grade">G${cardData.grade}</span>
                ${triggerIcon}
            </div>
            <div class="card-art">${artText}</div>
            ${personaIcon}
            <div class="card-details">
                <span class="card-power">⚔️${displayPower}</span>
                <span class="card-shield">🛡️${cardData.shield || 0}</span>
            </div>
        `;

        card.title = cardData.name;

        card.addEventListener('dragstart', (e) => {
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
            const currentPhase = phases[currentPhaseIndex];
            if (currentPhase === 'battle') {
                if (!attackingCard) {
                    if (card.parentElement.classList.contains('circle') && !card.classList.contains('rest')) {
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
            cardName: card.dataset.name,
            zone: card.parentElement.dataset.zone,
            isRest: card.classList.contains('rest'),
            grade: card.dataset.grade,
            power: card.dataset.power,
            shield: card.dataset.shield
        });
    }

    function drawCard() {
        if (deckPool.length === 0) {
            alert("Deck out! You lose.");
            return;
        }
        const cardData = deckPool.pop();
        const newCard = createCardElement(cardData);
        playerHand.appendChild(newCard);
        updateHandSpacing();
        updateDeckCounter();
        sendData({ type: 'syncHandCount', count: playerHand.querySelectorAll('.card').length });
    }

    function dealDamage() {
        if (deckPool.length === 0) return;
        const damageZone = document.querySelector('.my-side .damage-zone');
        const cardData = deckPool.pop();
        const cardDom = createCardElement(cardData);
        damageZone.appendChild(cardDom);
        updateDeckCounter();
        sendMoveData(cardDom);
    }

    function driveCheck() {
        if (deckPool.length === 0) return;
        const cardData = deckPool.pop();
        updateDeckCounter();
        const checkCard = createCardElement(cardData);
        checkCard.style.position = 'absolute';
        checkCard.style.top = '50%';
        checkCard.style.left = '50%';
        checkCard.style.transform = 'translate(-50%, -50%) scale(1.5)';
        checkCard.style.zIndex = '9999';
        checkCard.style.boxShadow = '0 0 50px rgba(255, 255, 255, 0.8)';
        document.body.appendChild(checkCard);

        setTimeout(() => {
            checkCard.style.transform = 'none';
            checkCard.style.position = 'relative';
            checkCard.style.top = 'auto';
            checkCard.style.left = 'auto';
            checkCard.style.boxShadow = '';
            playerHand.appendChild(checkCard);
            updateHandSpacing();
            sendData({ type: 'syncHandCount', count: playerHand.querySelectorAll('.card').length });
        }, 1200);
    }

    function performAttack(attacker, target) {
        attacker.classList.add('rest');
        sendMoveData(attacker);

        if (attacker.parentElement.classList.contains('vc')) {
            driveCheck();
        }

        if (target.parentElement.classList.contains('vc')) {
            alert(`${attacker.dataset.name} attacks Vanguard!`);
            dealDamage();
        } else if (target.parentElement.classList.contains('rc')) {
            alert(`${attacker.dataset.name} retired ${target.dataset.name}!`);
            const dropZone = document.querySelector('.my-side .drop-zone');
            dropZone.appendChild(target);
            target.classList.remove('rest');
            target.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            sendMoveData(target);
        }
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
            sendMoveData(draggedCard);
            updateHandCount();
        }
    });

    // --- Game Navigation ---
    function updatePhaseUI() {
        phaseSteps.forEach((step, index) => {
            step.classList.remove('active', 'passed');
            if (index < currentPhaseIndex) step.classList.add('passed');
            else if (index === currentPhaseIndex) step.classList.add('active');
        });

        const mySide = document.querySelector('.my-side');
        const oppSide = document.querySelector('.opponent-side');
        if (isFirstPlayer) {
            mySide.classList.remove('side-disabled');
            oppSide.classList.add('side-disabled');
        } else {
            mySide.classList.add('side-disabled');
            oppSide.classList.remove('side-disabled');
        }

        const currentPhaseName = phases[currentPhaseIndex];
        if (currentPhaseName === 'stand') {
            document.querySelectorAll('.my-side .circle .card.rest').forEach(c => c.classList.remove('rest'));
        } else if (currentPhaseName === 'draw') {
            if (isFirstPlayer) drawCard();
        }

        sendData({ type: 'phaseChange', phaseIndex: currentPhaseIndex, isFirstPlayer: isFirstPlayer });
    }

    nextPhaseBtn.addEventListener('click', () => {
        if (currentPhaseIndex < phases.length - 1) {
            currentPhaseIndex++;
            updatePhaseUI();
        }
    });

    nextTurnBtn.addEventListener('click', () => {
        isFirstPlayer = !isFirstPlayer;
        if (isFirstPlayer) currentTurn++;
        currentPhaseIndex = 0;
        hasRiddenThisTurn = false;
        hasDiscardedThisTurn = false;
        turnIndicator.textContent = `Turn ${currentTurn} (${isFirstPlayer ? 'First Player' : 'Second Player'})`;
        updatePhaseUI();
        sendData({ type: 'nextTurn', currentTurn: currentTurn, isFirstPlayer: isFirstPlayer });
    });

    // --- Multiplayer Logic ---
    function initPeer() {
        console.log("Initializing PeerJS...");
        if (peer && !peer.destroyed) return;
        try {
            peer = new Peer();
        } catch (e) {
            if (gameStatusText) gameStatusText.textContent = "Error: Library not loaded.";
            return;
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

        peer.on('connection', (connection) => {
            console.log("Incoming connection...");
            if (conn) conn.close();
            conn = connection;
            isHost = true;
            setupConnection();
        });

        peer.on('error', (err) => {
            console.error('PeerJS error:', err.type);
            if (gameStatusText) gameStatusText.textContent = `Error: ${err.type}`;
            const dot = document.querySelector('.status-dot');
            if (dot) dot.classList.remove('online');
        });
    }

    function setupConnection() {
        conn.on('open', () => {
            console.log("Connection established!");
            if (gameStatusText) gameStatusText.textContent = 'Rival Connected! Starting...';
            networkInfo.textContent = isHost ? 'Online (Host)' : 'Online (Guest)';
            setTimeout(() => {
                if (matchmakingOverlay) matchmakingOverlay.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                initGame();
            }, 1000);
        });

        conn.on('data', handleIncomingData);
        conn.on('close', () => {
            alert('Lost connection to rival.');
            window.location.href = 'lobby.html';
        });
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
            case 'moveCard':
                syncRemoteMove(data);
                break;
            case 'phaseChange':
                currentPhaseIndex = data.phaseIndex;
                isFirstPlayer = !data.isFirstPlayer;
                updatePhaseUI();
                break;
            case 'nextTurn':
                isFirstPlayer = !data.isFirstPlayer;
                currentTurn = data.currentTurn;
                currentPhaseIndex = 0;
                turnIndicator.textContent = `Turn ${currentTurn} (${isFirstPlayer ? 'First' : 'Second'})`;
                updatePhaseUI();
                break;
        }
    }

    function syncRemoteMove(data) {
        const oppSide = document.querySelector('.opponent-side');
        // Simple mapping for mirroring
        const zoneMap = {
            'rc_front_left': 'rc_front_right',
            'rc_front_right': 'rc_front_left',
            'rc_back_left': 'rc_back_right',
            'rc_back_right': 'rc_back_left',
            'vc': 'vc', 'drop': 'drop', 'damage': 'damage', 'hand': 'hand'
        };
        const mappedZone = zoneMap[data.zone] || data.zone;
        const targetZone = oppSide.querySelector(`[data-zone="${mappedZone}"]`);

        if (targetZone) {
            let cardId = `opp-${data.cardName.replace(/\s/g, '-')}`;
            let card = document.getElementById(cardId);
            if (!card) {
                card = createCardElement({ name: data.cardName, grade: data.grade, power: data.power, shield: data.shield });
                card.id = cardId;
                card.classList.add('opponent-card');
            }
            if (data.zone === 'vc') targetZone.querySelectorAll('.card').forEach(c => c.remove());
            targetZone.appendChild(card);
            if (data.isRest) card.classList.add('rest'); else card.classList.remove('rest');
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

        for (let i = 0; i < 5; i++) drawCard();
        updatePhaseUI();
    }

    // --- URL Parameters Orchestration ---
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    const friendId = urlParams.get('friendId');
    const deckChoice = urlParams.get('deck');

    if (deckChoice === 'magnolia') currentDeck = magnoliaDeck;

    if (role === 'sandbox') {
        if (matchmakingOverlay) matchmakingOverlay.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        networkInfo.textContent = 'Offline (Sandbox)';
        initGame();
    } else if (role === 'host') {
        initPeer();
    } else if (role === 'guest' && friendId) {
        initPeer();
        const checkReady = setInterval(() => {
            if (peer && peer.id) {
                clearInterval(checkReady);
                conn = peer.connect(friendId);
                isHost = false;
                setupConnection();
            }
        }, 200);
    }

    if (copyGameIdBtn) {
        copyGameIdBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(gamePeerIdDisplay.textContent);
            alert('ID Copied!');
        });
    }

    viewDropBtn.addEventListener('click', () => {
        const cards = document.querySelectorAll('.my-side .drop-zone .card');
        openViewer('Drop Zone', Array.from(cards));
    });
    closeViewerBtn.addEventListener('click', () => zoneViewer.classList.add('hidden'));
});
