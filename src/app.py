import os
from flask import Flask, render_template

template_dir = os.path.abspath('./src')
static_dir = os.path.abspath('./src/static')
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
PORT = 8080

@app.route("/game-2048/")
def game_2048():
  content = {
    'site_name': '2048 Game',
    'game_nav': {
      'title': '2048',
      'score_board': [
        {
          'title': 'Score',
          'value': 0,
          'class_name': 'js-game-score'
        },
        {
          'title': 'Best Score',
          'value': 0,
          'class_name': 'js-best-score'
        }
      ]
    },
    'board_size': 4,
    'gameover_details': {
      'title': 'Game Over',
      'play_again_button': 'Play Again'
    }
  }

  return render_template('pages/game-2048.jinja',
                          content=content)

if __name__ == '__main__':
  app.run(port=PORT, debug=True)