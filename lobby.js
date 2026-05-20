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

    // Helper: Generate random numeric ID (6 digits)
    function generateUUID() {
        return Math.floor(100000 + Math.random() * 900000).toString();
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
            window.location.href = `game.html?role=host&deck=${selectedDeck}&customId=${generatedId}`;
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
            window.location.href = `game.html?role=guest&friendId=${id}&deck=${selectedDeck}`;
        }, 500);
    }

    // --- Mobile/URL Join Support ---
    const urlJoinId = new URLSearchParams(window.location.search).get('id');
    if (urlJoinId) {
        joinPeerIdInput.value = urlJoinId.toUpperCase();
        // Give UI a moment to settle then auto-join
        setTimeout(() => joinGameBtn.click(), 800);
    }

    // ==========================================
    // DECK BUILDER FUNCTIONALITY
    // ==========================================

    const DEFAULT_DECK_IDS = {
        bruce: {
            rideDeck: ["ds_starter_matt", "ds_steve", "ds_richard", "ds_bruce_g3"],
            mainDeck: [
                ...Array(3).fill("ds_bruce_g3"),
                ...Array(3).fill("ds_julian"),
                ...Array(4).fill("ds_megan"),
                ...Array(4).fill("ds_eden"),
                ...Array(3).fill("ds_jamil"),
                ...Array(4).fill("ds_pg"),
                ...Array(4).fill("ds_stefanie"),
                ...Array(3).fill("ds_mabel"),
                ...Array(2).fill("ds_ivanka"),
                ...Array(8).fill("ds_trig_crit"),
                ...Array(2).fill("ds_trig_draw"),
                ...Array(1).fill("ds_trig_front"),
                ...Array(4).fill("ds_trig_heal"),
                "ds_trig_over"
            ]
        },
        greedon: {
            rideDeck: ["ds_taida", "ds_gouman", "ds_boshokku", "ds_greedon"],
            mainDeck: [
                ...Array(4).fill("ds_greedon_masques"),
                ...Array(2).fill("generic_masque"),
                ...Array(3).fill("ds_mousheen"),
                ...Array(2).fill("ds_clean_sweep"),
                ...Array(3).fill("ds_chemdah"),
                ...Array(3).fill("ds_saasyou"),
                ...Array(3).fill("ds_boshokku"),
                ...Array(4).fill("ds_fuujo"),
                ...Array(2).fill("ds_xitto"),
                ...Array(4).fill("ds_pg"),
                ...Array(8).fill("ds_trig_crit"),
                ...Array(3).fill("ds_trig_draw"),
                ...Array(4).fill("ds_trig_heal"),
                "ds_trig_over"
            ]
        },
        magnolia: {
            rideDeck: ["st_lotte", "st_charis", "st_lattice", "st_magnolia_king"],
            mainDeck: [
                ...Array(4).fill("st_magnolia_elder"),
                ...Array(3).fill("st_inlet_pulse"),
                ...Array(2).fill("st_winnsapooh"),
                ...Array(1).fill("st_bojalcorn"),
                ...Array(1).fill("st_gabregg"),
                ...Array(3).fill("st_giunosla"),
                ...Array(3).fill("st_enpix"),
                ...Array(2).fill("st_goildoat"),
                ...Array(1).fill("st_alpin"),
                ...Array(4).fill("st_order_condensation"),
                ...Array(2).fill("st_order_frozen"),
                ...Array(4).fill("st_pg"),
                ...Array(8).fill("st_trig_crit"),
                ...Array(3).fill("st_trig_front"),
                ...Array(4).fill("st_trig_heal"),
                "st_trig_over"
            ]
        },
        zorga: {
            rideDeck: ["st_lotte", "st_charis", "st_charis_blacktears", "st_zorga_g3"],
            mainDeck: [
                ...Array(4).fill("st_zorga_masques"),
                ...Array(3).fill("st_roaming_dragon"),
                ...Array(2).fill("st_order_miasma"),
                ...Array(2).fill("generic_masque"),
                ...Array(3).fill("st_shadowcloak"),
                ...Array(1).fill("st_order_wandering"),
                ...Array(1).fill("st_order_sin"),
                ...Array(3).fill("st_chemdah"),
                ...Array(1).fill("st_order_malice"),
                ...Array(1).fill("st_keel"),
                ...Array(4).fill("st_pg"),
                ...Array(2).fill("st_headhunter"),
                ...Array(2).fill("st_order_frozen"),
                ...Array(1).fill("st_bist"),
                ...Array(8).fill("st_trig_crit"),
                ...Array(3).fill("st_trig_draw"),
                ...Array(4).fill("st_trig_heal"),
                "st_trig_over"
            ]
        },
        nirvana: {
            rideDeck: ["de_egg", "de_rino", "de_reiyu", "de_jheva"],
            mainDeck: [
                ...Array(4).fill("de_trickstar"),
                ...Array(4).fill("de_pg_sparkle"),
                ...Array(3).fill("de_graillumirror"),
                ...Array(3).fill("de_stragallio"),
                ...Array(3).fill("de_galondight"),
                ...Array(4).fill("de_mirrors"),
                ...Array(2).fill("de_garou"),
                ...Array(1).fill("de_baur"),
                ...Array(2).fill("de_arcs"),
                ...Array(3).fill("de_jheva"),
                ...Array(7).fill("de_trig_crit"),
                ...Array(4).fill("de_trig_draw"),
                ...Array(4).fill("de_trig_heal"),
                "de_trig_over"
            ]
        },
        overlord: {
            rideDeck: ["de_undeux", "de_bahr", "de_nehalem", "de_dote"],
            mainDeck: [
                ...Array(3).fill("de_dote"),
                ...Array(3).fill("de_overlord"),
                "de_order_gratias",
                ...Array(2).fill("de_nehalem"),
                ...Array(3).fill("de_brachioforce"),
                ...Array(4).fill("de_burning_horn"),
                ...Array(4).fill("de_ardor_hatchet"),
                ...Array(4).fill("de_halbe"),
                ...Array(2).fill("de_gojo"),
                ...Array(4).fill("de_pg_sparkle"),
                ...Array(8).fill("de_trig_crit"),
                ...Array(3).fill("de_trig_draw"),
                ...Array(4).fill("de_trig_heal"),
                "de_trig_over"
            ]
        },
        majesty: {
            rideDeck: ["ks_starter_wingul", "ks_maron", "ks_blaster_blade", "ks_majesty"],
            mainDeck: [
                ...Array(3).fill("ks_majesty"),
                ...Array(3).fill("ks_blaster_blade"),
                ...Array(4).fill("ks_blaster_dark"),
                ...Array(4).fill("ks_emmeline"),
                ...Array(4).fill("ks_pg"),
                ...Array(4).fill("ks_ordeal"),
                ...Array(4).fill("ks_cordiela"),
                ...Array(2).fill("ks_painkiller"),
                ...Array(2).fill("ks_order_dawn"),
                ...Array(8).fill("ks_trig_crit"),
                ...Array(3).fill("ks_trig_front"),
                ...Array(4).fill("ks_trig_heal"),
                "ks_trig_over"
            ]
        },
        youthberk: {
            rideDeck: ["ks_youth_starter", "ks_youth_g1", "ks_youth_g2", "ks_youthberk"],
            mainDeck: [
                ...Array(3).fill("ks_youthberk"),
                ...Array(4).fill("ks_revolform_tempest"),
                ...Array(3).fill("ks_revolform_gust"),
                ...Array(3).fill("ks_schneizal"),
                ...Array(3).fill("ks_dolbraig"),
                ...Array(2).fill("ks_cairbre"),
                ...Array(4).fill("ks_sequana"),
                ...Array(4).fill("ks_therapy_angel"),
                ...Array(4).fill("ks_pg"),
                ...Array(8).fill("ks_trig_crit"),
                ...Array(3).fill("ks_trig_front"),
                ...Array(4).fill("ks_trig_heal"),
                "ks_trig_over"
            ]
        },
        avantgarda: {
            rideDeck: ["bg_sora", "bg_findanis", "bg_stelvane", "bg_avant_g3"],
            mainDeck: [
                ...Array(4).fill("bg_richter"),
                ...Array(3).fill("bg_avant_g3"),
                ...Array(3).fill("bg_winds"),
                ...Array(4).fill("bg_dargente"),
                ...Array(3).fill("bg_habitable"),
                ...Array(1).fill("bg_dusting"),
                ...Array(4).fill("bg_pg"),
                ...Array(3).fill("bg_asagi"),
                ...Array(4).fill("bg_hanada"),
                ...Array(1).fill("bg_killshroud"),
                ...Array(8).fill("bg_trig_crit"),
                ...Array(3).fill("bg_trig_draw"),
                ...Array(4).fill("bg_trig_heal"),
                "bg_trig_over"
            ]
        },
        seraph: {
            rideDeck: ["bg_ruby", "bg_kyanite", "bg_risatt", "bg_seraph"],
            mainDeck: [
                ...Array(3).fill("bg_purelight"),
                ...Array(4).fill("bg_penetrate"),
                ...Array(1).fill("bg_charleen"),
                ...Array(1).fill("bg_violet"),
                ...Array(3).fill("bg_makarite"),
                ...Array(3).fill("bg_cuffspring"),
                ...Array(1).fill("bg_prison_order"),
                ...Array(3).fill("bg_upgrader"),
                ...Array(1).fill("bg_marieda"),
                ...Array(4).fill("bg_pg_simple"),
                ...Array(3).fill("bg_muna"),
                ...Array(3).fill("bg_lifle"),
                ...Array(5).fill("bg_trig_crit"),
                ...Array(4).fill("bg_trig_front"),
                ...Array(2).fill("bg_trig_draw"),
                ...Array(4).fill("bg_trig_heal"),
                "bg_trig_over"
            ]
        }
    };

    let editingRideDeck = [];
    let editingMainDeck = [];
    let currentGradeFilter = 'all';
    let currentTypeFilter = 'all';
    let searchQuery = '';

    const dbModal = document.getElementById('deck-builder-modal');
    const openDbBtn = document.getElementById('open-deck-builder-btn');
    const closeDbBtn = document.getElementById('db-close-btn');

    function getSelectedDeckNation(deckKey) {
        const deckCard = document.querySelector(`#deck-cards-container .deck-card[data-deck="${deckKey}"]`);
        return deckCard ? deckCard.dataset.nation : "";
    }

    function getCardName(id) {
        if (!window.VANGUARD_CARDS_DB || !window.VANGUARD_CARDS_DB.cards) return "";
        const cardObj = window.VANGUARD_CARDS_DB.cards.find(c => c.id === id);
        return cardObj ? cardObj.name : "";
    }

    function getCardGrade(id) {
        if (!window.VANGUARD_CARDS_DB || !window.VANGUARD_CARDS_DB.cards) return 0;
        const cardObj = window.VANGUARD_CARDS_DB.cards.find(c => c.id === id);
        return cardObj ? cardObj.grade : 0;
    }

    function getQtyByName(name) {
        let count = 0;
        editingRideDeck.forEach(id => {
            if (getCardName(id) === name) count++;
        });
        editingMainDeck.forEach(id => {
            if (getCardName(id) === name) count++;
        });
        return count;
    }

    function loadDeckToEdit(deckKey) {
        const saved = localStorage.getItem(`vanguard_custom_deck_${deckKey}`);
        let deckData = null;
        if (saved) {
            try {
                deckData = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved deck:", e);
            }
        }
        
        if (!deckData || !Array.isArray(deckData.rideDeck) || !Array.isArray(deckData.mainDeck)) {
            const def = DEFAULT_DECK_IDS[deckKey];
            if (def) {
                editingRideDeck = [...def.rideDeck];
                editingMainDeck = [...def.mainDeck];
            } else {
                editingRideDeck = [];
                editingMainDeck = [];
            }
        } else {
            editingRideDeck = [...deckData.rideDeck];
            editingMainDeck = [...deckData.mainDeck];
        }
    }

    if (openDbBtn && dbModal) {
        openDbBtn.addEventListener('click', () => {
            if (!window.VANGUARD_CARDS_DB) {
                alert("❌ เกิดข้อผิดพลาด: ไม่พบฐานข้อมูลการ์ด กรุณารีเฟรชหน้าเว็บ");
                return;
            }
            loadDeckToEdit(selectedDeck);
            // Reset filters
            currentGradeFilter = 'all';
            currentTypeFilter = 'all';
            searchQuery = '';
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if (btn.dataset.grade === 'all' || btn.dataset.type === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            const searchIn = document.getElementById('db-search-input');
            if (searchIn) searchIn.value = '';

            renderDeckBuilder();
            dbModal.classList.remove('hidden');
        });
    }

    if (closeDbBtn && dbModal) {
        closeDbBtn.addEventListener('click', () => {
            dbModal.classList.add('hidden');
        });
    }

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const parentGroup = btn.parentElement;
            parentGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (btn.dataset.grade) {
                currentGradeFilter = btn.dataset.grade;
            } else if (btn.dataset.type) {
                currentTypeFilter = btn.dataset.type;
            }

            renderCardPool();
        });
    });

    const searchInput = document.getElementById('db-search-input');
    const clearSearch = document.getElementById('db-clear-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            renderCardPool();
        });
    }
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            renderCardPool();
        });
    }

    function renderCardPool() {
        const grid = document.getElementById('db-card-grid-container');
        if (!grid) return;
        grid.innerHTML = '';

        const selectedNation = getSelectedDeckNation(selectedDeck);
        const allowedCards = window.VANGUARD_CARDS_DB.cards.filter(c => c.nation === selectedNation || c.nation === "All");

        const filteredCards = allowedCards.filter(card => {
            if (searchQuery) {
                const nameMatch = card.name.toLowerCase().includes(searchQuery);
                const skillMatch = card.skill && card.skill.toLowerCase().includes(searchQuery);
                if (!nameMatch && !skillMatch) return false;
            }
            if (currentGradeFilter !== 'all') {
                if (parseInt(card.grade) !== parseInt(currentGradeFilter)) return false;
            }
            if (currentTypeFilter !== 'all') {
                if (currentTypeFilter === 'unit') {
                    if (card.trigger || (card.type && card.type.includes('Order'))) return false;
                } else if (currentTypeFilter === 'trigger') {
                    if (!card.trigger) return false;
                } else if (currentTypeFilter === 'order') {
                    if (!card.type || !card.type.includes('Order')) return false;
                }
            }
            return true;
        });

        if (filteredCards.length === 0) {
            grid.innerHTML = '<div class="db-list-empty-msg" style="grid-column: 1/-1;">ไม่พบการ์ดที่ตรงกับตัวกรอง</div>';
            return;
        }

        filteredCards.forEach(card => {
            const qty = getQtyByName(card.name);
            const cardItem = document.createElement('div');
            cardItem.className = 'db-card-item';
            if (qty > 0) {
                cardItem.classList.add('selected-in-deck');
            }

            let typeTag = '<div class="db-card-type-tag">Unit</div>';
            if (card.trigger) {
                typeTag = `<div class="db-card-type-tag trigger-${card.trigger.toLowerCase()}">${card.trigger}</div>`;
            } else if (card.type) {
                typeTag = `<div class="db-card-type-tag">${card.type}</div>`;
            }

            const badgeHtml = qty > 0 ? `<div class="db-card-badge-qty">${qty}</div>` : '';
            let statsHtml = `<span>P: ${card.power}</span>`;
            if (card.shield !== undefined && card.shield !== null) {
                statsHtml += ` <span>S: ${card.shield}</span>`;
            }

            cardItem.innerHTML = `
                ${badgeHtml}
                <div class="db-card-grade-badge">Grade ${card.grade}</div>
                <div class="db-card-name">${card.name}</div>
                <div class="db-card-stats">
                    ${typeTag}
                    ${statsHtml}
                </div>
                <div class="db-card-skill-preview" title="${card.skill || ''}">${card.skill || 'ไม่มีสกิล'}</div>
                <div class="db-card-actions">
                    <button class="db-card-btn add-main">+ Main</button>
                    ${parseInt(card.grade) <= 3 ? '<button class="db-card-btn add-ride">+ Ride</button>' : ''}
                </div>
            `;

            cardItem.querySelector('.add-main').addEventListener('click', () => {
                const totalQty = getQtyByName(card.name);
                if (totalQty >= 4) {
                    alert("คุณใส่การ์ดใบนี้ครบ 4 ใบแล้ว (ไม่สามารถใส่ซ้ำได้เกิน 4 ใบรวมทั้งไรด์เด็คและเมนเด็ค)");
                    return;
                }
                if (editingMainDeck.length >= 46) {
                    alert("เมนเด็คเต็มแล้ว (สูงสุด 46 ใบ)");
                    return;
                }
                editingMainDeck.push(card.id);
                renderDeckBuilder();
            });

            const addRideBtn = cardItem.querySelector('.add-ride');
            if (addRideBtn) {
                addRideBtn.addEventListener('click', () => {
                    if (editingRideDeck.length >= 4) {
                        alert("ไรด์เด็คเต็มแล้ว (มีได้สูงสุด 4 ใบ)");
                        return;
                    }
                    if (editingRideDeck.some(id => getCardGrade(id) === card.grade)) {
                        alert(`ไรด์เด็คมีเกรด ${card.grade} อยู่แล้ว (ต้องมีเกรด 0, 1, 2, 3 อย่างละ 1 ใบพอดี)`);
                        return;
                    }
                    const totalQty = getQtyByName(card.name);
                    if (totalQty >= 4) {
                        alert("คุณใส่การ์ดใบนี้ครบ 4 ใบแล้ว (ไม่สามารถใส่ซ้ำได้เกิน 4 ใบรวมทั้งไรด์เด็คและเมนเด็ค)");
                        return;
                    }
                    editingRideDeck.push(card.id);
                    renderDeckBuilder();
                });
            }

            grid.appendChild(cardItem);
        });
    }

    function renderActiveDecklist() {
        const rideContainer = document.getElementById('db-ride-list-container');
        const mainContainer = document.getElementById('db-main-list-container');

        if (rideContainer) {
            rideContainer.innerHTML = '';
            if (editingRideDeck.length === 0) {
                rideContainer.innerHTML = '<div class="db-list-empty-msg">ไม่มีการ์ดในไรด์เด็ค</div>';
            } else {
                const sortedRide = [...editingRideDeck].map(id => window.VANGUARD_CARDS_DB.cards.find(c => c.id === id)).filter(Boolean);
                sortedRide.sort((a, b) => a.grade - b.grade);
                
                sortedRide.forEach(card => {
                    const row = document.createElement('div');
                    row.className = 'db-row-card';
                    row.innerHTML = `
                        <div class="db-row-left">
                            <div class="db-row-grade">G${card.grade}</div>
                            <div class="db-row-info">
                                <div class="db-row-name">${card.name}</div>
                                <div class="db-row-subtext">P: ${card.power} / S: ${card.shield}</div>
                            </div>
                        </div>
                        <div class="db-row-actions">
                            <button class="db-row-delete-btn">&times;</button>
                        </div>
                    `;
                    row.querySelector('.db-row-delete-btn').addEventListener('click', () => {
                        const idx = editingRideDeck.indexOf(card.id);
                        if (idx !== -1) {
                            editingRideDeck.splice(idx, 1);
                            renderDeckBuilder();
                        }
                    });
                    rideContainer.appendChild(row);
                });
            }
        }

        if (mainContainer) {
            mainContainer.innerHTML = '';
            if (editingMainDeck.length === 0) {
                mainContainer.innerHTML = '<div class="db-list-empty-msg">ไม่มีการ์ดในเมนเด็ค</div>';
            } else {
                const cardCounts = {};
                editingMainDeck.forEach(id => {
                    cardCounts[id] = (cardCounts[id] || 0) + 1;
                });

                const uniqueCards = Object.keys(cardCounts).map(id => {
                    const cardObj = window.VANGUARD_CARDS_DB.cards.find(c => c.id === id);
                    return cardObj ? { card: cardObj, count: cardCounts[id] } : null;
                }).filter(Boolean);
                
                uniqueCards.sort((a, b) => {
                    if (b.card.grade !== a.card.grade) return b.card.grade - a.card.grade;
                    return a.card.name.localeCompare(b.card.name);
                });

                uniqueCards.forEach(({ card, count }) => {
                    const row = document.createElement('div');
                    row.className = 'db-row-card';
                    
                    let subtext = `P: ${card.power} / S: ${card.shield}`;
                    if (card.trigger) {
                        subtext += ` (${card.trigger} Trigger)`;
                    } else if (card.type) {
                        subtext += ` (${card.type})`;
                    }

                    row.innerHTML = `
                        <div class="db-row-left">
                            <div class="db-row-grade">G${card.grade}</div>
                            <div class="db-row-info">
                                <div class="db-row-name">${card.name}</div>
                                <div class="db-row-subtext">${subtext}</div>
                            </div>
                        </div>
                        <div class="db-row-actions">
                            <div class="db-qty-controls">
                                <button class="db-qty-btn qty-minus">-</button>
                                <div class="db-qty-val">${count}</div>
                                <button class="db-qty-btn qty-plus">+</button>
                            </div>
                            <button class="db-row-delete-btn">&times;</button>
                        </div>
                    `;

                    row.querySelector('.qty-minus').addEventListener('click', () => {
                        const idx = editingMainDeck.indexOf(card.id);
                        if (idx !== -1) {
                            editingMainDeck.splice(idx, 1);
                            renderDeckBuilder();
                        }
                    });

                    row.querySelector('.qty-plus').addEventListener('click', () => {
                        const totalQty = getQtyByName(card.name);
                        if (totalQty >= 4) {
                            alert("คุณใส่การ์ดใบนี้ครบ 4 ใบแล้ว (ไม่สามารถใส่ซ้ำได้เกิน 4 ใบรวมทั้งไรด์เด็คและเมนเด็ค)");
                            return;
                        }
                        if (editingMainDeck.length >= 46) {
                            alert("เมนเด็คเต็มแล้ว (สูงสุด 46 ใบ)");
                            return;
                        }
                        editingMainDeck.push(card.id);
                        renderDeckBuilder();
                    });

                    row.querySelector('.db-row-delete-btn').addEventListener('click', () => {
                        editingMainDeck = editingMainDeck.filter(id => id !== card.id);
                        renderDeckBuilder();
                    });

                    mainContainer.appendChild(row);
                });
            }
        }
    }

    function applyDashColor(selector, isValid) {
        const item = document.querySelector(selector);
        if (!item) return;
        if (isValid) {
            item.style.borderColor = 'rgba(5, 217, 232, 0.2)';
            item.querySelector('.dash-val').style.color = '#05d9e8';
        } else {
            item.style.borderColor = 'rgba(255, 0, 127, 0.3)';
            item.querySelector('.dash-val').style.color = '#ff007f';
        }
    }

    function updateDashboard(triggerCount, healCount, overCount, pgCount, hasAllRideGrades) {
        const tot = document.querySelector('#dash-total .dash-val');
        const rid = document.querySelector('#dash-ride .dash-val');
        const mai = document.querySelector('#dash-main .dash-val');
        const tri = document.querySelector('#dash-trigger .dash-val');
        const hea = document.querySelector('#dash-heal .dash-val');
        const ove = document.querySelector('#dash-over .dash-val');
        const pgg = document.querySelector('#dash-pg .dash-val');

        if (tot) tot.textContent = `${editingRideDeck.length + editingMainDeck.length} / 50`;
        if (rid) rid.textContent = `${editingRideDeck.length} / 4`;
        if (mai) mai.textContent = `${editingMainDeck.length} / 46`;
        if (tri) tri.textContent = `${triggerCount} / 16`;
        if (hea) hea.textContent = `${healCount} / 4`;
        if (ove) ove.textContent = `${overCount} / 1`;
        if (pgg) pgg.textContent = `${pgCount} / 4`;

        applyDashColor('#dash-total', editingRideDeck.length + editingMainDeck.length === 50);
        applyDashColor('#dash-ride', editingRideDeck.length === 4 && hasAllRideGrades);
        applyDashColor('#dash-main', editingMainDeck.length === 46);
        applyDashColor('#dash-trigger', triggerCount === 16);
        applyDashColor('#dash-heal', healCount <= 4);
        applyDashColor('#dash-over', overCount <= 1);
        applyDashColor('#dash-pg', pgCount <= 4);
    }

    function renderDeckBuilder() {
        if (!window.VANGUARD_CARDS_DB) return;

        const rideGrades = editingRideDeck.map(id => getCardGrade(id));
        const hasAllRideGrades = rideGrades.includes(0) && rideGrades.includes(1) && rideGrades.includes(2) && rideGrades.includes(3) && rideGrades.length === 4;

        const mainDeckCards = editingMainDeck.map(id => window.VANGUARD_CARDS_DB.cards.find(c => c.id === id)).filter(Boolean);
        const triggerCount = mainDeckCards.filter(c => !!c.trigger).length;
        const healCount = mainDeckCards.filter(c => c.trigger === "Heal").length;
        const overCount = mainDeckCards.filter(c => c.trigger === "Over").length;
        const pgCount = mainDeckCards.filter(c => !!c.isPG).length;

        let errors = [];
        if (editingRideDeck.length + editingMainDeck.length !== 50) {
            errors.push("เด็คการ์ดรวมทั้งหมดต้องมี 50 ใบพอดี");
        }
        if (editingRideDeck.length !== 4) {
            errors.push("ไรด์เด็คต้องมี 4 ใบ");
        } else if (!hasAllRideGrades) {
            errors.push("ไรด์เด็คต้องมีเกรด 0, 1, 2, 3 อย่างละ 1 ใบพอดี");
        }
        if (editingMainDeck.length !== 46) {
            errors.push("เมนเด็คต้องมี 46 ใบ");
        }
        if (triggerCount !== 16) {
            errors.push("เมนเด็คต้องมีทริกเกอร์รวมทั้งหมด 16 ใบพอดี");
        }
        if (healCount > 4) {
            errors.push("ใส่ฮีลทริกเกอร์ได้ไม่เกิน 4 ใบ");
        }
        if (overCount > 1) {
            errors.push("ใส่โอเวอร์ทริกเกอร์ได้ไม่เกิน 1 ใบ");
        }
        if (pgCount > 4) {
            errors.push("ใส่เซนติเนล (Perfect Guard) ได้ไม่เกิน 4 ใบ");
        }

        let dupLimitExceeded = false;
        const nameCounts = {};
        [...editingRideDeck, ...editingMainDeck].forEach(id => {
            const name = getCardName(id);
            if (name) {
                nameCounts[name] = (nameCounts[name] || 0) + 1;
                if (nameCounts[name] > 4) dupLimitExceeded = true;
            }
        });
        if (dupLimitExceeded) {
            errors.push("ห้ามใส่การ์ดที่ชื่อซ้ำกันเกิน 4 ใบในเด็ค");
        }

        const selectedNation = getSelectedDeckNation(selectedDeck);
        const invalidNation = [...editingRideDeck, ...editingMainDeck].some(id => {
            const c = window.VANGUARD_CARDS_DB.cards.find(x => x.id === id);
            return c && c.nation !== selectedNation && c.nation !== "All";
        });
        if (invalidNation) {
            errors.push("การ์ดทั้งหมดต้องตรงกับเนชั่นที่เลือก");
        }

        const valText = document.getElementById('db-validation-text');
        const saveBtn = document.getElementById('db-save-btn');
        if (valText) {
            if (errors.length === 0) {
                valText.innerHTML = "✅ เด็คสมบูรณ์และถูกต้องตามกฎการแข่ง!";
                valText.style.color = "#05d9e8";
                if (saveBtn) saveBtn.disabled = false;
            } else {
                valText.innerHTML = "⚠️ " + errors.join(" | ");
                valText.style.color = "#ff007f";
                if (saveBtn) saveBtn.disabled = true;
            }
        }

        const rideCounter = document.getElementById('sec-ride-count');
        const mainCounter = document.getElementById('sec-main-count');
        if (rideCounter) rideCounter.textContent = `${editingRideDeck.length}/4`;
        if (mainCounter) mainCounter.textContent = `${editingMainDeck.length}/46`;

        updateDashboard(triggerCount, healCount, overCount, pgCount, hasAllRideGrades);
        renderCardPool();
        renderActiveDecklist();
    }

    // Reset Button
    const resetBtn = document.getElementById('db-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("คุณต้องการล้างข้อมูลการ์ดทั้งหมดในเด็คนี้ใช่หรือไม่?")) {
                editingRideDeck = [];
                editingMainDeck = [];
                renderDeckBuilder();
            }
        });
    }

    // Save Button
    const saveBtn = document.getElementById('db-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            localStorage.setItem(`vanguard_custom_deck_${selectedDeck}`, JSON.stringify({
                rideDeck: editingRideDeck,
                mainDeck: editingMainDeck
            }));
            alert("💾 บันทึกเด็คแต่งเองเรียบร้อยแล้ว!");
            if (dbModal) dbModal.classList.add('hidden');
        });
    }

    // Export Button
    const exportBtn = document.getElementById('db-export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const deckData = {
                deckName: selectedDeck,
                nation: getSelectedDeckNation(selectedDeck),
                rideDeck: editingRideDeck,
                mainDeck: editingMainDeck
            };
            const blob = new Blob([JSON.stringify(deckData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `deck_${selectedDeck}_custom.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Import Button
    const importBtn = document.getElementById('db-import-btn');
    const importFileInput = document.getElementById('db-import-file');
    if (importBtn && importFileInput) {
        importBtn.addEventListener('click', () => {
            importFileInput.click();
        });
        importFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const data = JSON.parse(evt.target.result);
                    if (data && Array.isArray(data.rideDeck) && Array.isArray(data.mainDeck)) {
                        const selectedNation = getSelectedDeckNation(selectedDeck);
                        const cardsMap = {};
                        window.VANGUARD_CARDS_DB.cards.forEach(c => cardsMap[c.id] = c);
                        
                        const allImportedIds = [...data.rideDeck, ...data.mainDeck];
                        const invalidNationCard = allImportedIds.some(id => {
                            const c = cardsMap[id];
                            return c && c.nation !== selectedNation && c.nation !== "All";
                        });
                        
                        if (invalidNationCard) {
                            alert("❌ นำเข้าเด็คไม่สำเร็จ: เด็คที่นำเข้ามีการ์ดของเนชั่นอื่นที่ไม่ตรงกับเนชั่นปัจจุบัน!");
                            return;
                        }
                        
                        editingRideDeck = data.rideDeck;
                        editingMainDeck = data.mainDeck;
                        renderDeckBuilder();
                        alert("📥 นำเข้าข้อมูลเด็คสำเร็จเรียบร้อย!");
                    } else {
                        alert("❌ รูปแบบไฟล์เด็คไม่ถูกต้อง");
                    }
                } catch (err) {
                    alert("❌ เกิดข้อผิดพลาดในการอ่านไฟล์ JSON");
                }
                importFileInput.value = '';
            };
            reader.readAsText(file);
        });
    }
});
