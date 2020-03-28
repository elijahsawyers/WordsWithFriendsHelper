'''
Authors: Elijah Sawyers
Emails: elijahsawyers@gmail.com
Date: 03/28/2020
'''

def load_words():
    '''
    Returns a set of all words in the dictionary.
    '''
    with open('words.txt') as word_file:
        valid_words = set(word_file.read().split())

    return valid_words
