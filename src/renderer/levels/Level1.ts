import { BaseLevel } from './BaseLevel';
import { LevelPhase, LevelConfig } from '../types';
import { CanvasUtils } from '../utils/canvas';

/**
 * Level 1
 */
export class Level1 extends BaseLevel {
  constructor() {
    const config: LevelConfig = {
      levelNumber: 1,
      targetScore: 100,
    };
    super(config);
  }

  // Configure phase - setup level parameters
  protected updateConfigure(deltaTime: number): void {
    // Configuration update logic here
  }

  protected renderConfigure(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    CanvasUtils.clearScreen(ctx, width, height);

    // Draw configure screen
    CanvasUtils.drawText(
      ctx,
      `Level ${this.config.levelNumber} - Configure`,
      width / 2,
      100,
      32,
      '#ffffff',
      'center'
    );

    CanvasUtils.drawText(
      ctx,
      `Target Score: ${this.config.targetScore}`,
      width / 2,
      150,
      24,
      '#ffffff',
      'center'
    );
  }

  protected handleConfigureClick(x: number, y: number): void {
    // Handle configure clicks
  }

  protected handleConfigureMouseMove(x: number, y: number): void {
    // Handle configure mouse move
  }

  // Simulate phase - run the level simulation
  protected updateSimulate(deltaTime: number): void {
    // Simulation update logic here
  }

  protected renderSimulate(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    CanvasUtils.clearScreen(ctx, width, height);

    // Draw simulation screen
    CanvasUtils.drawText(
      ctx,
      `Level ${this.config.levelNumber} - Simulating`,
      width / 2,
      100,
      32,
      '#ffffff',
      'center'
    );

    CanvasUtils.drawText(
      ctx,
      `Score: ${this.currentScore} / ${this.config.targetScore}`,
      width / 2,
      150,
      24,
      '#ffffff',
      'center'
    );
  }

  protected handleSimulateClick(x: number, y: number): void {
    // Handle simulate clicks
  }

  protected handleSimulateMouseMove(x: number, y: number): void {
    // Handle simulate mouse move
  }

  // Complete phase - show results
  protected updateComplete(deltaTime: number): void {
    // Complete update logic here
  }

  protected renderComplete(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    CanvasUtils.clearScreen(ctx, width, height);

    const result = this.getResult();

    // Draw complete screen
    CanvasUtils.drawText(
      ctx,
      `Level ${this.config.levelNumber} - Complete`,
      width / 2,
      100,
      32,
      '#ffffff',
      'center'
    );

    CanvasUtils.drawText(
      ctx,
      `Final Score: ${result.score} / ${this.config.targetScore}`,
      width / 2,
      150,
      24,
      '#ffffff',
      'center'
    );

    CanvasUtils.drawText(
      ctx,
      result.passed ? 'PASSED!' : 'FAILED',
      width / 2,
      200,
      32,
      result.passed ? '#00ff00' : '#ff0000',
      'center'
    );
  }

  protected handleCompleteClick(x: number, y: number): void {
    // Handle complete clicks
  }

  protected handleCompleteMouseMove(x: number, y: number): void {
    // Handle complete mouse move
  }
}
