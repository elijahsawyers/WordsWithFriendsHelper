/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */


/** Represents the different bonus cell types. */
export enum BonusCell {
  doubleLetter,
  tripleLetter,
  doubleWord,
  tripleWord
}


/** Represents a cell in the game board. */
export default class Cell {
  constructor(
    value: boolean,
    bonusCell: BonusCell,
  ) {
  }
}
