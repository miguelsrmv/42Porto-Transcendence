export interface GameArea {
  canvas: HTMLCanvasElement | null;
  context?: CanvasRenderingContext2D | null;
  interval?: number;
  start(): void;
  clear(): void;
  stop(): void;
}
