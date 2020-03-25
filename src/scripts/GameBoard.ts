/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

import Cell, {BonusCell} from './Cell';
import User from './User';

/** Represents the game board. */
export default class GameBoard {
  static height = 15;
  static width = 15;
  #user: User;
  #cells: Array<Cell>;
  #currentSelectedCell: Cell|null;

  /**
   * Construct a new game board with a user.
   *
   * @param {User} user the user object of the board which will
   * contain data about the user's current letters.
   */
  constructor(user: User) {
    this.#user = user;
    this.#cells = [];
    this.#currentSelectedCell = null;
    this.initializeCells();
  }

  /**
   * Creates a new Cell object for each cell in the game board,
   * and populates the cells array with these newly created cells.
   */
  private initializeCells(): void {
    const cells = document.getElementsByClassName('game-board-cell');

    for (let i = 0; i < cells.length; i++) {
      let bonusCellType: BonusCell|null = null;

      if (cells[i].classList.contains('double-letter')) bonusCellType = BonusCell.doubleLetter;
      if (cells[i].classList.contains('triple-letter')) bonusCellType = BonusCell.tripleLetter;
      if (cells[i].classList.contains('double-word')) bonusCellType = BonusCell.doubleWord;
      if (cells[i].classList.contains('triple-word')) bonusCellType = BonusCell.tripleWord;

      this.#cells.push(new Cell(cells[i], bonusCellType));
    }
  }
}
