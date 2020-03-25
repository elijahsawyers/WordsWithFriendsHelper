/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

import Cell, {BonusCell} from './Cell';
import {LetterValues} from './Letter';
import User from './User';

/** Represents the game board. */
export default class GameBoard {
  static height = 15;
  static width = 15;
  #table: HTMLElement;
  #user: User;
  #cells: Array<Cell>;
  #currentSelectedCell: Cell|null;

  /**
   * Construct a new game board with a user.
   *
   * @param {HTMLElement} table the table HTML element of the game board.
   * @param {User} user the user object of the board which will
   * contain data about the user's current letters.
   */
  constructor(table: HTMLElement, user: User) {
    this.#table = table;
    this.#user = user;
    this.#cells = [];
    this.#currentSelectedCell = null;
    this.initializeCells();

    // Setup events.
    this.#table.addEventListener('click', this.onClick.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
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

      this.#cells.push(new Cell(cells[i] as HTMLElement, bonusCellType));
    }
  }

  /**
   * Handle click events on the gameboard.
   *
   * @param {MouseEvent} e the mouse event object from the click.
   */
  private onClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    if (target.classList.contains('game-board-cell')) {
      const clickedCell = this.#cells.filter(cell => {
        if (cell.cell == target) return cell;
      })[0];

      // Clicked cell is the same as the currently selected cell.
      if (clickedCell == this.#currentSelectedCell) {
        this.#currentSelectedCell.toggleSelected();
        this.#currentSelectedCell = null;
      }
      // Clicked cell is different than the currently selected cell.
      else {
        if (this.#currentSelectedCell != null) {
          this.#currentSelectedCell.toggleSelected();
        }
        this.#currentSelectedCell = clickedCell;
        this.#currentSelectedCell.toggleSelected();
      }
    }
  }

  /**
   * 
   * @param {KeyboardEvent} e
   */
  private onKeyDown(e: KeyboardEvent): void {
    if (this.#currentSelectedCell && e.key.search(/^[A-Za-z ]$/) != -1) {
      this.#currentSelectedCell.letter = {
        letter: e.key.toUpperCase(),
        value: LetterValues[e.key.toUpperCase()],
      };
    } else if (this.#currentSelectedCell && e.key == 'Backspace') {
      this.#currentSelectedCell.letter = null;
    }
  }
}
