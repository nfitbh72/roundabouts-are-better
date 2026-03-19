import { BaseLevel } from './BaseLevel';
import { Level1 } from './Level1';

/**
 * Manages level creation and progression
 */
export class LevelManager {
  private currentLevel: BaseLevel | null = null;
  private currentLevelNumber: number = 1;

  /**
   * Load a specific level
   */
  loadLevel(levelNumber: number): BaseLevel {
    this.currentLevelNumber = levelNumber;

    switch (levelNumber) {
      case 1:
        this.currentLevel = new Level1();
        break;
      default:
        throw new Error(`Level ${levelNumber} not found`);
    }

    return this.currentLevel;
  }

  /**
   * Get the current level
   */
  getCurrentLevel(): BaseLevel | null {
    return this.currentLevel;
  }

  /**
   * Get the current level number
   */
  getCurrentLevelNumber(): number {
    return this.currentLevelNumber;
  }

  /**
   * Check if there's a next level
   */
  hasNextLevel(): boolean {
    // For now, only level 1 exists
    return false;
  }

  /**
   * Load the next level
   */
  loadNextLevel(): BaseLevel {
    return this.loadLevel(this.currentLevelNumber + 1);
  }
}
