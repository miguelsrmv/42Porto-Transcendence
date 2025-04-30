export interface GameArea {
  canvas: HTMLCanvasElement | null;
  context?: CanvasRenderingContext2D | null;
  start(): void;
  clear(): void;
  stop(): void;
}

export interface Ball {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  radius: number;
  speedX: number;
  speedY: number;
  isVisible: boolean;
}

export interface Paddle {
  width: number;
  height: number;
  color: string;
  x: number;
  y: number;
  speedY: number;
  speedModifier: number;
}

export interface GameState {
  ball: Ball;
  fakeBalls: Ball[];
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  leftPowerBarFill: number;
  rightPowerBarFill: number;
  leftAnimation: boolean;
  rightAnimation: boolean;
}
