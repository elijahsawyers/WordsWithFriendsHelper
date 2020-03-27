/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

import {Letter} from './Letter';

/** Represents the different bonus cell types. */
export enum BonusCell {
  doubleLetter,
  tripleLetter,
  doubleWord,
  tripleWord,
}

/** Represents the base cell class. */
export class Cell {
  #selected = false;
  _cell: HTMLElement;
  _letter: Letter|null;

  /**
   * Construct a new cell with the HTMLElement of the cell and a letter type.
   *
   * @param {HTMLElement} cell the HTMLElement of the cell.
   * @param {Letter|null} letter the letter the cell holds.
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
    this.#selected = !this.#selected;

    if (this.#selected) {
      this._cell.classList.add('selected-cell')
    } else {
      this._cell.classList.remove('selected-cell')
    }
  }
}

/** Represents a cell in the game board. */
export class GameBoardCell extends Cell {
  _bonusCell: BonusCell|null;

  /**
   * Construct a new cell with the HTMLElement of the cell and a letter type, as well
   * as a bonus cell type.
   *
   * @param {HTMLElement} cell the HTMLElement of the cell.
   * @param {BonusCell|null} bonusCell whether or not this is a bonus cell,
   * and if so, what type. (default is null).
   * @param {Letter|null} letter the letter the cell holds.
   */
  constructor(
    cell: HTMLElement,
    bonusCell: BonusCell|null = null,
    letter: Letter|null = null,
  ) {
    super(cell, letter);
    this._bonusCell = bonusCell;
  }

  /** Must override the getter if the setter is overridden, per the spec. */
  get letter(): Letter|null {
    return this._letter;
  }

  /** Override the setter for the current letter of the cell. */
  set letter(newLetter: Letter|null) {
    this._letter = newLetter;

    if (newLetter == null) {
      this._cell.classList.remove('letter');

      if (this._cell.classList.contains('double-letter')) this._cell.innerHTML = 'DL';
      else if (this._cell.classList.contains('triple-letter')) this._cell.innerHTML = 'TL';
      else if (this._cell.classList.contains('double-word')) this._cell.innerHTML = 'DW';
      else if (this._cell.classList.contains('triple-word')) this._cell.innerHTML = 'TW';
      else if (this._cell.classList.contains('start-cell')) this._cell.innerHTML = '<i id="star" class="fas fa-star"></i>';
      else this._cell.innerHTML = '';

    } else {
      this._cell.classList.add('letter');

      this._cell.innerHTML =
          `${newLetter.letter}<span class="letter-point-value">${newLetter.value}</span>`;
    }
  }

  /** Getter for the bonus cell type of the cell. */
  get bonusCell(): BonusCell|null {
    return this._bonusCell;
  }

  /** Setter for the bonus cell type of the cell. */
  set bonusCell(newBonusCell: BonusCell|null) {
    throw Error('Cannot change the bonus cell type!');
  }
}

/** Represents a cell in the game board. */
export class UserCell extends Cell {
  /** Must override the getter if the setter is overridden, per the spec. */
  get letter(): Letter|null {
    return this._letter;
  }

  /** Override the setter for the current letter of the cell. */
  set letter(newLetter: Letter|null) {
    this._letter = newLetter;

    if (newLetter == null) {
      this._cell.innerHTML = '';
    } else {
      this._cell.innerHTML = `${newLetter.letter}<span class="user-letter-point-value">${newLetter.value}</span>`;
    }
  }
}
