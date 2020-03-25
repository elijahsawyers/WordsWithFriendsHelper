/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

import GameBoard from './GameBoard';
import User from './User';

(function main(): void {
  const table = document.getElementById('game-board') as HTMLElement;

  const user = new User();
  new GameBoard(table, user);
})();
