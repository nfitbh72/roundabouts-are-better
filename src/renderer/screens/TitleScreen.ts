import { Button } from '../types';
import { CanvasUtils } from '../utils/canvas';
import { Config } from '../config';

export class TitleScreen {
  private buttons: Button[] = [];
  private hoveredButton: Button | null = null;

  constructor(
    private onPlay: () => void,
    private onSettings: () => void,
    private onExit: () => void
  ) {}

  initialize(width: number, height: number): void {
    const buttonWidth = Config.title.button.width;
    const buttonHeight = Config.title.button.height;
    const buttonSpacing = Config.title.button.spacing;
    const centerX = width / 2 - buttonWidth / 2;
    const startY = height / 2 + Config.title.buttonOffsetY;

    this.buttons = [
      {
        x: centerX,
        y: startY,
        width: buttonWidth,
        height: buttonHeight,
        text: 'Play',
        onClick: this.onPlay,
      },
      {
        x: centerX,
        y: startY + buttonHeight + buttonSpacing,
        width: buttonWidth,
        height: buttonHeight,
        text: 'Settings',
        onClick: this.onSettings,
      },
      {
        x: centerX,
        y: startY + (buttonHeight + buttonSpacing) * 2,
        width: buttonWidth,
        height: buttonHeight,
        text: 'Exit',
        onClick: this.onExit,
      },
    ];
  }

  render(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    CanvasUtils.clearScreen(ctx, width, height);

    // Draw title
    CanvasUtils.drawText(
      ctx,
      Config.title.titleText,
      width / 2,
      height / 2 + Config.title.titleOffsetY,
      Config.title.titleFontSize,
      Config.title.titleColor,
      'center'
    );

    // Draw buttons
    this.buttons.forEach((button) => {
      const isHovered = this.hoveredButton === button;
      CanvasUtils.drawButton(
        ctx,
        button.x,
        button.y,
        button.width,
        button.height,
        button.text,
        isHovered
      );
    });
  }

  update(deltaTime: number): void {
    // No update logic needed for title screen
  }

  handleMouseMove(x: number, y: number): void {
    this.hoveredButton = null;
    for (const button of this.buttons) {
      if (
        CanvasUtils.isPointInRect(x, y, button.x, button.y, button.width, button.height)
      ) {
        this.hoveredButton = button;
        break;
      }
    }
  }

  handleClick(x: number, y: number): void {
    for (const button of this.buttons) {
      if (
        CanvasUtils.isPointInRect(x, y, button.x, button.y, button.width, button.height)
      ) {
        button.onClick();
        break;
      }
    }
  }
}
