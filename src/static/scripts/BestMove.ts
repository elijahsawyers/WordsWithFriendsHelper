/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

/** */
export interface GameLetter {
  letter: string|undefined;
  index: number;
}

/** */
export interface GameData {
  gameLetters: Array<GameLetter>;
  userLetters: Array<string|undefined>;
}

/** */
export enum MoveDirection {
  down,
  across
}

/** */
export interface BestMoveData {
  word: string;
  score: number;
  direction: MoveDirection;
  lastLetterIndex: number;
}

const computeBestMove = (data: GameData): BestMoveData => {

};

export default computeBestMove;
