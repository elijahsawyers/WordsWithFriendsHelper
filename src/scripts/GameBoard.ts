/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

import {BonusCell, Cell, UserCell, GameBoardCell} from './Cell';
import {LetterValues} from './Letter';

/** Represents the game board. */
export default class GameBoard {
  static height = 15;
  static width = 15;
  #table: HTMLElement;
  #cells: Array<GameBoardCell>;
  #userLetters: Array<Cell>;
  #currentSelectedCell: Cell|null;

  /**
   * Construct a new game board with a user.
   *
   * @param {HTMLElement} table the table HTML element of the game board.
   */
  constructor(table: HTMLElement) {
    this.#table = table;
    this.#cells = [];
    this.#userLetters = [];
    this.#currentSelectedCell = null;
    this.initializeGameboardCells();
    this.initializeUserCells();

    // Setup events.
    document.addEventListener('click', this.onClick.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  /**
   * Creates a new Cell object for each cell in the game board,
   * and populates the cells array with these newly created cells.
   */
  private initializeGameboardCells(): void {
    const cells = document.getElementsByClassName('game-board-cell');

    for (let i = 0; i < cells.length; i++) {
      let bonusCellType: BonusCell|null = null;

      if (cells[i].classList.contains('double-letter')) bonusCellType = BonusCell.doubleLetter;
      if (cells[i].classList.contains('triple-letter')) bonusCellType = BonusCell.tripleLetter;
      if (cells[i].classList.contains('double-word')) bonusCellType = BonusCell.doubleWord;
      if (cells[i].classList.contains('triple-word')) bonusCellType = BonusCell.tripleWord;

      this.#cells.push(new GameBoardCell(cells[i] as HTMLElement, bonusCellType));
    }
  }

  /**
   * Creates a new Cell object for each cell in the user letter dock,
   * and populates the user cells array with these newly created cells.
   */
  private initializeUserCells(): void {
    const cells = document.getElementsByClassName('user-letter');

    for (let i = 0; i < cells.length; i++) {
      this.#userLetters.push(new UserCell(cells[i] as HTMLElement));
    }
  }

  /**
   * Handle click events on the gameboard.
   *
   * @param {MouseEvent} e the mouse event object from the click.
   */
  private onClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    if (target.classList.contains('game-board-cell') || target.classList.contains('user-letter')) {
      let clickedCell;

      if (target.classList.contains('game-board-cell')) {
        clickedCell = this.#cells.filter(cell => {
          if (cell.cell == target) return cell;
        })[0];
      } else {
        clickedCell = this.#userLetters.filter(cell => {
          if (cell.cell == target) return cell;
        })[0];
      }

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
   * Handle keydown events in the gameboard.
   *
   * @param {KeyboardEvent} e the keyboard event object from the keydown.
   */
  private onKeyDown(e: KeyboardEvent): void {
    if (this.#currentSelectedCell && e.key.search(/^[A-Za-z ]$/) != -1) {
      this.#currentSelectedCell.letter = {
        letter: e.key == ' ' ? '?' : e.key.toUpperCase(),
        value: LetterValues[e.key == ' ' ? '?' : e.key.toUpperCase()],
      };
      this.#currentSelectedCell.toggleSelected();
      this.#currentSelectedCell = null;
    } else if (this.#currentSelectedCell && e.key == 'Backspace') {
      this.#currentSelectedCell.toggleSelected();
      this.#currentSelectedCell.letter = null;
      this.#currentSelectedCell = null;
    } else if (this.#currentSelectedCell && e.key == 'Escape') {
      this.#currentSelectedCell.toggleSelected();
      this.#currentSelectedCell = null;
    }
  }
}
