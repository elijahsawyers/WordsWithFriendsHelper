/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

import {Letter} from './Letter';

/** Represents the different special cell types. */
export enum CellType {
  plain,
  start,
  doubleLetter,
  tripleLetter,
  doubleWord,
  tripleWord,
}

/** Represents the base cell class. */
export class Cell {
  // Whether or not the cell is currently selected by the user. 
  _selected = false;

  // Whether or not the cell is currently a part of the best move being displayed.
  _bestMoveCell = false;

  // The HTML element in the DOM that represents the cell.
  _cell: HTMLElement;

  // The letter the cell holds, or null, if it doesn't hold a letter.
  _letter: Letter|null;

  /**
   * Construct a new cell with the HTMLElement of the cell and a letter.
   *
   * @param {HTMLElement} cell the HTML element in the DOM that represents the cell.
   * @param {Letter|null} letter the letter the cell holds, or null, if it doesn't
   * hold a letter.
   */
  constructor(
    cell: HTMLElement,
    letter: Letter|null = null,
  ) {
    this._cell = cell;
    this._letter = letter;
  }

  /** Getter for the cell's HTMLElement. */
  get cell(): HTMLElement {
    return this._cell;
  }

  /** Setter for the cell's HTMLElement. */
  set cell(newCell: HTMLElement) {
    throw Error('Cannot change the cell!');
  }

  /** Getter for the current letter of the cell. */
  get letter(): Letter|null {
    return this._letter;
  }

  /** Setter for the current letter of the cell. */
  set letter(newLetter: Letter|null) {
    this._letter = newLetter;
  }

  /** 
   * Toggles whether or not the cell is in selected mode (i.e. adds/removes a red border).
   */
  toggleSelected(): void {
    this._selected = !this._selected;

    if (this._selected) {
      this._cell.classList.add('selected-cell')
    } else {
      this._cell.classList.remove('selected-cell')
    }
  }

  /**
   * Toggles the cell to be a part of the best move (i.e. adds/removes a purple border).
   */
  toggleBestMove(): void {
    this._bestMoveCell = !this._bestMoveCell;

    if (this._bestMoveCell) {
      this._cell.classList.add('best-move-cell')
    } else {
      this._cell.classList.remove('best-move-cell')
    }
  }
}

/** Represents a cell in the game board. */
export class GameBoardCell extends Cell {
  // The cell type (i.e. bonus cell, middle cell, etc.).
  _cellType: CellType;

  /**
   * Construct a new cell with the HTMLElement of the cell and a letter, as well
   * as a cell type.
   *
   * @param {HTMLElement} cell the HTML element in the DOM that represents the cell.
   * @param {CellType} cellType the cell type (i.e. bonus cell, middle cell, etc.).
   * @param {Letter|null} letter the letter the cell holds, or null, if it doesn't hold
   * a letter.
   */
  constructor(
    cell: HTMLElement,
    cellType: CellType,
    letter: Letter|null = null,
  ) {
    super(cell, letter);
    this._cellType = cellType;
  }

  /** Must override the getter if the setter is overridden, per the spec. */
  get letter(): Letter|null {
    return this._letter;
  }

  /** Override the setter for the current letter of the cell. */
  set letter(newLetter: Letter|null) {
    this._letter = newLetter;

    // Remove the current letter.
    if (newLetter == null) {
      this._cell.classList.remove('letter');

      if (this.cellType == CellType.doubleLetter) this._cell.innerHTML = 'DL';
      else if (this.cellType == CellType.tripleLetter) this._cell.innerHTML = 'TL';
      else if (this.cellType == CellType.doubleWord) this._cell.innerHTML = 'DW';
      else if (this.cellType == CellType.tripleWord) this._cell.innerHTML = 'TW';
      else if (this.cellType == CellType.start) this._cell.innerHTML = '<i id="star" class="fas fa-star"></i>';
      else this._cell.innerHTML = '';
    }
    // Set the current letter.
    else {
      this._cell.classList.add('letter');
      this._cell.innerHTML =
          `${newLetter.letter}<span class="letter-point-value">${newLetter.value}</span>`;
    }
  }

  /** Getter for the cell type. */
  get cellType(): CellType|null {
    return this._cellType;
  }

  /** Setter for the cell type. */
  set cellType(newCellType: CellType|null) {
    throw Error('Cannot change the cell type!');
  }
}

/** Represents a cell in the user's letter dock. */
export class UserCell extends Cell {
  /** Must override the getter if the setter is overridden, per the spec. */
  get letter(): Letter|null {
    return this._letter;
  }

  /** Override the setter for the current letter of the cell. */
  set letter(newLetter: Letter|null) {
    this._letter = newLetter;

    // Remove the current letter.
    if (newLetter == null) {
      this._cell.innerHTML = '';
    }
    // Set the current letter.
    else {
      this._cell.innerHTML =
        `${newLetter.letter}<span class="user-letter-point-value">${newLetter.value}</span>`;
    }
  }
}
