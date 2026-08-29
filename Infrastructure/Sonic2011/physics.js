/**
 * Sonic2011 - Modulo Fisica basato su logica HedgePhysics
 * Gestione movimento 3D, accelerazione e meccanica del Boost
 */

// 1. Configurazione dei parametri fisici originali (Costanti di gioco)
const HEDGE_PHYSICS = {
    gravity: 0.21875,       // Forza di gravità applicata a ogni frame
    maxGroundSpeed: 16.0,   // Velocità massima standard a terra (in unità/frame)
    acceleration: 0.046875, // Accelerazione lineare standard
    deceleration: 0.5,      // Forza di attrito quando si frena
    
    // Parametri specifici del BOOST (stile Sonic Generations)
    boostMaxSpeed: 32.0,    // La velocità raddoppia durante il Boost
    boostAcceleration: 0.8, // Spinta immediata quando si attiva il Boost
    boostDrainRate: 0.5,    // Quantità di energia consumata al secondo
    boostMaxEnergy: 100.0   // Capacità massima della barra del Boost
};

// 2. Stato iniziale del giocatore (Sonic)
let sonicState = {
    position: { x: 0.0, y: 0.0, z: 0.0 }, // Coordinate nello spazio 3D
    velocity: { x: 0.0, y: 0.0, z: 0.0 }, // Vettori di velocità
    isGrounded: true,                    // Indica se Sonic è a terra o in aria
    isBoosting: false,                   // Stato del Boost attivo/disattivo
    boostEnergy: 100.0                   // Livello attuale della barra dell'energia
};

/**
 * Attiva o disattiva il Boost in base all'input del giocatore
 * @param {boolean} pressStatus - True se il tasto Boost è premuto
 */
function handleBoostInput(pressStatus) {
    // Il Boost si attiva solo se c'è energia e il tasto è premuto
    if (pressStatus && sonicState.boostEnergy > 0) {
        sonicState.isBoosting = true;
    } else {
        sonicState.isBoosting = false;
    }
}

/**
 * Ciclo di aggiornamento della fisica (Eseguito a 60 FPS nel Game Loop)
 * Traduzione web degli algoritmi di movimento di HedgePhysics
 */
function updateSonicPhysics(deltaTime) {
    // A. Gestione della barra del Boost (Consumo energetico)
    if (sonicState.isBoosting) {
        // Riduci l'energia in base al tempo trascorso
        sonicState.boostEnergy -= HEDGE_PHYSICS.boostDrainRate * deltaTime;
        
        // Se la barra si svuota, spegni il Boost automaticamente
        if (sonicState.boostEnergy <= 0) {
            sonicState.boostEnergy = 0;
            sonicState.isBoosting = false;
        }
    }

    // B. Calcolo della Velocità Attuale (Limite dinamico)
    // Se il Boost è attivo usa il limite maggiorato, altrimenti il limite standard
    let currentSpeedLimit = sonicState.isBoosting ? HEDGE_PHYSICS.boostMaxSpeed : HEDGE_PHYSICS.maxGroundSpeed;
    let currentAccel = sonicState.isBoosting ? HEDGE_PHYSICS.boostAcceleration : HEDGE_PHYSICS.acceleration;

    // C. Simulazione dello slancio (Applicazione dell'accelerazione sul vettore Z)
    if (sonicState.velocity.z < currentSpeedLimit) {
        sonicState.velocity.z += currentAccel;
        // Impedisce di superare il limite massimo impostato
        if (sonicState.velocity.z > currentSpeedLimit) {
            sonicState.velocity.z = currentSpeedLimit;
        }
    }

    // D. Simulazione della Gravità (Se Sonic non tocca il suolo)
    if (!sonicState.isGrounded) {
        sonicState.velocity.y -= HEDGE_PHYSICS.gravity;
    } else {
        // Se è a terra, azzera la velocità verticale
        if (sonicState.velocity.y < 0) sonicState.velocity.y = 0;
    }

    // E. Aggiornamento finale della posizione nello spazio 3D
    sonicState.position.x += sonicState.velocity.x;
    sonicState.position.y += sonicState.velocity.y;
    sonicState.position.z += sonicState.velocity.z;
}
