import {Event, type Position, Selector} from './constants';

export class Game2024 {
  bestScoreEl: HTMLElement;
  gameGridEl: HTMLElement;
  gameScoreEl: HTMLElement;
  gridCellList: HTMLElement[][];
  score: number;

  constructor() {
    this.gameGridEl = document.querySelector<HTMLElement>(`.${Selector.BOARD_GRID}`);

    const gridRows = Array.from(
        this.gameGridEl.querySelectorAll<HTMLElement>(`.${Selector.GRID_ROW}`));
    this.gridCellList = gridRows.map(row => Array.from(
        row.querySelectorAll<HTMLElement>(`.${Selector.GRID_CELL}`)));
    this.gameScoreEl = document.querySelector<HTMLElement>(
        `.${Selector.JS_GAME_SCORE} .${Selector.SCORE_VALUE}`);
    this.bestScoreEl = document.querySelector<HTMLElement>(
        `.${Selector.JS_BEST_SCORE} .${Selector.SCORE_VALUE}`);
    
    this.score = 0;
    this.addTile();
    this.addTile();
    this.arrowBtnPress();
  }

  arrowBtnPress() {
    document.addEventListener(Event.KEY_DOWN, (event: KeyboardEvent) => {
      const key = event.key;
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
            console.log('Game Over');
          }
        }
      }
    });
  }

  getTiles(emptyTiles = false): Position[] {
    const tiles: Position[] = [];

    this.gridCellList.map((gridRow, rowIndex) => {
      gridRow.map((gridCell, colIndex) => {
        const cellValue = gridCell.innerText;

        if ((emptyTiles && cellValue === '') || (!emptyTiles && cellValue !== '')) {
          tiles.push({x: rowIndex, y: colIndex});
        }
      });
    });

    return tiles;
  }

  getCellValue = (pos: Position): string => this.gridCellList[pos.x][pos.y].innerText;

  getNextPos(pos: Position, arrowEvent: string, mergeTiles = true): [Position, number] {
    let initPos: number;
    let direction: number;
    let condition: Function;
    let getAdjPos: Function;
    let nextPos: Position;
    let tileVal: number;

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
    }

    if (!(condition instanceof Function) && !(getAdjPos instanceof Function)) return;

    for (initPos += direction; condition(); initPos += direction) {
      const adjPos = getAdjPos(initPos);

      if (this.getCellValue(adjPos) !== '') {
        if (this.getCellValue(pos) === this.getCellValue(adjPos) && mergeTiles) {
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

    return [nextPos, tileVal]
  }

  moveTiles(direction: string, mergeTiles = true): boolean {
    const tiles = [`${Event.ARROW_RIGHT}`, `${Event.ARROW_DOWN}`].includes(direction)
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
    const position = emptyTileList[Math.floor((Math.random() * emptyTileList.length) + 1) - 1];

    if (position !== undefined) {
      this.toggleTile(position, 2);
    }
  }

  sameAdjacentCells(): boolean {
    return this.gridCellList.some((gridRow, rowIndex) => {
      return gridRow.some((gridCell, colIndex) => {
        const cellValue = gridCell.innerText;

        return [[1, 0], [0, 1]].some(increment => {
          const nextPos: Position = {x: rowIndex + increment[0], y: colIndex + increment[1]};

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

  updateScore() {
    this.gameScoreEl.innerHTML = `${this.score}`;
    this.bestScoreEl.innerHTML = `${this.score}`;
  }
}
