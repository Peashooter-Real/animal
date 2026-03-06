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

    // Host Action
    createRoomBtn.addEventListener('click', () => {
        // Redirect to game as host
        window.location.href = `index.html?role=host&deck=${selectedDeck}`;
    });

    // Join Action
    joinGameBtn.addEventListener('click', () => {
        const friendId = joinPeerIdInput.value.trim();
        if (!friendId) {
            alert("Please enter a Friend's ID!");
            return;
        }
        window.location.href = `index.html?role=guest&friendId=${friendId}&deck=${selectedDeck}`;
    });

    // Sandbox Action
    startGameBtn.addEventListener('click', () => {
        window.location.href = `index.html?role=sandbox&deck=${selectedDeck}`;
    });
});
