import { GameState } from './types';
import { IntroScreen } from './screens/IntroScreen';
import { TitleScreen } from './screens/TitleScreen';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: GameState = GameState.INTRO;
  private lastTime: number = 0;

  // Screens
  private introScreen: IntroScreen;
  private titleScreen: TitleScreen;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;

    // Initialize screens
    this.introScreen = new IntroScreen();
    this.titleScreen = new TitleScreen(
      () => this.handlePlay(),
      () => this.handleSettings(),
      () => this.handleExit()
    );

    this.setupCanvas();
    this.setupInputHandlers();
    this.titleScreen.initialize(this.canvas.width, this.canvas.height);
  }

  private setupCanvas(): void {
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.titleScreen.initialize(this.canvas.width, this.canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();
  }

  private setupInputHandlers(): void {
    // Keyboard input
    window.addEventListener('keydown', (e) => {
      if (this.state === GameState.INTRO) {
        if (e.key === ' ' || e.key === 'Enter') {
          this.introScreen.skipToEnd();
          this.transitionToTitle();
        }
      }
    });

    // Mouse input
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (this.state === GameState.INTRO) {
        this.introScreen.skipToEnd();
        this.transitionToTitle();
      } else if (this.state === GameState.TITLE) {
        this.titleScreen.handleClick(x, y);
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (this.state === GameState.TITLE) {
        this.titleScreen.handleMouseMove(x, y);
      }
    });
  }

  private transitionToTitle(): void {
    this.state = GameState.TITLE;
  }

  private handlePlay(): void {
    // TODO: Implement play functionality
    console.log('Play button clicked - not implemented yet');
  }

  private handleSettings(): void {
    // TODO: Implement settings screen
    console.log('Settings button clicked - not implemented yet');
  }

  private handleExit(): void {
    // Close the Electron application
    const api = (window as any).api;
    if (api && api.quit) {
      api.quit();
    } else {
      console.log('Exit requested');
      window.close();
    }
  }

  start(): void {
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  private gameLoop(currentTime: number): void {
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number): void {
    switch (this.state) {
      case GameState.INTRO:
        this.introScreen.update(deltaTime);
        // Auto-transition to title screen when intro is complete
        if (this.introScreen.isIntroComplete()) {
          this.transitionToTitle();
        }
        break;
      case GameState.TITLE:
        this.titleScreen.update(deltaTime);
        break;
      case GameState.SETTINGS:
        // TODO: Settings screen update
        break;
      case GameState.PLAYING:
        // TODO: Game update
        break;
    }
  }

  private render(): void {
    switch (this.state) {
      case GameState.INTRO:
        this.introScreen.render(this.ctx, this.canvas.width, this.canvas.height);
        break;
      case GameState.TITLE:
        this.titleScreen.render(this.ctx, this.canvas.width, this.canvas.height);
        break;
      case GameState.SETTINGS:
        // TODO: Settings screen render
        break;
      case GameState.PLAYING:
        // TODO: Game render
        break;
    }
  }
}
