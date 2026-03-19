import { LevelPhase, LevelConfig, LevelResult } from '../types';

/**
 * Base class for all levels
 * Handles the common level lifecycle: configure -> simulate -> complete
 */
export abstract class BaseLevel {
  protected phase: LevelPhase = LevelPhase.CONFIGURE;
  protected config: LevelConfig;
  protected currentScore: number = 0;

  constructor(config: LevelConfig) {
    this.config = config;
  }

  /**
   * Update logic for the level
   */
  update(deltaTime: number): void {
    switch (this.phase) {
      case LevelPhase.CONFIGURE:
        this.updateConfigure(deltaTime);
        break;
      case LevelPhase.SIMULATE:
        this.updateSimulate(deltaTime);
        break;
      case LevelPhase.COMPLETE:
        this.updateComplete(deltaTime);
        break;
    }
  }

  /**
   * Render logic for the level
   */
  render(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    switch (this.phase) {
      case LevelPhase.CONFIGURE:
        this.renderConfigure(ctx, width, height);
        break;
      case LevelPhase.SIMULATE:
        this.renderSimulate(ctx, width, height);
        break;
      case LevelPhase.COMPLETE:
        this.renderComplete(ctx, width, height);
        break;
    }
  }

  /**
   * Handle mouse click events
   */
  handleClick(x: number, y: number): void {
    switch (this.phase) {
      case LevelPhase.CONFIGURE:
        this.handleConfigureClick(x, y);
        break;
      case LevelPhase.SIMULATE:
        this.handleSimulateClick(x, y);
        break;
      case LevelPhase.COMPLETE:
        this.handleCompleteClick(x, y);
        break;
    }
  }

  /**
   * Handle mouse move events
   */
  handleMouseMove(x: number, y: number): void {
    switch (this.phase) {
      case LevelPhase.CONFIGURE:
        this.handleConfigureMouseMove(x, y);
        break;
      case LevelPhase.SIMULATE:
        this.handleSimulateMouseMove(x, y);
        break;
      case LevelPhase.COMPLETE:
        this.handleCompleteMouseMove(x, y);
        break;
    }
  }

  /**
   * Get the current phase
   */
  getPhase(): LevelPhase {
    return this.phase;
  }

  /**
   * Get the level result
   */
  getResult(): LevelResult {
    return {
      score: this.currentScore,
      passed: this.currentScore >= this.config.targetScore,
    };
  }

  /**
   * Check if level is complete
   */
  isComplete(): boolean {
    return this.phase === LevelPhase.COMPLETE;
  }

  // Abstract methods that must be implemented by child classes
  protected abstract updateConfigure(deltaTime: number): void;
  protected abstract updateSimulate(deltaTime: number): void;
  protected abstract updateComplete(deltaTime: number): void;

  protected abstract renderConfigure(ctx: CanvasRenderingContext2D, width: number, height: number): void;
  protected abstract renderSimulate(ctx: CanvasRenderingContext2D, width: number, height: number): void;
  protected abstract renderComplete(ctx: CanvasRenderingContext2D, width: number, height: number): void;

  protected abstract handleConfigureClick(x: number, y: number): void;
  protected abstract handleSimulateClick(x: number, y: number): void;
  protected abstract handleCompleteClick(x: number, y: number): void;

  protected abstract handleConfigureMouseMove(x: number, y: number): void;
  protected abstract handleSimulateMouseMove(x: number, y: number): void;
  protected abstract handleCompleteMouseMove(x: number, y: number): void;
}
