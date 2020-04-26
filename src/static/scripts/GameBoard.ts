/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

import {CellType, Cell, UserCell, GameBoardCell} from './Cell';
import {LetterValues} from './Letter';

/** Represents the game board. */
export default class GameBoard {
  // A 15x15 game board.
  dimensions = 15;

  // The HTML element in the DOM that represents the score board.
  _score: HTMLElement;

  // The HTML element in the DOM that spins in the "go" button.
  _loader: HTMLElement;

  // The game board cells.
  _gameBoardCells: Array<Cell>;

  // The cells that are a part of the best possible game move.
  _bestMoveCells: Array<Cell>;

  // The cells that are a part of the best possible game move, from the user's rack.
  _bestMoveRackCells: Array<Cell>;

  // The user's letter rack cells.
  _letterRackCells: Array<Cell>;

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
  private initializeGameboardCells(): void {
    const cells = document.getElementsByClassName('game-board-cell');

    for (let i = 0; i < cells.length; i++) {
      let cellType = CellType.plain;

      if (cells[i].classList.contains('start-cell')) cellType = CellType.start;
      if (cells[i].classList.contains('double-letter')) cellType = CellType.doubleLetter;
      if (cells[i].classList.contains('triple-letter')) cellType = CellType.tripleLetter;
      if (cells[i].classList.contains('double-word')) cellType = CellType.doubleWord;
      if (cells[i].classList.contains('triple-word')) cellType = CellType.tripleWord;

      this._gameBoardCells.push(new GameBoardCell(cells[i] as HTMLElement, cellType));
    }
  }

  /**
   * Creates a new UserCell object for each cell in the user letter dock,
   * and populates the letter dock array with these newly created cells.
   */
  private initializeLetterRackCells(): void {
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
  private onClick(e: MouseEvent): void {
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
  private onKeyDown(e: KeyboardEvent): void {
    // If an alpha char is pressed, and a cell is selected, set the letter in the cell.
    if (this._selectedCell && e.key.search(/^[A-Za-z ]$/) != -1) {
      this._selectedCell.letter = {
        letter: e.key == ' ' ? '?' : e.key.toUpperCase(),
        value: LetterValues[e.key == ' ' ? '?' : e.key.toUpperCase()],
      };
      this._selectedCell.toggleSelected();
      this._selectedCell = null;
    }
    // If backspace is pressed, and a cell is selected, clear the letter in the cell.
    else if (this._selectedCell && e.key == 'Backspace') {
      this._selectedCell.toggleSelected();
      this._selectedCell.letter = null;
      this._selectedCell = null;
    }
    // If escape is pressed, and a 
    else if (this._selectedCell && e.key == 'Escape') {
      this._selectedCell.toggleSelected();
      this._selectedCell = null;
    }
  }

  /**
   * Computes the best possible move, given the game board and user's letter,
   * and displays the result on the gameboard with letters with a purple border.
   */
  private computeBestMove(): void {
    this._loader.classList.remove('hidden');
    if (this._selectedCell != null) this._selectedCell.toggleSelected();
    this._selectedCell = null;
    this.discard();

    // Construct the post data - game points and user letters.
    interface GameLetter {
      letter: string|undefined;
      index: number;
    }

    const postData = {
      gameLetters: [] as Array<GameLetter>,
      userLetters: [] as Array<string|undefined>
    };

    for (let i = 0; i < this._gameBoardCells.length; i++) {
      if (this._gameBoardCells[i].letter != null) {
        postData.gameLetters.push({
          letter: this._gameBoardCells[i].letter?.letter,
          index: i
        });
      }
    }

    for (let i = 0; i < this._letterRackCells.length; i++) {
      if (this._letterRackCells[i].letter != null) {
        postData.userLetters.push(this._letterRackCells[i].letter?.letter);
      }
    }

    // Make an xhr request to get the best possible game move.
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (): void => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        this._loader.classList.add('hidden');
        const bestMove = JSON.parse(xhr.responseText);
        const word = bestMove['word'];
        const score = bestMove['score'];
        const direction = bestMove['direction'];
        let currentIndex =
          bestMove['last_letter_index'][0] * 15 + bestMove['last_letter_index'][1];
        
        // Display the word on the board.
        for (let i = 0; i < word.length; i++) {
          this._score.innerHTML = score;

          if (!this._gameBoardCells[currentIndex].letter) this._bestMoveRackCells.push(this._gameBoardCells[currentIndex]);
          else this._bestMoveCells.push(this._gameBoardCells[currentIndex]);

          this._gameBoardCells[currentIndex].toggleBestMove();
          this._gameBoardCells[currentIndex].letter = {
            letter: word[word.length - i - 1],
            value: LetterValues[word[word.length - i - 1]]
          };

          if (direction == 'across') {
            currentIndex -= 1;
          } else {
            currentIndex -= this.dimensions;
          }
        }
      }
    }
    xhr.open('POST', '/bestGameMove');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(postData));
  }

  /**
   * Selects a cell, either a game board cell or a user letter rack cell.
   * 
   * @param {HTMLElement} cell the cell to select.
   */
  private select(cell: HTMLElement): void {
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
      this._selectedCell.toggleSelected();
      this._selectedCell = null;
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
    if (this._selectedCell != null) {
      this._selectedCell.toggleSelected();
    }
    this._selectedCell = null;

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
    this._score.innerHTML = '0';
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
    this._score.innerHTML = '0';
  }
}
