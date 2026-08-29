/**
 * Sonic2011 - Modulo Audio 3D Spaziale
 * Gestisce l'effetto sonoro tridimensionale nativo nel browser (Web Audio API)
 */

// 1. Inizializzazione del motore audio del browser
let audioCtx = null;
let audioListener = null;

/**
 * Attiva il motore audio. I browser moderni richiedono che l'utente 
 * interagisca con la pagina (es. un click) prima di poter riprodurre suoni.
 */
function initAudio3D() {
    if (!audioCtx) {
        // Crea il contesto audio principale
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // Configura l'ascoltatore (che rappresenta le orecchie del giocatore / la telecamera)
        audioListener = audioCtx.listener;
    }
}

/**
 * Aggiorna la posizione delle "orecchie" della telecamera nello spazio 3D.
 * Viene eseguito nel Game Loop per tracciare i movimenti di Sonic.
 */
function updateAudioListener(position, orientation) {
    if (!audioListener) return;

    // Imposta la posizione della telecamera (X, Y, Z)
    if (audioListener.positionX) {
        audioListener.positionX.value = position.x;
        audioListener.positionY.value = position.y;
        audioListener.positionZ.value = position.z;
    } else {
        // Supporto per i browser più vecchi
        audioListener.setPosition(position.x, position.y, position.z);
    }
}

/**
 * Riproduce un effetto sonoro posizionato in un punto specifico del livello 3D
 * @param {AudioBuffer} audioBuffer - Il file audio pre-caricato
 * @param {Object} sourcePos - Le coordinate (x, y, z) in cui avviene il suono (es. un anello)
 */
function playSpatialSound(audioBuffer, sourcePos) {
    if (!audioCtx) return;

    // A. Crea la sorgente audio (il "riproduttore" del file)
    let soundSource = audioCtx.createBufferSource();
    soundSource.buffer = audioBuffer;

    // B. Crea il PannerNode (il processore che calcola l'effetto 3D spaziale)
    let panner = audioCtx.createPanner();
    
    // Configura il modello matematico per l'attenuazione del suono con la distanza
    panner.panningModel = 'HRTF'; // Modello ad alta fedeltà che simula l'udito umano
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;       // Distanza minima prima che il suono inizi a calare
    panner.maxDistance = 10000;   // Distanza massima oltre la quale il suono scompare
    panner.rollOffFactor = 1;     // Quanto velocemente cala il volume allontanandosi

    // Imposta la posizione dell'oggetto che emette il suono nello spazio
    if (panner.positionX) {
        panner.positionX.value = sourcePos.x;
        panner.positionY.value = sourcePos.y;
        panner.positionZ.value = sourcePos.z;
    } else {
        panner.setPosition(sourcePos.x, sourcePos.y, sourcePos.z);
    }

    // C. Connette i nodi: Sorgente -> Processore 3D -> Casse/Cuffie dell'utente
    soundSource.connect(panner);
    panner.connect(audioCtx.destination);

    // Avvia la riproduzione del suono immediatamente
    soundSource.start(0);
}

// Inizializza il sistema non appena l'utente clicca un punto qualsiasi della pagina
window.addEventListener('click', () => {
    initAudio3D();
}, { once: true }); // Esegue il codice una sola volta
