import { GAME_CONFIG } from '../config/gameConfig.js';
import { distance } from '../utils/helpers.js';

const { Engine, Render, Runner, Bodies, Composite, Constraint, Mouse, MouseConstraint, Events, Body } = Matter;

export function createSling(world, birdQueue) {
  const cfg = GAME_CONFIG.sling;
  const colors = GAME_CONFIG.colors;

  const slingBase = Bodies.rectangle(cfg.base.x, cfg.base.y, cfg.base.w, cfg.base.h, {
    isStatic: true,
    render: { fillStyle: colors.slingBase },
    collisionFilter: {
      group: -1  // Negative group = no collision with same group
    }
  });

  // Get the current bird from the queue instead of creating a new one
  let currentBird = birdQueue.getCurrentBird();
  let slingConstraint = null;

  // Create constraint with current bird
  if (currentBird) {
    slingConstraint = createSlingConstraint(slingBase, currentBird.body, cfg);
  }

  Composite.add(world, [slingBase]);
  if (slingConstraint) {
    Composite.add(world, slingConstraint);
  }

  function createSlingConstraint(base, bird, config) {
    return Constraint.create({
      bodyA: base,
      pointA: { x: 0, y: -config.base.h / 2 }, // Punto en la parte superior de la base
      bodyB: bird,
      stiffness: config.stiffness,
      length: config.length,
      render: {
        lineWidth: config.line.width,
        strokeStyle: config.line.color
      }
    });
  }

  function loadNextBird() {
    // Remove current constraint if exists
    if (slingConstraint) {
      Composite.remove(world, slingConstraint);
      slingConstraint = null;
    }

    // Get next bird from queue
    currentBird = birdQueue.nextBird();
    
    if (currentBird) {
      // Create new constraint with the new bird
      slingConstraint = createSlingConstraint(slingBase, currentBird.body, cfg);
      Composite.add(world, slingConstraint);
      state.canLaunch = true;
      state.isDragging = false;
      return true;
    } else {
      // No more birds available
      state.canLaunch = false;
      console.log('No hay más pájaros disponibles');
      return false;
    }
  }

  function getCurrentProjectile() {
    return currentBird ? currentBird.body : null;
  }

  const state = {
    isDragging: false,
    canLaunch: currentBird !== null,
    loadNextBird,
    getCurrentProjectile,
    slingBase,
    get slingConstraint() { return slingConstraint; },
    get currentBird() { return currentBird; }
  };

  return state;
}

export function attachMouse(engine, render, world, slingState) {
  const cfg = GAME_CONFIG.sling;
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, render: { visible: false } }
  });
  Composite.add(world, mouseConstraint);
  render.mouse = mouse;

  Events.on(mouseConstraint, 'startdrag', (e) => {
    const currentProjectile = slingState.getCurrentProjectile();
    if (e.body === currentProjectile && slingState.canLaunch) {
      slingState.isDragging = true;
    }
  });

  Events.on(mouseConstraint, 'enddrag', (e) => {
    const currentProjectile = slingState.getCurrentProjectile();
    if (e.body !== currentProjectile || !slingState.isDragging || !slingState.canLaunch) return;
    
    slingState.isDragging = false;
    slingState.canLaunch = false;

    // Calcular la distancia desde la parte superior de la base (punto de anclaje de la constraint)
    const anchorX = slingState.slingBase.position.x;
    const anchorY = slingState.slingBase.position.y - cfg.base.h / 2; // Parte superior de la base
    const dx = anchorX - currentProjectile.position.x;
    const dy = anchorY - currentProjectile.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > cfg.minPullDistance) {
      // Remove the sling constraint
      if (slingState.slingConstraint) {
        Composite.remove(world, slingState.slingConstraint);
      }
      
      // Launch the bird
      const launchForce = Math.min(dist * cfg.forceMultiplier, cfg.maxForce);
      const ndx = dx / dist;
      const ndy = dy / dist;
      Body.applyForce(currentProjectile, currentProjectile.position, { 
        x: ndx * launchForce, 
        y: ndy * launchForce 
      });

      // After a short delay, load the next bird
      setTimeout(() => {
        slingState.loadNextBird();
      }, 2000); // Wait 2 seconds before loading next bird
      
    } else {
      // If not pulled enough, allow launching again
      slingState.canLaunch = true;
    }
  });

  return mouseConstraint;
}
