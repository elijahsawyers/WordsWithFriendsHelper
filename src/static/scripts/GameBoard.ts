/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

import computeBestMove, {BestMoveData, MoveDirection} from './BestMove';
import {CellType, Cell, UserCell, GameBoardCell} from './Cell';
import {LetterValues} from './Letter';

/** Represents the game data to be posted to the backend service. */
export interface PostData {
  gameLetters: Array<object>;
  userLetters: Array<string|undefined>;
}

/** Represents the game board. */
export default class GameBoard {
  // A 15x15 game board.
  dimensions = 15;

  // The HTML element in the DOM that represents the score board.
  _score: HTMLElement;

  // The HTML element in the DOM that spins in the "go" button.
  _loader: HTMLElement;

  // The game board cells.
  _gameBoardCells: Array<GameBoardCell>;

  // The user's letter rack cells.
  _letterRackCells: Array<UserCell>;

  // The cells that are a part of the best possible game move.
  _bestMoveCells: Array<Cell>;

  // The cells that are a part of the best possible game move, from the user's rack.
  _bestMoveRackCells: Array<Cell>;

  // The cell that is currently selected by the user, or null, if a cell isn't selected.
  _selectedCell: Cell|null;

  /** Construct a new game board. */
  constructor() {
    this._gameBoardCells = [];
    this._letterRackCells = [];
    this._bestMoveCells = [];
    this._bestMoveRackCells = [];
    this._selectedCell = null;

    // Grab the "score board" and loader elements from the DOM.
    this._score = document.getElementById('score-value') as HTMLElement;
    this._loader = document.getElementById('loader') as HTMLElement;

    // Initialize the gameboard cells and letter rack cells.
    this.initializeGameboardCells();
    this.initializeLetterRackCells();

    // Setup click and keydown events.
    document.addEventListener('click', this.onClick.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  /**
   * Creates a new GameBoardCell object for each cell in the game board,
   * and populates the cells array with these newly created cells.
   */
  initializeGameboardCells(): void {
    const cells = document.getElementsByClassName('game-board-cell');

    for (let i = 0; i < cells.length; i++) {
      let cellType = CellType.plain;

      if (cells[i].classList.contains('start-cell')) cellType = CellType.start;
      if (cells[i].classList.contains('double-letter')) cellType = CellType.doubleLetter;
      if (cells[i].classList.contains('triple-letter')) cellType = CellType.tripleLetter;
      if (cells[i].classList.contains('double-word')) cellType = CellType.doubleWord;
      if (cells[i].classList.contains('triple-word')) cellType = CellType.tripleWord;

      this._gameBoardCells.push(new GameBoardCell(cells[i] as HTMLElement, cellType, i));
    }
  }

  /**
   * Creates a new UserCell object for each cell in the user letter dock,
   * and populates the letter dock array with these newly created cells.
   */
  initializeLetterRackCells(): void {
    const cells = document.getElementsByClassName('user-letter');

    for (let i = 0; i < cells.length; i++) {
      this._letterRackCells.push(new UserCell(cells[i] as HTMLElement));
    }
  }

  /**
   * Handle click events on the gameboard.
   *
   * @param {MouseEvent} e the mouse event object from the click.
   */
  onClick(e: MouseEvent): void {
    // Grab the DOM element that was clicked.
    const target = e.target as HTMLElement;

    // Handle cell clicks.
    if (
      target.classList.contains('game-board-cell') ||
      target.classList.contains('user-letter')
    ) {
      this.discard();
      this.select(target);
    }
    // Handle clicks on the "clear" button.
    else if (target.id == 'clear') {
      this.clear();
    }
    // Handle clicks on the "go" button.
    else if (target.id == 'go') {
      this.computeBestMove();
    }
    // Handle clicks on the "discard" button.
    else if (target.id == 'discard') {
      this.discard();
    }
    // Handle clicks on the "keep" button.
    else if (target.id == 'keep') {
      this.keep();
    }
  }

  /**
   * Handle keydown events in the gameboard.
   *
   * @param {KeyboardEvent} e the keyboard event object from the keydown.
   */
  onKeyDown(e: KeyboardEvent): void {
    // If an alpha char is pressed, and a cell is selected, set the letter in the cell.
    if (this._selectedCell && e.key.search(/^[A-Za-z ]$/) != -1) {
      this.setSelectedCellLetter(e.key);
    }
    // If backspace is pressed, and a cell is selected, clear the letter in the cell.
    else if (this._selectedCell && e.key == 'Backspace') {
      this.setSelectedCellLetter(null);
    }
    // If escape is pressed, and a cell is selected, deselect the cell.
    else if (this._selectedCell && e.key == 'Escape') {
      this.deselectSelectedCell();
    }
  }

  /**
   * Computes the best possible move, given the game board and user's letter,
   * and displays it on the gameboard.
   */
  computeBestMove(): void {
    this.discard();
    this.showSpinner();
    this.deselectSelectedCell();

    const postData = this.buildPostData();
    computeBestMove(postData).then((bestMove: BestMoveData) => {
      this.displayBestMove(bestMove);
      this.hideSpinner();
    }).catch(() => {
      this.hideSpinner();
    });
  }

  /**
   * Given the best game move data, display it on the board with purple
   * boardered letters.
   * 
   * @param {BestMoveData} bestMove the best move data to display on the board.
   */
  displayBestMove(bestMove: BestMoveData): void {
    let currentIndex =
      bestMove.lastLetterIndex[0] * 15 + bestMove.lastLetterIndex[1];

    for (let i = 0; i < bestMove.word.length; i++) {
      // Set the score board.
      this.setScore(bestMove.score);

      // Keep up with whether the letter is a rack or game board letter.
      if (!this._gameBoardCells[currentIndex].letter)
        this._bestMoveRackCells.push(this._gameBoardCells[currentIndex]);
      else
        this._bestMoveCells.push(this._gameBoardCells[currentIndex]);

      // Toggle the purple border, and set the letter in the game board cell.
      this._gameBoardCells[currentIndex].toggleBestMove();
      this._gameBoardCells[currentIndex].letter = {
        letter: bestMove.word[bestMove.word.length - i - 1],
        value: LetterValues[bestMove.word[bestMove.word.length - i - 1]]
      };

      // Update the current index, which varies based on move direction.
      if (bestMove.direction == MoveDirection.across) {
        currentIndex -= 1;
      } else {
        currentIndex -= this.dimensions;
      }
    }
  }

  /**
   * Builds the post data needed for the backend service to compute the best
   * possible game move.
   * 
   * @return the post data for the backend service.
   */
  buildPostData(): PostData {
    const postData: PostData = {
      gameLetters: [],
      userLetters: []
    }

    // Grab the game board letters.
    for (let i = 0; i < this._gameBoardCells.length; i++) {
      if (this._gameBoardCells[i].letter != null) {
        postData.gameLetters.push({
          letter: this._gameBoardCells[i].letter?.letter,
          index: this._gameBoardCells[i].index
        });
      }
    }

    // Grab the user letters.
    for (let i = 0; i < this._letterRackCells.length; i++) {
      if (this._letterRackCells[i].letter != null) {
        postData.userLetters.push(
          this._letterRackCells[i].letter?.letter
        );
      }
    }

    return postData;
  }

  /**
   * Selects a cell, either a game board cell or a user letter rack cell.
   * 
   * @param {HTMLElement} cell the cell to select.
   */
  select(cell: HTMLElement): void {
    let clickedCell;

    // A gameboard cell was clicked.
    if (cell.classList.contains('game-board-cell')) {
      clickedCell = this._gameBoardCells.filter(currentCell => {
        if (currentCell.cell == cell) return currentCell;
      })[0];
    }
    // A letter rack cell was clicked.
    else {
      clickedCell = this._letterRackCells.filter(currentCell => {
        if (currentCell.cell == cell) return currentCell;
      })[0];
    }

    // Clicked cell is the same as the currently selected cell.
    if (clickedCell == this._selectedCell) {
      this.deselectSelectedCell();
    }
    // Clicked cell is different than the currently selected cell.
    else {
      if (this._selectedCell != null) {
        this._selectedCell.toggleSelected();
      }
      this._selectedCell = clickedCell;
      this._selectedCell.toggleSelected();
    }
  }

  /**
   * Resets the state of the game board.
   */
  clear(): void {
    // Clear the selected cell.
    this.setSelectedCellLetter(null);

    // Clear all letters in the game board.
    for (let i = 0; i < this._gameBoardCells.length; i++) {
      this._gameBoardCells[i].letter = null;
    }

    // Clear all letters in the letter rack.
    for (let i = 0; i < this._letterRackCells.length; i++) {
      this._letterRackCells[i].letter = null;
    }

    // Remove the best move from the game board.
    this.discard();
  }

  /**
   * Removes the best move from the game board.
   */
  discard(): void {
    // Clear the best move cells.
    for (let i = 0; i < this._bestMoveCells.length; i++) {
      this._bestMoveCells[i].toggleBestMove();
    }
    this._bestMoveCells = [];

    // Clear the best move rack cells.
    for (let i = 0; i < this._bestMoveRackCells.length; i++) {
      this._bestMoveRackCells[i].toggleBestMove();
      this._bestMoveRackCells[i].letter = null;
    }
    this._bestMoveRackCells = [];

    // Clear the score board.
    this.setScore(null);
  }

  /**
   * Keeps the best move on the game board.
   */
  keep(): void {
    // Remove the purple boarders from the cells.
    for (let i = 0; i < this._bestMoveCells.length; i++) {
      this._bestMoveCells[i].toggleBestMove();
    }

    for (let i = 0; i < this._bestMoveRackCells.length; i++) {
      this._bestMoveRackCells[i].toggleBestMove();
    }

    // Clear the best move arrays, and reset the score board.
    this._bestMoveCells = [];
    this._bestMoveRackCells = [];
    this.setScore(null);
  }

  /**
   * Sets a score in the scoreboard, or sets it to "00", if null
   * is passed in.
   *
   * @param {number|null} score the score to display on the scoreboard.
   */
  setScore(score: number|null): void {
    if (score) {
      this._score.innerHTML = String(score);
    } else {
      this._score.innerHTML = '00';
    }
  }

  /**
   * Show the spinner on the "Go" button, which indicates loading
   * the best game move.
   */
  showSpinner(): void {
    this._loader.classList.remove('hidden');
  }

  /**
   * Hide the spinner on the "Go" button.
   */
  hideSpinner(): void {
    this._loader.classList.add('hidden');
  }

  /**
   * Set the selected cell's letter, or clear it, if null is passed as the
   * letter value.
   * 
   * @param {string|null} letter the letter value to set in the selected cell.
   */
  setSelectedCellLetter(letter: string|null): void {
    // Set the letter in the selected cell.
    if (this._selectedCell) {
      this._selectedCell.letter =
        (letter == null) ?
          null :
          {
            letter: letter == ' ' ? '?' : letter.toUpperCase(),
            value: LetterValues[letter == ' ' ? '?' : letter.toUpperCase()]
          };
      this.deselectSelectedCell();
    }
  }

  /**
   * Deselect the selected cell, which removes the red border.
   */
  deselectSelectedCell(): void {
    if (this._selectedCell) {
      this._selectedCell.toggleSelected();
      this._selectedCell = null;
    }
  }
}
