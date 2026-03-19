// Game state enum
export enum GameState {
  INTRO,
  TITLE,
  SETTINGS,
  PLAYING,
}

// Level phase enum
export enum LevelPhase {
  CONFIGURE,
  SIMULATE,
  COMPLETE,
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

// Level configuration interface
export interface LevelConfig {
  levelNumber: number;
  targetScore: number;
}

// Level result interface
export interface LevelResult {
  score: number;
  passed: boolean;
}
