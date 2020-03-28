'''
Authors: Elijah Sawyers
Emails: elijahsawyers@gmail.com
Date: 03/27/2020
Reference: https://www.cs.cmu.edu/afs/cs/academic/class/15451-s06/www/lectures/scrabble.pdf
'''

from itertools import permutations

from dictionary import load_words

DICTIONARY = load_words()

ALPHABET = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
]

LETTER_VALUES = {
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
    '?': 0
}

GAME_BOARD_BONUSES = [
    ['  ', '  ', '  ', 'TW', '  ', '  ', 'TL', '  ', 'TL', '  ', '  ', 'TW', '  ', '  ', '  '],
    ['  ', '  ', 'DL', '  ', '  ', 'DW', '  ', '  ', '  ', 'DW', '  ', '  ', 'DL', '  ', '  '],
    ['  ', 'DL', '  ', '  ', 'DL', '  ', '  ', '  ', '  ', '  ', 'DL', '  ', '  ', 'DL', '  '],
    ['TW', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', 'TW'],
    ['  ', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', '  '],
    ['  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  '],
    ['TL', '  ', '  ', '  ', 'DL', '  ', '  ', '  ', '  ', '  ', 'DL', '  ', '  ', '  ', 'TL'],
    ['  ', '  ', '  ', 'DW', '  ', '  ', '  ', '  ', '  ', '  ', '  ', 'DW', '  ', '  ', '  '],
    ['TL', '  ', '  ', '  ', 'DL', '  ', '  ', '  ', '  ', '  ', 'DL', '  ', '  ', '  ', 'TL'],
    ['  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  '],
    ['  ', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', '  '],
    ['TW', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', 'TW'],
    ['  ', 'DL', '  ', '  ', 'DL', '  ', '  ', '  ', '  ', '  ', 'DL', '  ', '  ', 'DL', '  '],
    ['  ', '  ', 'DL', '  ', '  ', 'DW', '  ', '  ', '  ', 'DW', '  ', '  ', 'DL', '  ', '  '],
    ['  ', '  ', '  ', 'TW', '  ', '  ', 'TL', '  ', 'TL', '  ', '  ', 'TW', '  ', '  ', '  '],
]

def score_word(word):
    '''
    Given a word, compute it's score.

    Parameter {str} word the word to compute the score of.
    Returns {int} the score of the word.
    '''
    score = 0

    for letter in word:
        score += LETTER_VALUES[letter]
    
    return score

def compute_across_cross_checks(game_board):
    '''
    Given the game board, this function determines which letters can fit in each
    cell of a row and form a valid down word. This returns the letter matrix for
    each row as to which characters are valid for each cell.

    Parameter {Array<Array<str>>} game_board the game board letter matrix.
    Returns {Array<Array<str>>} the cross check letter matrix.
    '''
    cross_checks = []

    # Iterate over the rows.
    for row in range(15):
        row_cross_checks = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []]

        for i in range(15): # Iterate over the columns.
            # The cell isn't empty.
            if game_board[row][i] != ' ':
                row_cross_checks[i].append(game_board[row][i])
                continue

            # Find the words above and below (if applicable).
            word_above = ''
            word_below = ''

            j = row - 1
            while j != -1 and game_board[j][i] != ' ':
                word_above = game_board[j][i] + word_above
                j -= 1

            j = row + 1
            while j != 15 and game_board[j][i] != ' ':
                word_below =  word_below + game_board[j][i]
                j += 1

            # Find which (if any) letters in the alphabet form a valid cross word.
            for letter in range(26):
                # Word above and below.
                if word_above and word_below:
                    if (word_above + ALPHABET[letter] + word_below).lower() in DICTIONARY:
                        row_cross_checks[i].append(ALPHABET[letter])
                # Only word above.
                elif word_above:
                    if (word_above + ALPHABET[letter]).lower() in DICTIONARY:
                        row_cross_checks[i].append(ALPHABET[letter])
                # Only word below.
                elif word_below:
                    if (ALPHABET[letter] + word_below).lower() in DICTIONARY:
                        row_cross_checks[i].append(ALPHABET[letter])
                # No word above or below.
                else:
                    row_cross_checks[i].append(ALPHABET[letter])
        
        cross_checks.append(row_cross_checks)
    
    return cross_checks


def compute_down_cross_checks(game_board):
    '''
    Given the game board, this function determines which letters can fit in each
    cell of a column and form a valid across word. This returns the letter matrix for
    each column as to which characters are valid for each cell.

    Parameter {Array<Array<str>>} game_board the game board letter matrix.
    Returns {Array<Array<str>>} the cross check letter matrix.
    '''
    cross_checks = []

    # Iterate over the columns.
    for column in range(15):
        column_cross_checks = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []]

        for i in range(15): # Iterate over the rows.
            # The cell isn't empty.
            if game_board[i][column] != ' ':
                column_cross_checks[i].append(game_board[i][column])
                continue

            # Find the words left and right (if applicable).
            word_left = ''
            word_right = ''

            j = column - 1
            while j != -1 and game_board[i][j] != ' ':
                word_left = game_board[i][j] + word_left
                j -= 1

            j = column + 1
            while j != 15 and game_board[i][j] != ' ':
                word_right =  word_right + game_board[i][j]
                j += 1

            # Find which (if any) letters in the alphabet form a valid cross word.
            for letter in range(26):
                # Word left and right.
                if word_left and word_right:
                    if (word_left + ALPHABET[letter] + word_right).lower() in DICTIONARY:
                        column_cross_checks[i].append(ALPHABET[letter])
                # Only word left.
                elif word_left:
                    if (word_left + ALPHABET[letter]).lower() in DICTIONARY:
                        column_cross_checks[i].append(ALPHABET[letter])
                # Only word right.
                elif word_right:
                    if (ALPHABET[letter] + word_right).lower() in DICTIONARY:
                        column_cross_checks[i].append(ALPHABET[letter])
                # No word left or right.
                else:
                    column_cross_checks[i].append(ALPHABET[letter])
        
        cross_checks.append(column_cross_checks)
    
    return cross_checks

def compute_anchors(game_board):
    '''
    An anchor is defined an empty cell with an adjacent (horizontal or vertical)
    non-empty cell. This returns the binary matrix, where a zero is a non-anchor
    and a one is an anchor.

    Parameter {Array<Array<str>>} game_board the game board letter matrix.
    Returns {Array<Array<int>>} the anchor matrix.
    '''

    anchors = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []]

    for i in range(15):
        for j in range(15):
            if game_board[i][j] == ' ':                     # Empty cell.
                if j != 0 and game_board[i][j - 1] != ' ':  # Letter to the left.
                    anchors[i].append(1)
                    continue
                if j != 14 and game_board[i][j + 1] != ' ': # Letter to the right.
                    anchors[i].append(1)
                    continue
                if i != 0 and game_board[i - 1][j] != ' ':  # Letter above.
                    anchors[i].append(1)
                    continue
                if i != 14 and game_board[i + 1][j] != ' ': # Letter below.
                    anchors[i].append(1)
                    continue
            anchors[i].append(0)

    return anchors

def intersection(list1, list2):
    '''
    TODO
    '''
    return [value for value in list1 if value in list2]

if __name__ == '__main__':
    RACK = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    GAME_BOARD = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'A', 'P', 'P', 'L', 'E', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
    anchors = compute_anchors(GAME_BOARD)
    across_cross_checks = compute_across_cross_checks(GAME_BOARD)
    down_cross_checks = compute_down_cross_checks(GAME_BOARD)

    # Compute the highest scoring across word.
    best_across_word = {
        'anchor': [-1, -1],
        'word': '',
        'score': 0
    }

    def extend_right(anchor, rack, left_part, index):
        '''
        TODO
        '''
        i, j = index

        # Base case - can't extend further right.
        if j > 14 or len(rack) == 0:
            return

        # Case 1: empty cell.
        if GAME_BOARD[i][j] == ' ':
            common_letters = intersection(rack, across_cross_checks[i][j])

            # Can't extend further right.
            if not common_letters:
                return
            
            for letter in common_letters:
                if (
                    (left_part + letter).lower() in DICTIONARY and
                    score_word(left_part + letter) > best_across_word['score']
                ):
                    best_across_word['anchor'] = anchor
                    best_across_word['word'] = left_part + letter
                    best_across_word['score'] = score_word(left_part + letter)
                
                extend_right(
                    anchor,
                    list(filter(lambda l: l != letter, rack)),
                    left_part + letter,
                    [i, j + 1]
                )
        # Case 2: cell occupied.
        else:
            if (
                (left_part + GAME_BOARD[i][j]).lower() in DICTIONARY and
                score_word(left_part + GAME_BOARD[i][j]) > best_across_word['score']
            ):
                best_across_word['anchor'] = anchor
                best_across_word['word'] = left_part + GAME_BOARD[i][j]
                best_across_word['score'] = score_word(left_part + GAME_BOARD[i][j])
            extend_right(
                anchor,
                rack,
                left_part + GAME_BOARD[i][j],
                [i, j + 1]
            )
    
    def extend_left(anchor, rack, index, left_part):
        '''
        TODO
        '''

        i, j = index
        
        # Can't extend further left.
        if j < 0 or len(rack) == 0:
            return

        if GAME_BOARD[i][j] == ' ':
            common_letters = intersection(rack, across_cross_checks[i][j])

            # Can't extend further left.
            if not common_letters:
                return

            for letter in common_letters:
                extend_right(
                    anchor,
                    list(filter(lambda l: l != letter, rack)),
                    letter + left_part,
                    anchor
                )

                extend_left(
                    anchor,
                    list(filter(lambda l: l != letter, rack)),
                    [i, j - 1],
                    letter + left_part
                )
        # Can't extend further left.
        else:
            return

    # Moves can only be made off of anchors.
    for i in range(15):
        for j in range(15):
            if anchors[i][j] and across_cross_checks[i][j]: # Current anchor.
                # Case 1: The tile to the left of the anchor is empty.
                if j != 0 and GAME_BOARD[i][j - 1] == ' ':
                    extend_left(
                        [i, j],
                        RACK,
                        [i, j - 1],
                        ''
                    )
                # Case 2: The tile to the left of the anchor is occupied or off
                # the edge of the game board.
                else:
                    # Compute the "left part" of the word - continuous letters already
                    # in play on the board.
                    left_part = ''
                    k = j - 1
                    while k > -1 and GAME_BOARD[i][k] != ' ':
                        left_part += GAME_BOARD[i][k]
                        k -= 1

                    # With the given left part, extend right, searching for valid words.
                    extend_right([i, j], RACK, left_part, [i, j])

    print(best_across_word)

    # Compute the highest scoring down word.
    best_down_word = {
        'anchor': [-1, -1],
        'word': '',
        'score': 0
    }
