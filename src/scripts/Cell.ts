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
  /**
   * Construct a new cell with a bonus cell and letter type.
   *
   * @param 
   */
  constructor(
    private cell: Element,
    public bonusCell: BonusCell|null = null,
    public letter: Letter|null = null,
  ) {
    this.cell = cell;
    this.bonusCell = bonusCell;
    this.letter = letter;
  }
}
