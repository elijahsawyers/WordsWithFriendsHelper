/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

import GameBoard from './GameBoard';
import User from './User';

(function main(): void {
  const user = new User();
  const gameBoard = new GameBoard(user);
})();
