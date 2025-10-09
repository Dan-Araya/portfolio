export const GAME_CONFIG = {
  width: window.innerWidth,
  height: window.innerHeight,
  background: 'img/background.png',
  world: {
    gravity: { y: 1 }
  },
  colors: {
    slingBase: '#8b6113ff',
    projectile: '#FF4444'
  },
  sling: {
    base: { x: 150, y: 450, w: 20, h: 80 },
    projectile: { x: 150, y: 350, r: 15 },
    stiffness: 0.05,
    length: 80,
    line: { width: 3, color: '#b31111ff' },
    minPullDistance: 20,
    forceMultiplier: 0.001,
    maxForce: 0.3
  }
};
