document.addEventListener('DOMContentLoaded', () => {
    const nationSelectionScreen = document.getElementById('nation-selection-screen');
    const deckSelectionScreen = document.getElementById('deck-selection-screen');
    const backToNationsBtn = document.getElementById('back-to-nations');
    const nationCards = document.querySelectorAll('.nation-card');
    const deckCards = document.querySelectorAll('#deck-cards-container .deck-card');

    const createRoomBtn = document.getElementById('create-room-btn');
    const joinGameBtn = document.getElementById('join-game-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const joinPeerIdInput = document.getElementById('join-peer-id-input');

    let selectedDeck = 'bruce';

    // Nation Selection
    nationCards.forEach(card => {
        card.addEventListener('click', () => {
            nationCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const selectedNation = card.dataset.nation;
            
            // Show only the decks for this nation
            deckCards.forEach(deckCard => {
                if(deckCard.dataset.nation === selectedNation) {
                    deckCard.style.display = 'block';
                } else {
                    deckCard.style.display = 'none';
                }
            });

            // First available deck becomes active
            let firstFound = null;
            deckCards.forEach(dc => dc.classList.remove('active'));
            for(let i=0; i<deckCards.length; i++) {
                if(deckCards[i].dataset.nation === selectedNation) {
                    firstFound = deckCards[i];
                    break;
                }
            }
            
            if(firstFound) {
                firstFound.classList.add('active');
                selectedDeck = firstFound.dataset.deck;
            }

            // Sub-screen switch
            nationSelectionScreen.classList.add('hidden');
            deckSelectionScreen.classList.remove('hidden');
        });
    });

    backToNationsBtn.addEventListener('click', () => {
        deckSelectionScreen.classList.add('hidden');
        nationSelectionScreen.classList.remove('hidden');
    });

    // Deck Selection
    deckCards.forEach(card => {
        card.addEventListener('click', () => {
            deckCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedDeck = card.dataset.deck;
            console.log("Selected Deck:", selectedDeck);
        });
    });

    let generatedId = null;

    // Helper: Generate random ID
    function generateUUID() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // Host Action
    createRoomBtn.addEventListener('click', () => {
        if (!generatedId) {
            generatedId = generateUUID();
            const idDisplay = document.getElementById('my-id-container');
            const idText = document.getElementById('my-peer-id');
            idText.textContent = generatedId;
            idDisplay.classList.remove('hidden');
            idDisplay.classList.add('fade-in');

            createRoomBtn.textContent = "Enter Arena as Host";
            createRoomBtn.classList.add('ready-btn');
        } else {
            // Redirect to game as host with the generated ID
            window.location.href = `index.html?role=host&deck=${selectedDeck}&customId=${generatedId}`;
        }
    });

    window.alert = function (msg) {
        const box = document.createElement('div');
        box.className = 'vanguard-alert-box fade-in';
        box.style.position = 'fixed';
        box.style.top = '50%';
        box.style.left = '50%';
        box.style.transform = 'translate(-50%, -50%)';
        box.style.background = 'rgba(15, 15, 25, 0.95)';
        box.style.border = '2px solid #ff2a6d';
        box.style.padding = '20px';
        box.style.borderRadius = '15px';
        box.style.boxShadow = '0 0 30px rgba(255, 42, 109, 0.5)';
        box.style.color = '#fff';
        box.style.zIndex = '99999';
        box.style.textAlign = 'center';

        box.innerHTML = `
            <div class="vanguard-alert-content" style="text-align: center;">
                <h3 style="color:#ff2a6d; margin-bottom:10px; font-family:'Orbitron', sans-serif; text-shadow:0 0 5px #ff2a6d;">SYSTEM NOTICE</h3>
                <p style="color: white; font-size: 1.1rem; font-family: sans-serif;">${msg}</p>
            </div>
        `;
        document.body.appendChild(box);
        setTimeout(() => {
            box.style.opacity = '0';
            box.style.transition = 'opacity 0.5s';
            setTimeout(() => box.remove(), 500);
        }, 2000);
    };

    const copyBtn = document.getElementById('copy-my-id-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const id = document.getElementById('my-peer-id').textContent;
            navigator.clipboard.writeText(id).then(() => {
                copyBtn.textContent = "✅";
                setTimeout(() => copyBtn.textContent = "📋", 2000);
                alert('Copied ID: ' + id);
            }).catch(() => {
                alert('Gonna need manual copy.');
            });
        });
    }

    const joinStatus = document.getElementById('join-status');
    let lobbyPeer = null;

    function initLobbyPeer(callback) {
        if (lobbyPeer && lobbyPeer.open) {
            callback();
            return;
        }

        console.log("Initializing Lobby Peer for room check with STUN...");
        const lobbyPeerOptions = {
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
        lobbyPeer = new Peer(lobbyPeerOptions);

        lobbyPeer.on('open', () => {
            console.log("Lobby Peer ID:", lobbyPeer.id);
            callback();
        });

        lobbyPeer.on('error', (err) => {
            console.error("Lobby Peer Error:", err.type);
            if (err.type === 'peer-unavailable') {
                onRoomNotFound();
            } else {
                joinStatus.textContent = "⚠️ Connection Error. Please refresh.";
            }
        });
    }

    // Join Action
    joinGameBtn.addEventListener('click', () => {
        const friendId = joinPeerIdInput.value.trim().toUpperCase();
        if (!friendId) {
            joinStatus.textContent = "❌ Please enter a Friend's ID!";
            joinStatus.className = "join-status-msg status-not-found";
            return;
        }

        joinGameBtn.disabled = true;
        joinGameBtn.textContent = "🔍 Searching...";
        joinStatus.textContent = `🔍 Looking for room: ${friendId}...`;
        joinStatus.className = "join-status-msg status-searching";

        initLobbyPeer(() => {
            console.log("Attempting to connect to:", friendId);
            const checkConn = lobbyPeer.connect(friendId, { reliable: true });

            let found = false;
            const timeout = setTimeout(() => {
                if (!found) {
                    checkConn.close();
                    onRoomNotFound();
                }
            }, 15000); // Increase to 15s for mobile networks

            checkConn.on('open', () => {
                found = true;
                clearTimeout(timeout);
                console.log("Room found!");
                // Keep connection open for a split second to ensure data-transfer could happen if needed, then close and move
                setTimeout(() => {
                    checkConn.close();
                    onRoomFound(friendId);
                }, 500);
            });

            checkConn.on('error', (err) => {
                found = true;
                clearTimeout(timeout);
                onRoomNotFound();
            });
        });
    });

    function onRoomNotFound() {
        joinGameBtn.disabled = false;
        joinGameBtn.textContent = "Join Game";
        joinStatus.innerHTML = `❌ <strong>Room Not Found.</strong><br>Ask your friend to click "Enter Arena" first!`;
        joinStatus.className = "join-status-msg status-not-found";

        // Reset Peer to clear errors
        if (lobbyPeer) {
            lobbyPeer.destroy();
            lobbyPeer = null;
        }
    }

    function onRoomFound(id) {
        joinStatus.textContent = "✅ Room active! Connecting to Arena...";
        joinStatus.className = "join-status-msg status-ready";

        setTimeout(() => {
            window.location.href = `index.html?role=guest&friendId=${id}&deck=${selectedDeck}`;
        }, 500);
    }

    // --- Mobile/URL Join Support ---
    const urlJoinId = new URLSearchParams(window.location.search).get('id');
    if (urlJoinId) {
        joinPeerIdInput.value = urlJoinId.toUpperCase();
        // Give UI a moment to settle then auto-join
        setTimeout(() => joinGameBtn.click(), 800);
    }
});
