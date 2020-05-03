'''
Authors: Elijah Sawyers
Emails: elijahsawyers@gmail.com
Date: 03/28/2020
'''

import os

def load_words():
    '''
    Returns a set of all words in the dictionary.
    '''

    with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'words.txt')) as word_file:
        valid_words = set(word_file.read().split())

    return valid_words
