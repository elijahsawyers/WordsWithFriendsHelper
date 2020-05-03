'''
Authors: Elijah Sawyers
Emails: elijahsawyers@gmail.com
Date: 03/28/2020
'''

from flask import (Flask, request, render_template, jsonify)

import best_game_move

app = Flask(__name__)

@app.route('/')
def index():
    '''
    Main route, renders the application.
    '''

    return render_template('index.html')

@app.route('/bestGameMove', methods=['POST'])
def compute_best_game_move():
    '''
    Given gameboard data, return the best possible game move.
    '''

    return jsonify(best_game_move.compute(request.json))

# Run the web app.
if __name__ == '__main__':
    app.run()
