/**
 * Represents a 2D position with x and y coordinates. Typically used for
 * tracking the position of UI elements, cursor, or scroll positions.
 */
export interface Position {
  x: number;
  y: number;
};

/**
 * Enum representing `CSS class selectors` used across the application.
 * Helps avoid hardcoded strings and provides better maintainability
 * and type safety when querying or manipulating DOM elements.
 *
 * Each value corresponds to a specific UI component or element.
 *
 * @example
 * ```ts
 * const closeBtn: document.querySelector(`.${Selector.CLOSE_BTN}`);
 * ```
 */
export const Selector = {
  ARROW_BTN: 'arrow-btn',
  BOARD_GRID: 'board-grid',
  BODY: 'body',
  CLOSE_BTN: 'close-btn',
  FOOTER: 'footer',
  GAME_2048: 'game-2048',
  GAME_BOARD: 'game-board',
  GAME_LAYOUT: 'game-layout',
  GRID_CELL: 'grid-cell',
  GRID_ROW: 'grid-row',
  HEADER: 'app-header',
  HIDE_ELEMENT: 'hide-element',
  HIDE_MODAL: 'hide-modal',
  IMAGE_FRAME: 'image-frame',
  IMAGE_WRAPPER: 'image-wrapper',
  JS_BEST_SCORE: 'js-best-score',
  JS_BUTTON: 'js-button',
  JS_GAME_SCORE: 'js-game-score',
  MODAL_BTN: 'modal-btn',
  MODAL_OPEN: 'modal-open',
  MODAL_WRAPPER: 'modal-wrapper',
  PAGE_MODAL: 'page-modal',
  PLAY_AGAIN_BTN: 'play-again-btn',
  REPLY_BTN: 'replay-btn',
  SCORE_VALUE: 'score-value',
  SCROLL_HIDDEN: 'scroll-hidden',
  TILE_UPDATED: 'tile-updated',
};

/**
 * Enum of common DOM event types used for event listeners.
 * Centralizes event names for type safety and consistency.
 */
export const Event = {
  ANIMATION_END: 'animationend',
  ARIA_HIDDEN: 'aria-hidden',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  CLICK: 'click',
  KEY_DOWN: 'keydown',
  ON_COMPLETE: 'onComplete',
  ON_REVERSE_COMPLETE: 'onReverseComplete',
  REFRESH: 'refresh',
  RESIZE: 'resize',
  SCROLL: 'scroll',
  TOUCH_END: 'touchend',
  TRANSFORM: 'transform',
  TRANSITION_END: 'transitionend',
} as const;

/**
 * Enum representing responsive design breakpoints in pixels. These values
 * define the screen width thresholds used to adapt layout and styling for
 * different device types.
 */
export const Breakpoint = {
  MOBILE: 600,
  MOBILE_LANDSCAPE: 650,
  TABLET: 1024,
};

/**
 * Enum listing CSS properties for dynamic style manipulation. Useful for
 * animations, responsive design, or inline style changes via JS.
 */
export const CSSProperty = {
  FONT_SIZE: 'font-size',
  OPACITY: 'opacity',
  PADDING_BOTTOM: 'padding-bottom',
  PADDING_LEFT: 'padding-left',
  PADDING_TOP: 'padding-top',
  PADDING_RIGHT: 'padding-right',
  POSITION: 'position',
  POSITION_FIXED: 'fixed',
  SCALE: 'scale',
  TRANSLATE_X: 'translateX',
  TRANSLATE_Y: 'translateY',
  WIDTH: 'width',
};
