const { Bodies } = Matter;

/**
 * Creates a static ground platform for the sling
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} width - Platform width
 * @param {number} height - Platform height
 * @param {string} color - Fill color for the platform
 * @param {string} texture - Texture for the platform
 * @returns {Matter.Body} The ground body
 */
export function createSlingGround(x, y, width, height, color, texture, scaleX = 1, scaleY = 1) {
  return Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: texture ? {
      sprite: {
        texture: texture,
        xScale: scaleX,   // Escala horizontal personalizable
        yScale: scaleY    // Escala vertical personalizable
      }
    } : { fillStyle: color },
    label: 'slingGround'
  });
}

/**
 * Creates a static ground platform for targets
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} width - Platform width
 * @param {number} height - Platform height
 * @param {string} color - Fill color for the platform
 * @returns {Matter.Body} The ground body
 */
export function createTargetGround(x, y, width, height, color) {
  return Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: { fillStyle: color },
    label: 'targetGround'
  });
}

/**
 * Creates a static wall
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} width - Wall width
 * @param {number} height - Wall height
 * @param {string} color - Fill color
 * @returns {Matter.Body} The wall body
 */
export function createWall(x, y, width, height, color) {
  return Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: { fillStyle: color },
    label: 'wall'
  });
}

/**
 * Creates a wooden beam (horizontal or vertical)
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} width - Beam width
 * @param {number} height - Beam height
 * @param {string} color - Fill color for the beam
 * @returns {Matter.Body} The wooden beam body
 */
export function createWoodenBeam(x, y, width, height, color = '#8B4513') {
  return Bodies.rectangle(x, y, width, height, {
    density: 0.001,
    friction: 0.8,
    frictionStatic: 0.5,
    restitution: 0.2,
    render: { fillStyle: color },
    label: 'woodenBeam'
  });
}

/**
 * Creates a horizontal wooden plank
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} length - Plank length (default 80)
 * @param {string} color - Fill color for the plank
 * @returns {Matter.Body} The wooden plank body
 */
export function createWoodenPlank(x, y, length = 80, color = '#D2691E') {
  return createWoodenBeam(x, y, length, 12, color);
}

/**
 * Creates a vertical wooden pillar
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} height - Pillar height (default 60)
 * @param {string} color - Fill color for the pillar
 * @returns {Matter.Body} The wooden pillar body
 */
export function createWoodenPillar(x, y, height = 60, color = '#CD853F') {
  return createWoodenBeam(x, y, 12, height, color);
}

/**
 * Creates a wooden block (square)
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {number} size - Block size (default 25)
 * @param {string} color - Fill color for the block
 * @returns {Matter.Body} The wooden block body
 */
export function createWoodenBlock(x, y, size = 25, color = '#A0522D') {
  return Bodies.rectangle(x, y, size, size, {
    density: 0.002,
    friction: 0.9,
    frictionStatic: 0.6,
    restitution: 0.1,
    render: { fillStyle: color },
    label: 'woodenBlock'
  });
}