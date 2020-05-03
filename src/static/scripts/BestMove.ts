/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

import {PostData} from './GameBoard';

/** 
 * Whether a move is down or across.
 */
export enum MoveDirection {
  down,
  across
}

/**
 * Represents the best move that can be played on the gameboard.
 */
export interface BestMoveData {
  word: string;
  score: number;
  direction: MoveDirection;
  lastLetterIndex: Array<number>;
}

/**
 * Given the gameboard data, compute the best possible game move by making
 * and xhr request to the backen service.
 * 
 * @param {PostData} data the gameboard data.
 * @return a promise to resolve with the best move data.
 */
const computeBestMove = async (data: PostData): Promise<BestMoveData> => {
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = (): void => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const responseData = JSON.parse(xhr.responseText);
        const bestMoveData: BestMoveData = {
          word: responseData['word'],
          score: responseData['score'],
          direction:
            responseData['direction'] == 'across' ?
              MoveDirection.across :
              MoveDirection.down,
          lastLetterIndex: responseData['last_letter_index'],
        };
        resolve(bestMoveData);
      }
    }
    xhr.onerror = (): void => {
      reject();
    };
    xhr.open('POST', '/bestGameMove');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  });
};

export default computeBestMove;
