export interface ThemeTokens {
  base: string;
  compared: string;
  swapped: string;
  pivot: string;
  highlighted: string;
}

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface Renderer<T> {
  render(ctx: CanvasRenderingContext2D, state: T, theme: ThemeTokens): void;
}
