import {GlobalFunctions} from './global-functions';
import {Event, type Position, Selector, Breakpoint, CSSProperty} from './constants';
import { API_BASE_URL } from './config';
// import {Observer} from '../types/global';

export class Game2048 extends GlobalFunctions {
  arrowBtns: HTMLElement[];
  bestScore: number;
  bestScoreEls: HTMLElement[];
  expectedHeightDiff: number;
  expectedWidthDiff: number;
  gameBoardEl: HTMLElement;
  gameGridEl: HTMLElement;
  gameLayoutEl: HTMLElement;
  gameScoreEls: HTMLElement[];
  gridCellList: HTMLElement[][];
  lockTouch: boolean;
  playAgainBtn: HTMLElement;
  replyBtnEls: HTMLElement[];
  score: number;
  viewportHeight: number;
  viewportWidth: number;

  constructor(gameLayoutEl: HTMLElement) {
    super();
    this.gameLayoutEl = gameLayoutEl;
    this.gameBoardEl = this.gameLayoutEl.querySelector<HTMLElement>(
        `.${Selector.GAME_BOARD}`)!;
    this.gameGridEl = this.gameLayoutEl.querySelector<HTMLElement>(
        `.${Selector.BOARD_GRID}`)!;
    this.gridCellList = Array.from(
        this.gameGridEl.querySelectorAll<HTMLElement>(`.${Selector.GRID_ROW}`))
      .map(row => Array.from(
          row.querySelectorAll<HTMLElement>(`.${Selector.GRID_CELL}`)));
    this.gameScoreEls = Array.from(this.gameLayoutEl.querySelectorAll<HTMLElement>(
        `.${Selector.JS_GAME_SCORE} .${Selector.SCORE_VALUE}`));
    this.bestScoreEls = Array.from(this.gameLayoutEl.querySelectorAll<HTMLElement>(
        `.${Selector.JS_BEST_SCORE} .${Selector.SCORE_VALUE}`));
    this.arrowBtns = Array.from(
        this.gameLayoutEl.querySelectorAll<HTMLElement>(`.${Selector.ARROW_BTN}`));
    this.replyBtnEls = Array.from(
        this.gameLayoutEl.querySelectorAll<HTMLElement>(`.${Selector.REPLY_BTN}`));
    this.playAgainBtn = this.gameLayoutEl.querySelector<HTMLElement>(
        `.${Selector.PLAY_AGAIN_BTN}`)!;
    
    this.score = 0;
    this.bestScore = 0;
    this.viewportHeight = document.documentElement.clientHeight;
    this.viewportWidth = document.documentElement.clientWidth;
    this.expectedHeightDiff = 0;
    this.expectedWidthDiff = 0;
    this.lockTouch = false;
    this.setMinBoardSize();
    this.createGameBoardObserver();
    this.initBoard()
    this.buttonClickEvents();
    this.eventsOnResize();
  }

  /**
   * Initializes/resets the game board i.e. removes all the existing tiles if
   * any, and adds 2 new tiles on the board, and resets/sets the score to 0.
   */
  initBoard() {
    this.getTiles().map(tile => {
      this.toggleTile(tile, 0);
    });
    this.addTile();
    this.addTile();
    this.score = 0;
    this.getBestScore();
  }

  /**
   * Gets the best score from the database and updates the value on the page.
   */
  getBestScore() {
    const requestObj = new XMLHttpRequest();

    requestObj.onreadystatechange = () => {
      if (requestObj.readyState === 4 && requestObj.status === 200) {
        this.bestScore = parseInt(requestObj.responseText, 10);
        this.updateScore();
      }
    };
    requestObj.open('GET', `${API_BASE_URL}/projects/game-2048/api/get-score/`);
    requestObj.send();
  }

  eventsOnPlay(key: string) {
    const keyList = [
      `${Event.ARROW_LEFT}`,
      `${Event.ARROW_UP}`,
      `${Event.ARROW_RIGHT}`,
      `${Event.ARROW_DOWN}`
    ];

    if (keyList.includes(key)) {
      const addNewTile = this.moveTiles(key);
      this.moveTiles(key, false);
      this.updateScore();

      if (addNewTile) {
        this.addTile();
        const emptyTileList = this.getTiles(true);

        if (emptyTileList.length === 0 && !this.sameAdjacentCells()) {
          this.bodyEl.dataset.gameOver = '';
        }
      }
    }
  }

