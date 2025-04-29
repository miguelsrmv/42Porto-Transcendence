export interface GameArea {
  canvas: HTMLCanvasElement | null;
  context?: CanvasRenderingContext2D | null;
  start(): void;
  clear(): void;
  stop(): void;
}

export interface GameState {
  ball: { x: number; y: number; radius: number; speedY: number; speedX: number };
  leftPaddle: {
    x: number;
    y: number;
    height: number;
    width: number;
    color: string;
    speedY: number;
    speedModifier: number;
  };
  rightPaddle: {
    x: number;
    y: number;
    height: number;
    width: number;
    color: string;
    speedY: number;
    speedModifier: number;
  };
}
