import { GAME_CONFIG } from '../config/gameConfig.js';
import { createBird } from './birds.js';

const { Composite, Body } = Matter;

/**
 * Manages the queue of birds waiting to be launched
 */
export class BirdQueue {
  constructor(world) {
    this.world = world;
    this.config = GAME_CONFIG.birdQueue;
    this.birds = [];
    this.currentBirdIndex = 0;
    this.isGameOver = false;
    
    this.initializeBirds();
  }

  /**
   * Creates and positions all birds in the queue
   */
  initializeBirds() {
    for (let i = 0; i < this.config.totalBirds; i++) {
      // Invertir el orden: el último pájaro (índice más alto) está más cerca de la honda
      const reverseIndex = this.config.totalBirds - 1 - i;
      const x = this.config.startX + (reverseIndex * this.config.spacing);
      const y = this.config.startY;
      const color = this.config.colors[i] || this.config.colors[0];
      
      const bird = createBird(x, y, this.config.radius, color);
      
      // Mark waiting birds as static so they don't fall or move
      // El primer pájaro (índice 0) es el activo
      if (i > 0) {
        Body.setStatic(bird, true);
      }
      
      this.birds.push({
        body: bird,
        originalPosition: { x, y },
        isActive: i === 0,
        isUsed: false,
        queueIndex: i
      });
      
      Composite.add(this.world, bird);
    }
  }

  /**
   * Gets the current active bird (the one that can be launched)
   * @returns {Matter.Body|null} The current bird body or null if no birds left
   */
  getCurrentBird() {
    if (this.isGameOver || this.currentBirdIndex >= this.birds.length) {
      return null;
    }
    return this.birds[this.currentBirdIndex];
  }

  /**
   * Moves to the next bird in the queue
   * @returns {Matter.Body|null} The next bird body or null if no more birds
   */
  nextBird() {
    // Mark current bird as used
    if (this.currentBirdIndex < this.birds.length) {
      this.birds[this.currentBirdIndex].isUsed = true;
      this.birds[this.currentBirdIndex].isActive = false;
    }

    this.currentBirdIndex++;

    // Check if game is over
    if (this.currentBirdIndex >= this.birds.length) {
      this.isGameOver = true;
      console.log('¡No quedan más pájaros! Juego terminado.');
      return null;
    }

    // Activate next bird and move it to sling position
    const nextBird = this.birds[this.currentBirdIndex];
    nextBird.isActive = true;
    
    // Make the bird dynamic (not static) so it can be launched
    Body.setStatic(nextBird.body, false);
    
    // Move bird to sling position
    const slingConfig = GAME_CONFIG.sling;
    Body.setPosition(nextBird.body, { 
      x: slingConfig.projectile.x, 
      y: slingConfig.projectile.y 
    });
    Body.setVelocity(nextBird.body, { x: 0, y: 0 });
    Body.setAngularVelocity(nextBird.body, 0);

    // Move remaining birds forward in the queue
    this.updateQueuePositions();

    return nextBird;
  }

  /**
   * Updates the visual positions of birds in the queue
   */
  updateQueuePositions() {
    for (let i = this.currentBirdIndex + 1; i < this.birds.length; i++) {
      const bird = this.birds[i];
      // Calcular cuántos pájaros quedan después del actual
      const birdsRemaining = this.birds.length - this.currentBirdIndex - 1;
      // Calcular la posición del pájaro en la cola restante (invertido)
      const positionInQueue = this.birds.length - 1 - i;
      const newX = this.config.startX + (positionInQueue * this.config.spacing);
      
      // Smoothly move bird to new position
      Body.setPosition(bird.body, { 
        x: newX, 
        y: this.config.startY 
      });
    }
  }

  /**
   * Gets the number of remaining birds
   * @returns {number} Number of birds left to launch
   */
  getRemainingBirds() {
    return Math.max(0, this.config.totalBirds - this.currentBirdIndex);
  }

  /**
   * Checks if the game is over (no more birds)
   * @returns {boolean} True if no more birds available
   */
  isGameComplete() {
    return this.isGameOver;
  }

  /**
   * Resets the bird queue to initial state
   */
  reset() {
    // Remove all existing birds from world
    this.birds.forEach(bird => {
      Composite.remove(this.world, bird.body);
    });

    // Reset state
    this.birds = [];
    this.currentBirdIndex = 0;
    this.isGameOver = false;

    // Reinitialize birds
    this.initializeBirds();
  }

  /**
   * Gets information about all birds for debugging/UI
   * @returns {Array} Array with bird status information
   */
  getBirdStatus() {
    return this.birds.map((bird, index) => ({
      index,
      isActive: bird.isActive,
      isUsed: bird.isUsed,
      position: bird.body.position,
      queueIndex: bird.queueIndex
    }));
  }
}