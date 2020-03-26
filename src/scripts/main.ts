/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

import GameBoard from './GameBoard';

(function main(): void {
  const table = document.getElementById('game-board') as HTMLElement;
  new GameBoard(table);
})();
