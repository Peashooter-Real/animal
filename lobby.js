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

    function initLobbyPeer() {
        if (!lobbyPeer) {
            lobbyPeer = new Peer();
            lobbyPeer.on('error', (err) => {
                console.warn("Lobby Peer Error:", err.type);
            });
        }
    }

    // Join Action
    joinGameBtn.addEventListener('click', () => {
        const friendId = joinPeerIdInput.value.trim().toUpperCase();
        if (!friendId) {
            joinStatus.textContent = "❌ Please enter a Friend's ID!";
            joinStatus.className = "join-status-msg status-not-found";
            return;
        }

        initLobbyPeer();

        joinGameBtn.disabled = true;
        joinGameBtn.textContent = "Checking Room...";
        joinStatus.textContent = "🔍 Searching for room...";
        joinStatus.className = "join-status-msg status-searching";

        // Attempt connection to verify existence
        const checkConn = lobbyPeer.connect(friendId);

        const timeout = setTimeout(() => {
            checkConn.close();
            onRoomNotFound();
        }, 5000);

        checkConn.on('open', () => {
            clearTimeout(timeout);
            checkConn.close();
            onRoomFound(friendId);
        });

        checkConn.on('error', (err) => {
            clearTimeout(timeout);
            onRoomNotFound();
        });
    });

    function onRoomNotFound() {
        joinGameBtn.disabled = false;
        joinGameBtn.textContent = "Join Game";
        joinStatus.textContent = "❌ Room not found. Make sure your friend is in the arena!";
        joinStatus.className = "join-status-msg status-not-found";
    }

    function onRoomFound(id) {
        joinStatus.textContent = "✅ Room found! Connecting...";
        joinStatus.className = "join-status-msg status-ready";

        setTimeout(() => {
            window.location.href = `index.html?role=guest&friendId=${id}&deck=${selectedDeck}`;
        }, 800);
    }

    // Sandbox Action
    startGameBtn.addEventListener('click', () => {
        startGameBtn.textContent = "Loading Arena...";
        setTimeout(() => {
            window.location.href = `index.html?role=sandbox&deck=${selectedDeck}`;
        }, 500);
    });
});
