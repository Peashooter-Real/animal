document.addEventListener('DOMContentLoaded', () => {
    const deckCards = document.querySelectorAll('.deck-card');
    const createRoomBtn = document.getElementById('create-room-btn');
    const joinGameBtn = document.getElementById('join-game-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const joinPeerIdInput = document.getElementById('join-peer-id-input');

    let selectedDeck = 'bruce';

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

    const copyBtn = document.getElementById('copy-my-id-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const idText = document.getElementById('my-peer-id').textContent;
            navigator.clipboard.writeText(idText);

            const originalText = copyBtn.textContent;
            copyBtn.textContent = "✅";
            setTimeout(() => copyBtn.textContent = originalText, 2000);
        });
    }

    const joinStatus = document.getElementById('join-status');
    let lobbyPeer = null;

    function initLobbyPeer(callback) {
        if (lobbyPeer && lobbyPeer.open) {
            callback();
            return;
        }

        console.log("Initializing Lobby Peer for room check...");
        lobbyPeer = new Peer();

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
            const checkConn = lobbyPeer.connect(friendId);

            let found = false;
            const timeout = setTimeout(() => {
                if (!found) {
                    checkConn.close();
                    onRoomNotFound();
                }
            }, 6000);

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

});
