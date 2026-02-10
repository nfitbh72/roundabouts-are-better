// Game state enum
export enum GameState {
  INTRO,
  TITLE,
  SETTINGS,
  PLAYING,
}

// Button interface for clickable UI elements
export interface Button {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  onClick: () => void;
}