  /**
   * Events which are executed when various buttons on the pages are clicked,
   * such as, when arrow buttons on the keyboard are clicked, or when arrow
   * button on the page are clicked, or reply / play again buttons are clicked.
   */
  buttonClickEvents() {
    document.addEventListener(Event.KEY_DOWN, (event: KeyboardEvent) => {
      if (this.bodyEl.classList.contains(`${Selector.SCROLL_HIDDEN}`)) return;

      event.preventDefault();
      this.eventsOnPlay(event.key);
    });

    this.arrowBtns.map(buttonEl => {
      buttonEl.addEventListener(Event.CLICK, () => {
        const direction = buttonEl.dataset.arrowDirection;

        if (direction) this.eventsOnPlay(
            `Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}`);
      });
    });

    this.replyBtnEls.map(replyBtn => {
      replyBtn.addEventListener(Event.CLICK, this.initBoard.bind(this));
    });

    this.playAgainBtn.addEventListener(Event.CLICK, () => {
      delete this.bodyEl.dataset.gameOver;
      this.initBoard();
    });
  }

  /**
   * Observer for observing the movements made by the finger on the touch
   * screen device for moving the tiles on the game board.
   */
  createGameBoardObserver() {
    (window as any).Observer.create({
      target: this.gameBoardEl,
      type: 'touch,pointer',
      onUp: this.moveTilesOnTouch.bind(this, `${Event.ARROW_UP}`),
      onDown: this.moveTilesOnTouch.bind(this, `${Event.ARROW_DOWN}`),
      onLeft: this.moveTilesOnTouch.bind(this, `${Event.ARROW_LEFT}`),
      onRight: this.moveTilesOnTouch.bind(this, `${Event.ARROW_RIGHT}`),
      tolerance: 40,
      preventDefault: true
    });

    this.gameBoardEl.addEventListener(Event.TOUCH_END, () => {
      this.lockTouch = false;
    });
  }

  /**
   * Executes the tile move event when ties are intended to be moved using
   * fingers in a specific direction.
   * @param direction The direction in which the tiles are to be moved.
   */
  moveTilesOnTouch(direction: string) {
    if (!this.lockTouch) {
      this.eventsOnPlay(direction);
      this.lockTouch = true;
    }
  }

  /**
   * Gets the list of positions where a tile exists, if emptyTiles is false,
   * else it return the positions where there is no tile present.
   * @param emptyTiles The condition to check if empty tiles or non-empty tiles
   *     are top be selected.
   * @return The list of positions where all tile exist or no tiles exists.
   */
  getTiles(emptyTiles = false): Position[] {
    const tiles: Position[] = [];

    this.gridCellList.map((gridRow, rowIndex) => {
      gridRow.map((gridCell, colIndex) => {
        const cellValue = gridCell.innerText;

        if ((emptyTiles && cellValue === '') ||
            (!emptyTiles && cellValue !== '')) {
          tiles.push({x: rowIndex, y: colIndex});
        }
      });
    });

    return tiles;
  }

  /**
   * Gets the value of element located at specific x and y location on the game
   * board grid.
   * @param pos Position from where the element's value is to be retrieved.
   * @return The value at the position in the game grid.
   */
  getCellValue(pos: Position): string {
    return this.gridCellList[pos.x][pos.y].innerText;
  }

