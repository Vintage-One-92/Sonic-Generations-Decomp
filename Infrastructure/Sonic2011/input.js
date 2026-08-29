/**
 * Sonic2011 - Modulo Gestione Input
 * Intercetta i tasti del browser e li collega alla fisica di gioco
 */

// 1. Mappatura dei tasti (Associa il codice del tasto a un'azione)
const INPUT_MAP = {
    // Movimento (Frecce o WASD)
    'ArrowUp': 'up',    'KeyW': 'up',
    'ArrowDown': 'down','KeyS': 'down',
    'ArrowLeft': 'left','KeyA': 'left',
    'ArrowRight': 'right','KeyD': 'right',
    
    // Azioni stile Sonic Generations
    'Space': 'jump',       // Barra spaziatrice per Saltare / Homing Attack
    'ShiftLeft': 'boost',  // Shift sinistro per attivare il Boost energetico
    'KeyX': 'boost'        // Alternativa: tasto X per il Boost
};

// 2. Stato dei comandi (Indica se l'azione è attiva o no in questo millisecondo)
let inputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false,
    boost: false
};

/**
 * Inizializza i "listener" del browser per ascoltare la tastiera
 */
function initInputListeners() {
    // Ascolta quando l'utente PREME un tasto
    window.addEventListener('keydown', (event) => {
        // Cerca se il tasto premuto è presente nella nostra mappa
        if (INPUT_MAP[event.code]) {
            let action = INPUT_MAP[event.code];
            inputState[action] = true;
            
            // Se l'azione è il boost, comunica direttamente al modulo physics.js
            if (action === 'boost') {
                if (typeof handleBoostInput === 'function') {
                    handleBoostInput(true);
                }
            }
        }
    });

    // Ascolta quando l'utente RILASCIA un tasto
    window.addEventListener('keyup', (event) => {
        if (INPUT_MAP[event.code]) {
            let action = INPUT_MAP[event.code];
            inputState[action] = false;
            
            // Se l'utente rilascia il boost, spegnilo nella fisica
            if (action === 'boost') {
                if (typeof handleBoostInput === 'function') {
                    handleBoostInput(false);
                }
            }
        }
    });
}

/**
 * Funzione di utilità per verificare se un'azione è attiva.
 * Verrà letta dal ciclo principale del gioco (Game Loop).
 * @param {string} action - L'azione da controllare ('jump', 'up', etc.)
 * @returns {boolean}
 */
function isActionPressed(action) {
    return inputState[action] || false;
}

// Avvia automaticamente il sistema di ascolto dei tasti nel browser
initInputListeners();
