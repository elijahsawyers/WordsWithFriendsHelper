from flask import (Flask, request, render_template, jsonify)

import best_game_move

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/bestGameMove', methods=['POST'])
def compute_best_game_move():
    return jsonify(best_game_move.compute(request.json))

if __name__ == '__main__':
    app.run()
