import { GAME_CONFIG } from '../config/gameConfig.js';
import { createSling, attachMouse } from '../entities/sling.js';
import { startEngine } from '../systems/animationSystem.js';

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

// Sling
const slingState = createSling(world);
attachMouse(engine, render, world, slingState);

// Start
startEngine(engine, render);
