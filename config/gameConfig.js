export const GAME_CONFIG = {
  width: window.innerWidth,
  height: window.innerHeight,
  background: 'img/background.png',
  textures: {
    slingGround: {
      src: 'img/birdsGround.png',
      scaleX: 0.5,  // Ajusta estos valores para cambiar el tamaño
      scaleY: 0.3   // Valores más pequeños = imagen más pequeña
    }
  },
  world: {
    gravity: { y: 1 }
  },
  colors: {
    slingBase: '#8b6113ff',
    projectile: '#FF4444',
    slingGround: '#654321',
    targetGround: '#8b7355'
  },
  structures: {
    slingGround: { x: 200, y: 490, w: 250, h: 25 },
    targetGround: { x: 1000, y: 525, w: 600, h: 25 }
  },
  sling: {
    base: { x: 300, y: 450, w: 20, h: 80 },
    projectile: { x: 300, y: 350, r: 15 },
    stiffness: 0.05,
    length: 80,
    line: { width: 3, color: '#b31111ff' },
    minPullDistance: 20,
    forceMultiplier: 0.0007,
    maxForce: 0.3
  },
  woodenStructures: {
    colors: {
      plank: '#D2691E',
      pillar: '#CD853F',
      block: '#A0522D'
    },
    sizes: {
      plankLength: 80,
      pillarHeight: 60,
      blockSize: 25
    }
  },
  pigs: {
    colors: {
      small: '#98FB98',
      medium: '#90EE90',
      large: '#7CFC00'
    },
    sizes: {
      small: 15,
      medium: 20,
      large: 28
    }
  },
  level: {
    // Posiciones de las estructuras sobre targetGround (y=525)
    structures: [
      // Primera torre (izquierda)
      { type: 'pillar', x: 900, y: 495 },
      { type: 'pillar', x: 950, y: 495 },
      { type: 'plank', x: 925, y: 465 },
      { type: 'block', x: 925, y: 440 },
      
      // Segunda torre (centro)
      { type: 'pillar', x: 1000, y: 485 },
      { type: 'pillar', x: 1050, y: 485 },
      { type: 'plank', x: 1025, y: 455 },
      { type: 'pillar', x: 1025, y: 425 },
      { type: 'block', x: 1025, y: 400 },
      
      // Tercera torre (derecha)
      { type: 'pillar', x: 1100, y: 495 },
      { type: 'pillar', x: 1150, y: 495 },
      { type: 'plank', x: 1125, y: 465 },
      { type: 'block', x: 1125, y: 440 }
    ],
    // Portfolio pigs - these unlock navigation buttons when destroyed
    portfolioPigs: [
      { 
        type: 'portfolio', 
        section: 'proyectos', 
        x: 850, 
        y: 500, 
        color: '#FF6B6B',
        label: '💼'
      },
      { 
        type: 'portfolio', 
        section: 'experiencia', 
        x: 1050, 
        y: 350, 
        color: '#4ECDC4',
        label: '🏆'
      },
      { 
        type: 'portfolio', 
        section: 'habilidades', 
        x: 1250, 
        y: 480, 
        color: '#45B7D1',
        label: '⚡'
      },
      { 
        type: 'portfolio', 
        section: 'sobre-mi', 
        x: 800, 
        y: 450, 
        color: '#96CEB4',
        label: '👨‍💻'
      },
      { 
        type: 'portfolio', 
        section: 'contacto', 
        x: 1300, 
        y: 500, 
        color: '#FFEAA7',
        label: '📧'
      }
    ]
  }
};