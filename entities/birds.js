const { Bodies } = Matter;

/**
 * Creates a bird projectile with physical properties
 * @param {number} x - Initial x position
 * @param {number} y - Initial y position
 * @param {number} radius - Bird radius
 * @param {string} color - Fill color for the bird
 * @returns {Matter.Body} The bird body
 */
export function createBird(x, y, radius, color) {
  return Bodies.circle(x, y, radius, {
    density: 0.001,
    frictionAir: 0.005,
    restitution: 0.8,
    render: { fillStyle: color },
    collisionFilter: {
      group: -1  // Same group = no collision between slingBase and projectile
    }
  });
}

// TODO: implement different bird types (red bird, yellow bird, etc.)
