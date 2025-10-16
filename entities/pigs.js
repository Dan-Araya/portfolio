import { GAME_CONFIG } from '../config/gameConfig.js';

const { Bodies } = Matter;

/**
 * Creates a pig enemy
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} radius - Pig radius (default 20)
 * @param {string} color - Fill color for the pig
 * @returns {Matter.Body} The pig body
 */
export function createPig(x, y, radius = 20, color = '#90EE90') {
  return Bodies.circle(x, y, radius, {
    density: 0.0015,
    friction: 0.7,
    frictionStatic: 0.4,
    restitution: 0.3,
    render: { 
      fillStyle: color,
      strokeStyle: '#228B22',
      lineWidth: 2
    },
    label: 'pig'
  });
}

/**
 * Creates a small pig
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @returns {Matter.Body} The small pig body
 */
export function createSmallPig(x, y) {
  return createPig(x, y, 15, '#98FB98');
}

/**
 * Creates a medium pig
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @returns {Matter.Body} The medium pig body
 */
export function createMediumPig(x, y) {
  return createPig(x, y, 20, '#90EE90');
}

/**
 * Creates a large pig (boss)
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @returns {Matter.Body} The large pig body
 */
export function createLargePig(x, y) {
  return createPig(x, y, 28, '#7CFC00');
}

/**
 * Creates a special portfolio pig that unlocks navigation sections
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {string} section - The portfolio section this pig unlocks
 * @param {string} color - Custom color for the pig (used as tint for texture)
 * @param {string} emoji - Emoji label for the pig
 * @returns {Matter.Body} The portfolio pig body
 */
export function createPortfolioPig(x, y, section, color = '#FFD700', emoji = '🐷') {
  const pig = Bodies.circle(x, y, 25, {
    density: 0.002,
    friction: 0.8,
    frictionStatic: 0.5,
    restitution: 0.4,
    render: { 
      sprite: {
        texture: GAME_CONFIG.textures.pig.src,
        xScale: GAME_CONFIG.textures.pig.scaleX,
        yScale: GAME_CONFIG.textures.pig.scaleY
      },
      // Fallback color if texture doesn't load
      fillStyle: color,
      strokeStyle: '#333',
      lineWidth: 2
    },
    label: `portfolio-pig-${section}`
  });

  // Add custom properties for portfolio functionality
  pig.portfolioSection = section;
  pig.emoji = emoji;
  pig.isPortfolioPig = true;

  return pig;
}
