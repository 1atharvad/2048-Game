export interface Position {
  x: number;
  y: number;
};

export enum Selector {
  BOARD_GRID = 'board-grid',
  GRID_CELL = 'grid-cell',
  GRID_ROW = 'grid-row',
  JS_BEST_SCORE = 'js-best-score',
  JS_GAME_SCORE = 'js-game-score',
  SCORE_VALUE = 'score-value',
  TILE_UPDATED = 'tile-updated',
};

export enum Event {
  ANIMATION_END = 'animationend',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  ARROW_UP = 'ArrowUp',
  KEY_DOWN = 'keydown',
};
