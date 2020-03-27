/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

/** Interface for letter values object. */
interface LetterValueObject {
  [key: string]: number;
}

/** All letter point values. */
export const LetterValues: LetterValueObject = {
  'A': 1,
  'B': 4,
  'C': 4,
  'D': 2,
  'E': 1,
  'F': 4,
  'G': 3,
  'H': 3,
  'I': 1,
  'J': 10,
  'K': 5,
  'L': 2,
  'M': 4,
  'N': 2,
  'O': 1,
  'P': 4,
  'Q': 10,
  'R': 1,
  'S': 1,
  'T': 1,
  'U': 2,
  'V': 5,
  'W': 4,
  'X': 8,
  'Y': 3,
  'Z': 10,
  '?': 0,
};

/** Represents a letter in a game board cell. */
export interface Letter {
  letter: string;
  value: number;
}
