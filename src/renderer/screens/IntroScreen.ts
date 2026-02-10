import { CanvasUtils } from '../utils/canvas';
import { Config } from '../config';

export class IntroScreen {
  private introLines: string[] = [];
  private currentLineIndex: number = 0;
  private lineTimer: number = 0;
  private alpha: number = 0;

  // Timing constants from config
  private readonly FADE_IN_TIME = Config.intro.fadeInTime;
  private readonly DISPLAY_TIME = Config.intro.displayTime;
  private readonly FADE_OUT_TIME = Config.intro.fadeOutTime;
  private readonly TOTAL_LINE_TIME = this.FADE_IN_TIME + this.DISPLAY_TIME + this.FADE_OUT_TIME;

  private isComplete: boolean = false;

  constructor() {
    this.loadIntroText();
  }

  private async loadIntroText(): Promise<void> {
    try {
      const response = await fetch(Config.intro.textFilePath);
      const text = await response.text();
      // Split by newlines and filter out empty lines
      this.introLines = text.split('\n').filter(line => line.trim().length > 0);
    } catch (error) {
      console.error('Failed to load intro text:', error);
      this.introLines = ['Failed to load intro text. Press any key to continue.'];
    }
  }

  render(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    CanvasUtils.clearScreen(ctx, width, height);

    if (this.introLines.length === 0) return;

    const currentLine = this.introLines[this.currentLineIndex];

    // Apply alpha to the canvas context
    ctx.save();
    ctx.globalAlpha = this.alpha;

    CanvasUtils.drawText(
      ctx,
      currentLine,
      width / 2,
      height / 2,
      Config.intro.fontSize,
      Config.intro.textColor,
      'center'
    );

    ctx.restore();
  }

  update(deltaTime: number): void {
    if (this.introLines.length === 0 || this.isComplete) return;

    this.lineTimer += deltaTime;

    // Calculate alpha based on current time in the line cycle
    if (this.lineTimer < this.FADE_IN_TIME) {
      // Fading in
      this.alpha = this.lineTimer / this.FADE_IN_TIME;
    } else if (this.lineTimer < this.FADE_IN_TIME + this.DISPLAY_TIME) {
      // Fully visible
      this.alpha = 1.0;
    } else if (this.lineTimer < this.TOTAL_LINE_TIME) {
      // Fading out
      const fadeOutProgress = (this.lineTimer - this.FADE_IN_TIME - this.DISPLAY_TIME) / this.FADE_OUT_TIME;
      this.alpha = 1.0 - fadeOutProgress;
    } else {
      // Move to next line
      this.currentLineIndex++;
      this.lineTimer = 0;
      this.alpha = 0;

      // Check if we've shown all lines
      if (this.currentLineIndex >= this.introLines.length) {
        this.isComplete = true;
        this.alpha = 0;
      }
    }
  }

  isIntroComplete(): boolean {
    return this.isComplete;
  }

  skipToEnd(): void {
    this.isComplete = true;
    this.alpha = 0;
  }
}
