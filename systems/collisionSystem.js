import { GAME_CONFIG } from '../config/gameConfig.js';

const { Events, Composite } = Matter;

// Portfolio state tracking
let portfolioState = {
  unlockedSections: new Set(),
  portfolioPigs: new Map(), // pigId -> section mapping
  damageSystemActive: false // Flag to prevent damage during initialization
};

export function setupBoundsReset(engine, slingState) {
  // Sistema de detección de límites desactivado
  // En el futuro se implementará un sistema de múltiples pájaros
  // donde cada pájaro se consume al ser lanzado sin respawn automático
  
  const xMin = -50;
  const xMax = GAME_CONFIG.width + 50;
  const yMax = GAME_CONFIG.height + 50;
  
  Events.on(engine, 'afterUpdate', () => {
    const p = slingState.projectile.position;
    if (p.x > xMax || p.x < xMin || p.y > yMax) {
      // Solo log para debug, sin reset automático
      console.log('🐦 Pájaro salió de los límites del juego');
      // TODO: Aquí se implementará la lógica para pasar al siguiente pájaro
    }
  });
}

/**
 * Sets up collision detection for portfolio pigs
 * @param {Matter.Engine} engine - The Matter.js engine
 * @param {Array} portfolioPigs - Array of portfolio pig bodies
 */
export function setupPortfolioCollisions(engine, portfolioPigs) {
  // Store portfolio pigs for tracking and add damage monitoring
  portfolioPigs.forEach(pig => {
    if (pig.isPortfolioPig) {
      portfolioState.portfolioPigs.set(pig.id, pig.portfolioSection);
      // Initialize damage tracking
      pig.damageAccumulated = 0;
      pig.initialY = pig.position.y; // Track original height for fall damage
      pig.initialX = pig.position.x; // Track original position for crush detection
    }
  });

  console.log('⏳ Inicializando sistema de daño... Los cerditos se posicionarán en 2 segundos.');

  // Activate damage system after a short delay to allow pigs to settle
  setTimeout(() => {
    portfolioState.damageSystemActive = true;
    console.log('🛡️ Sistema de daño activado - ¡Los cerditos ya pueden ser eliminados!');
  }, 1000); // 2 second delay

  // Listen for ALL collisions involving portfolio pigs
  Events.on(engine, 'collisionStart', (event) => {
    if (!portfolioState.damageSystemActive) return; // Skip if system not active yet
    
    event.pairs.forEach(pair => {
      const { bodyA, bodyB } = pair;
      const portfolioPig = getPortfolioPig(bodyA, bodyB);
      
      if (portfolioPig && !portfolioState.unlockedSections.has(portfolioPig.portfolioSection)) {
        const otherBody = portfolioPig === bodyA ? bodyB : bodyA;
        handlePortfolioPigDamage(portfolioPig, otherBody, engine);
      }
    });
  });

  // Monitor for physics-based damage (velocity, position changes)
  Events.on(engine, 'afterUpdate', () => {
    if (!portfolioState.damageSystemActive) return; // Skip if system not active yet
    checkForPhysicalDamage(engine, portfolioPigs);
  });
}

/**
 * Handles damage to a portfolio pig from collisions
 */
function handlePortfolioPigDamage(pig, otherBody, engine) {
  // Calculate damage based on collision
  let damage = 0;
  let damageType = '';

  // Direct projectile hit = instant kill
  if (otherBody.label === 'projectile') {
    damage = 100;
    damageType = 'impacto directo del pájaro';
  }
  // Wooden structures falling on pig
  else if (otherBody.label === 'woodenBeam' || otherBody.label === 'woodenBlock') {
    const impactVelocity = Math.sqrt(otherBody.velocity.x**2 + otherBody.velocity.y**2);
    if (impactVelocity > 2) {
      damage = 100; // Wooden objects falling = instant kill
      damageType = 'estructura de madera cayendo encima';
    }
  }
  // High-speed collision with any object
  else {
    const relativeVelocity = Math.sqrt(
      (pig.velocity.x - otherBody.velocity.x)**2 + 
      (pig.velocity.y - otherBody.velocity.y)**2
    );
    if (relativeVelocity > 4) {
      damage = 100;
      damageType = 'colisión de alta velocidad';
    }
  }

  // Apply damage
  if (damage > 0) {
    pig.damageAccumulated += damage;
    
    if (pig.damageAccumulated >= 100) {
      destroyPortfolioPig(pig, engine, damageType);
    }
  }
}

