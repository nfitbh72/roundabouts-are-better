// Canvas utility functions for common drawing operations
import { Config } from '../config';

export class CanvasUtils {
  static drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number = 24,
    color: string = '#ffffff',
    align: CanvasTextAlign = 'center'
  ): void {
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${Config.text.fontFamily}`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
  }

  static drawMultilineText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number = 24,
    lineHeight: number = 1.5,
    color: string = '#ffffff',
    align: CanvasTextAlign = 'center'
  ): void {
    const lines = text.split('\n');
    const totalHeight = lines.length * fontSize * lineHeight;
    const startY = y - totalHeight / 2;

    lines.forEach((line, index) => {
      const lineY = startY + (index * fontSize * lineHeight) + (fontSize / 2);
      this.drawText(ctx, line, x, lineY, fontSize, color, align);
    });
  }

  static drawButton(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    isHovered: boolean = false
  ): void {
    const btnConfig = Config.title.button;

    // Draw button background
    ctx.fillStyle = isHovered ? btnConfig.backgroundColorHover : btnConfig.backgroundColor;
    ctx.fillRect(x, y, width, height);

    // Draw button border
    ctx.strokeStyle = isHovered ? btnConfig.borderColorHover : btnConfig.borderColor;
    ctx.lineWidth = btnConfig.borderWidth;
    ctx.strokeRect(x, y, width, height);

    // Draw button text
    this.drawText(
      ctx,
      text,
      x + width / 2,
      y + height / 2,
      btnConfig.fontSize,
      btnConfig.textColor,
      'center'
    );
  }

  static clearScreen(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.fillStyle = Config.canvas.backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  static isPointInRect(
    px: number,
    py: number,
    x: number,
    y: number,
    width: number,
    height: number
  ): boolean {
    return px >= x && px <= x + width && py >= y && py <= y + height;
  }
}
