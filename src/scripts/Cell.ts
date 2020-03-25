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

/** Represents a cell in the game board. */
export default class Cell {
  #selected = false;
  _cell: HTMLElement;
  _bonusCell: BonusCell|null;
  _letter: Letter|null;

  /**
   * Construct a new cell with a bonus cell and letter type.
   *
   * @param {HTMLElement} cell the HTMLElement of the cell.
   * @param {BonusCell|null} bonusCell whether or not this is a bonus cell,
   * and if so, what type. (default is null).
   * @param {Letter|null} 
   */
  constructor(
    cell: HTMLElement,
    bonusCell: BonusCell|null = null,
    letter: Letter|null = null,
  ) {
    this._cell = cell;
    this._bonusCell = bonusCell;
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

    if (newLetter == null) {
      this._cell.classList.remove('letter');

      if (this._cell.classList.contains('double-letter')) this._cell.innerHTML = 'DL';
      else if (this._cell.classList.contains('triple-letter')) this._cell.innerHTML = 'TL';
      else if (this._cell.classList.contains('double-word')) this._cell.innerHTML = 'DW';
      else if (this._cell.classList.contains('triple-word')) this._cell.innerHTML = 'TW';
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
