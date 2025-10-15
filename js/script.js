import { GAME_CONFIG } from '../config/gameConfig.js';
import { createSling, attachMouse } from '../entities/sling.js';
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

// Sling
const slingState = createSling(world);
attachMouse(engine, render, world, slingState);

// Setup collision systems
setupBoundsReset(engine, slingState);
setupPortfolioCollisions(engine, portfolioPigs);

// Setup portfolio navigation
setupPortfolioNavigation();

// Start
startEngine(engine, render);

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
