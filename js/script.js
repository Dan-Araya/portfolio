import { GAME_CONFIG } from '../config/gameConfig.js';
import { createSling, attachMouse } from '../entities/sling.js';
import { BirdQueue } from '../entities/birdQueue.js';
import { 
  createSlingGround, 
  createTargetGround, 
  createWoodenPlank, 
  createWoodenPillar, 
  createWoodenBlock 
} from '../entities/structures.js';
import { createSmallPig, createMediumPig, createLargePig, createPortfolioPig } from '../entities/pigs.js';
import { startEngine } from '../systems/animationSystem.js';
import { setupBoundsReset, setupPortfolioCollisions } from '../systems/collisionSystem.js';

const { Engine, Render, Bodies, Composite } = Matter;

// Engine & World
const engine = Engine.create();
engine.world.gravity.y = GAME_CONFIG.world.gravity.y;
const world = engine.world;

// Render
const render = Render.create({
  element: document.body,
  engine,
  options: {
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    wireframes: false,
    background: GAME_CONFIG.background
  }
});

// Structures
const slingGroundCfg = GAME_CONFIG.structures.slingGround;
const targetGroundCfg = GAME_CONFIG.structures.targetGround;

const slingGround = createSlingGround(
  slingGroundCfg.x,
  slingGroundCfg.y,
  slingGroundCfg.w,
  slingGroundCfg.h,
  GAME_CONFIG.colors.slingGround,
  GAME_CONFIG.textures.slingGround.src,
  GAME_CONFIG.textures.slingGround.scaleX,
  GAME_CONFIG.textures.slingGround.scaleY
);

const targetGround = createTargetGround(
  targetGroundCfg.x,
  targetGroundCfg.y,
  targetGroundCfg.w,
  targetGroundCfg.h,
  GAME_CONFIG.colors.targetGround
);

Composite.add(world, [slingGround, targetGround]);

// Create wooden structures based on level configuration
const woodenStructures = [];
GAME_CONFIG.level.structures.forEach(struct => {
  let structure;
  switch (struct.type) {
    case 'plank':
      structure = createWoodenPlank(struct.x, struct.y);
      break;
    case 'pillar':
      structure = createWoodenPillar(struct.x, struct.y);
      break;
    case 'block':
      structure = createWoodenBlock(struct.x, struct.y);
      break;
  }
  if (structure) {
    woodenStructures.push(structure);
  }
});

// Create portfolio pigs that unlock navigation (only these 5 pigs in the game)
const portfolioPigs = [];
GAME_CONFIG.level.portfolioPigs.forEach(pigConfig => {
  const pig = createPortfolioPig(
    pigConfig.x, 
    pigConfig.y, 
    pigConfig.section, 
    pigConfig.color, 
    pigConfig.label
  );
  portfolioPigs.push(pig);
});

// Add all structures and portfolio pigs to the world
Composite.add(world, [...woodenStructures, ...portfolioPigs]);

// Initialize bird queue system
const birdQueue = new BirdQueue(world);

// Sling - now works with bird queue
const slingState = createSling(world, birdQueue);
attachMouse(engine, render, world, slingState);

// Setup collision systems
setupBoundsReset(engine, slingState, birdQueue); // Pass birdQueue to collision system
setupPortfolioCollisions(engine, portfolioPigs);

// Setup portfolio navigation
setupPortfolioNavigation();

// Add UI for bird count
createBirdCountUI();

// Start
startEngine(engine, render);

/**
 * Creates UI element to show remaining birds
 */
function createBirdCountUI() {
  const birdCountElement = document.createElement('div');
  birdCountElement.id = 'bird-count';
  birdCountElement.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    font-size: 16px;
    font-weight: bold;
    z-index: 1000;
  `;
  
  document.body.appendChild(birdCountElement);
  
  // Update bird count display
  function updateBirdCount() {
    const remaining = birdQueue.getRemainingBirds();
    const current = birdQueue.currentBirdIndex + 1;
    const total = GAME_CONFIG.birdQueue.totalBirds;
    
    if (birdQueue.isGameComplete()) {
      birdCountElement.textContent = `🎯 ¡Juego terminado! Sin pájaros`;
    } else {
      birdCountElement.textContent = `🐦 Pájaro: ${current}/${total} | Restantes: ${remaining - 1}`;
    }
    
    requestAnimationFrame(updateBirdCount);
  }
  
  updateBirdCount();
}

/**
 * Sets up the portfolio navigation functionality
 */
function setupPortfolioNavigation() {
  // Add click listeners to navigation buttons
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      if (!button.disabled) {
        const section = button.dataset.section;
        handleSectionNavigation(section);
      }
    });
  });
}

/**
 * Handles navigation to different portfolio sections
 */
function handleSectionNavigation(section) {
  // Here you can add logic to show different portfolio content
  // For now, we'll just show an alert
  const sectionNames = {
    'proyectos': 'Mis Proyectos',
    'experiencia': 'Mi Experiencia',
    'habilidades': 'Mis Habilidades',
    'sobre-mi': 'Sobre Mí',
    'contacto': 'Contacto'
  };

  alert(`🎉 ¡Has desbloqueado "${sectionNames[section]}"!\n\nAquí podrías mostrar el contenido de tu portfolio.`);
  
  console.log(`Navegando a la sección: ${section}`);
}
