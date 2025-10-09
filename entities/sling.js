import { GAME_CONFIG } from '../config/gameConfig.js';
import { distance } from '../utils/helpers.js';

const { Engine, Render, Runner, Bodies, Composite, Constraint, Mouse, MouseConstraint, Events, Body } = Matter;

export function createSling(world) {
  const cfg = GAME_CONFIG.sling;
  const colors = GAME_CONFIG.colors;

  const slingBase = Bodies.rectangle(cfg.base.x, cfg.base.y, cfg.base.w, cfg.base.h, {
    isStatic: true,
    render: { fillStyle: colors.slingBase }
  });

  const projectile = Bodies.circle(cfg.projectile.x, cfg.projectile.y, cfg.projectile.r, {
    density: 0.001,
    frictionAir: 0.005,
    restitution: 0.8,
    render: { fillStyle: colors.projectile }
  });

  const slingConstraint = Constraint.create({
    bodyA: slingBase,
    bodyB: projectile,
    stiffness: cfg.stiffness,
    length: cfg.length,
    render: {
      lineWidth: cfg.line.width,
      strokeStyle: cfg.line.color
    }
  });

  Composite.add(world, [slingBase, projectile, slingConstraint]);

  function reset() {
    Body.setPosition(projectile, { x: cfg.projectile.x, y: cfg.projectile.y });
    Body.setVelocity(projectile, { x: 0, y: 0 });
    Body.setAngularVelocity(projectile, 0);
    if (!world.constraints.includes(slingConstraint)) {
      Composite.add(world, slingConstraint);
    }
    state.canLaunch = true;
    state.isDragging = false;
  }

  const state = {
    isDragging: false,
    canLaunch: true,
    reset,
    projectile,
    slingBase,
    slingConstraint
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
    if (e.body === slingState.projectile && slingState.canLaunch) slingState.isDragging = true;
  });

  Events.on(mouseConstraint, 'enddrag', (e) => {
    if (e.body !== slingState.projectile || !slingState.isDragging || !slingState.canLaunch) return;
    slingState.isDragging = false;
    slingState.canLaunch = false;

    const dx = slingState.slingBase.position.x - slingState.projectile.position.x;
    const dy = slingState.slingBase.position.y - slingState.projectile.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > cfg.minPullDistance) {
      Composite.remove(world, slingState.slingConstraint);
      const launchForce = Math.min(dist * cfg.forceMultiplier, cfg.maxForce);
      const ndx = dx / dist;
      const ndy = dy / dist;
      Body.applyForce(slingState.projectile, slingState.projectile.position, { x: ndx * launchForce, y: ndy * launchForce });
      // console.log('Launch', launchForce, ndx, ndy);
    } else {
      slingState.canLaunch = true;
    }
  });

  return mouseConstraint;
}