  getNextPos(pos: Position,
    arrowEvent: string,
    mergeTiles = true
  ): [Position, number] | null {
    let initPos: number;
    let direction: number;
    let condition: Function;
    let getAdjPos: Function;
    let nextPos: Position | undefined;
    let tileVal: number | undefined;

    switch (arrowEvent) {
      case `${Event.ARROW_LEFT}`:
        initPos = pos.y;
        direction = -1;
        condition = () => initPos >= 0;
        getAdjPos = (value: number) => {
          return {x: pos.x, y: value};
        };
        break;
      case `${Event.ARROW_UP}`:
        initPos = pos.x;
        direction = -1;
        condition = () => initPos >= 0;
        getAdjPos = (value: number) => {
          return {x: value, y: pos.y};
        };
        break;
      case `${Event.ARROW_RIGHT}`:
        initPos = pos.y;
        direction = 1;
        condition = () => initPos < this.gridCellList[pos.x].length;
        getAdjPos = (value: number) => {
          return {x: pos.x, y: value};
        };
        break;
      case `${Event.ARROW_DOWN}`:
        initPos = pos.x;
        direction = 1;
        condition = () => initPos < this.gridCellList.length;
        getAdjPos = (value: number) => {
          return {x: value, y: pos.y};
        };
        break;
      default:
        throw new Error(`Invalid arrow event: ${arrowEvent}`);
    }

    if (!(condition instanceof Function) && !(getAdjPos instanceof Function)) {
      return null;
    }

    for (initPos += direction; condition(); initPos += direction) {
      const adjPos = getAdjPos(initPos);

      if (this.getCellValue(adjPos) !== '') {
        if (this.getCellValue(pos) === this.getCellValue(adjPos) &&
            mergeTiles) {
          tileVal = parseInt(this.getCellValue(pos), 10) * 2;
          this.score += tileVal;
          nextPos = adjPos;
          this.toggleTile(adjPos, 0);
        }
        break;
      }
      tileVal = parseInt(this.getCellValue(pos), 10);
      nextPos = adjPos
    }

    return (nextPos && tileVal) ? [nextPos, tileVal] : null;
  }

  moveTiles(direction: string, mergeTiles = true): boolean {
    const keyList = [`${Event.ARROW_RIGHT}`, `${Event.ARROW_DOWN}`];
    const tiles = keyList.includes(direction)
        ? this.getTiles().reverse()
        : this.getTiles();

    return tiles.map((position) => {
      const data = this.getNextPos(position, direction, mergeTiles);

      if (data instanceof Array) {
        const nextPos = data[0];
        
        if (nextPos !== undefined) {
          this.toggleTile(nextPos, data[1]);
          this.toggleTile(position, 0);
          return true;
        }
      }

      return false;
    }).reduce((prevVal, currVal) => currVal ? currVal : prevVal, false);
  }

  toggleTile(pos: Position, value: number) {
    const tileEl = this.gridCellList[pos.x][pos.y];
    
    if (value !== 0) {
      tileEl.classList.add('tile-' + value);
      tileEl.classList.add(`${Selector.TILE_UPDATED}`);
      tileEl.innerText = `${value}`;

      tileEl.addEventListener(Event.ANIMATION_END, () => {
        tileEl.classList.remove(`${Selector.TILE_UPDATED}`);
      });
    } else {
      tileEl.classList.remove(...[...tileEl.classList].slice(1));
      tileEl.innerText = '';
    }
  }

  addTile() {
    const emptyTileList = this.getTiles(true);
    const position = emptyTileList[Math.floor(
        (Math.random() * emptyTileList.length) + 1) - 1];

    if (position !== undefined) this.toggleTile(position, 2);
  }

  sameAdjacentCells(): boolean {
    return this.gridCellList.some((gridRow, rowIndex) => {
      return gridRow.some((gridCell, colIndex) => {
        const cellValue = gridCell.innerText;

        return [[1, 0], [0, 1]].some(increment => {
          const nextPos: Position =
              {x: rowIndex + increment[0], y: colIndex + increment[1]};

          if (nextPos.x < this.gridCellList.length &&
              nextPos.y < this.gridCellList[rowIndex].length &&
              cellValue === this.getCellValue(nextPos)) {
            return true;
          }
          return false;
        });
      });
    });
  }