/**
 * Checks for physics-based damage (falls, high velocity, etc.)
 */
function checkForPhysicalDamage(engine, portfolioPigs) {
  portfolioPigs.forEach(pig => {
    if (!pig.isPortfolioPig || portfolioState.unlockedSections.has(pig.portfolioSection)) {
      return;
    }

    let shouldDestroy = false;
    let damageType = '';

    // 1. Fall damage - if pig has fallen significant distance
    const fallDistance = pig.position.y - pig.initialY;
    if (fallDistance > 100) { // Fell more than 100 pixels (increased threshold)
      shouldDestroy = true;
      damageType = 'caída desde gran altura';
    }

    // 2. High velocity damage (being flung around)
    const speed = Math.sqrt(pig.velocity.x**2 + pig.velocity.y**2);
    if (speed > 8) {
      shouldDestroy = true;
      damageType = 'movimiento de alta velocidad';
    }

    // 3. Fell off the world
    if (pig.position.y > GAME_CONFIG.height - 50) {
      shouldDestroy = true;
      damageType = 'caída fuera del mapa';
    }

    // 4. Crushed (very low velocity but displaced from original position after being hit)
    if (pig.damageAccumulated > 0 && speed < 0.5 && 
        Math.abs(pig.position.x - pig.initialX) > 50) {
      shouldDestroy = true;
      damageType = 'aplastado por escombros';
    }

    if (shouldDestroy) {
      destroyPortfolioPig(pig, engine, damageType);
    }
  });
}

/**
 * Destroys a portfolio pig and unlocks the section
 */
function destroyPortfolioPig(pig, engine, damageType) {
  // Unlock the portfolio section
  unlockPortfolioSection(pig.portfolioSection);
  
  // Remove the pig from the world
  Composite.remove(engine.world, pig);
  
  // Log the destruction
  console.log(`� Cerdito ${pig.portfolioSection} eliminado por: ${damageType}!`);
}

/**
 * Unlocks a portfolio section by enabling the corresponding button
 */
function unlockPortfolioSection(section) {
  if (portfolioState.unlockedSections.has(section)) {
    return;
  }

  portfolioState.unlockedSections.add(section);
  
  // Update UI
  const button = document.getElementById(`btn-${section}`);
  if (button) {
    button.classList.remove('locked');
    button.classList.add('unlocked');
    button.disabled = false;
    
    // Update progress counter
    updateProgressCounter();
    
    // Add visual feedback
    button.style.animation = 'pulse 1s ease-in-out';
    setTimeout(() => {
      button.style.animation = '';
    }, 1000);
  }

  console.log(`🎉 Sección "${section}" desbloqueada!`);
}

/**
 * Updates the progress counter in the UI
 */
function updateProgressCounter() {
  const counter = document.getElementById('unlocked-count');
  if (counter) {
    counter.textContent = portfolioState.unlockedSections.size;
  }
}

/**
 * Helper function to identify portfolio pig in collision pair
 */
function getPortfolioPig(bodyA, bodyB) {
  if (bodyA.isPortfolioPig) return bodyA;
  if (bodyB.isPortfolioPig) return bodyB;
  return null;
}

/**
 * Helper function to identify projectile in collision pair
 */
function getProjectile(bodyA, bodyB) {
  if (bodyA.label === 'projectile') return bodyA;
  if (bodyB.label === 'projectile') return bodyB;
  return null;
}

/**
 * Gets the current portfolio unlock state
 */
export function getPortfolioState() {
  return portfolioState;
}
