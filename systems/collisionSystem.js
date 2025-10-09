import { GAME_CONFIG } from '../config/gameConfig.js';

const { Events } = Matter;

export function setupBoundsReset(engine, slingState) {
  const resetDelayMs = GAME_CONFIG.sling.resetDelayMs;
  const xMin = -50;
  const xMax = GAME_CONFIG.width + 50;
  const yMax = GAME_CONFIG.height + 50;
  
  Events.on(engine, 'afterUpdate', () => {
    const p = slingState.projectile.position;
    if (p.x > xMax || p.x < xMin || p.y > yMax) {
      setTimeout(() => slingState.reset(), resetDelayMs);
    }
  });
}