  /**
   * Updates the score whenever tiles are merged to increase the score of that
   * game, and also updates the high score on the page and in the database if
   * the game score is greater than the previous high score.
   */
  updateScore() {
    if (this.score > this.bestScore) {
      const apiToken = import.meta.env.VITE_API_TOKEN;
      const requestObj = new XMLHttpRequest();
      const scoreData = new FormData();

      this.bestScore = this.score;
      requestObj.open('POST', `${API_BASE_URL}/projects/game-2048/api/update-score/`);
      requestObj.setRequestHeader("X-API-TOKEN", apiToken);
      requestObj.withCredentials = true;
      scoreData.append('best-score', `${this.bestScore}`);
      requestObj.send(scoreData);
    }

    this.gameScoreEls.map(scoreEl => scoreEl.innerHTML = `${this.score}`);
    this.bestScoreEls.map(scoreEl => scoreEl.innerHTML = `${this.bestScore}`);
  }

  setMinBoardSize() {
    const updatedHeight = document.documentElement.clientHeight;
    const updatedWidth = document.documentElement.clientWidth;
    const maxBoardSize = parseInt(this.getCSSProperty(this.gameBoardEl,
        '--max-board-size'), 10);
    let minBoardSize: number;

    this.bodyEl.dataset.touchDevice = `${this.isTouchDevice()}`;

    if (this.gameLayoutEl.classList.contains(`${Selector.HIDE_ELEMENT}`)) {
      this.gameLayoutEl.classList.remove(`${Selector.HIDE_ELEMENT}`);
    }

    if (updatedHeight < Breakpoint.MOBILE_LANDSCAPE &&
        updatedWidth > Breakpoint.MOBILE) {
      const increment = this.viewportWidth < updatedWidth
          ? updatedWidth - this.viewportWidth
          : 0;
      const boardPadding =
          parseInt(this.getCSSProperty(this.gameBoardEl,
              `${CSSProperty.PADDING_TOP}`), 10) +
          parseInt(this.getCSSProperty(this.gameBoardEl,
              `${CSSProperty.PADDING_BOTTOM}`), 10);
      this.expectedWidthDiff += increment -
          (this.bodyEl.scrollWidth - updatedWidth);

      if (this.expectedWidthDiff > 0) this.expectedWidthDiff = 0;
      else if (this.expectedWidthDiff < -maxBoardSize) {
        this.expectedHeightDiff = -maxBoardSize;
      }

      minBoardSize = Math.min(updatedHeight - boardPadding,
          maxBoardSize,
          maxBoardSize + this.expectedWidthDiff);
      this.expectedHeightDiff = 0;
    } else {
      const increment = this.viewportHeight < updatedHeight
          ? updatedHeight - this.viewportHeight
          : 0;
      const boardPadding =
          parseInt(this.getCSSProperty(this.gameBoardEl,
              `${CSSProperty.PADDING_LEFT}`), 10) +
          parseInt(this.getCSSProperty(this.gameBoardEl,
              `${CSSProperty.PADDING_RIGHT}`), 10);
      this.expectedHeightDiff += increment -
          (this.bodyEl.scrollHeight - updatedHeight) +
          this.headerEl.offsetHeight;

      if (this.expectedHeightDiff > 0) this.expectedHeightDiff = 0;
      else if (this.expectedHeightDiff < -maxBoardSize / 2) {
        this.expectedHeightDiff = -maxBoardSize / 2;
      }

      minBoardSize = Math.min(updatedWidth - boardPadding,
          maxBoardSize,
          maxBoardSize + 2 * this.expectedHeightDiff);
      this.expectedWidthDiff = 0;
    }

    this.gameBoardEl.style.setProperty('--board-side', `${minBoardSize}px`);
    this.viewportHeight = updatedHeight;
    this.viewportWidth = updatedWidth;
  };

  /**
   * Events which get executed when the page is resized. This also handles
   * setting the proper size of the game board so that it properly fits in the
   * viewport screen.
   */
  eventsOnResize() {
    window.addEventListener(Event.RESIZE, () => {
      if (this.viewportHeight === document.documentElement.clientHeight &&
          this.viewportWidth === document.documentElement.clientWidth) {
        return;
      }

      this.setMinBoardSize();
      setTimeout(this.setMinBoardSize.bind(this), 100);
    }, false);
  }
}
