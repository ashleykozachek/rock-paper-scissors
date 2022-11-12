from flask import Flask, request
from random import randint
from peewee import *
from uuid import uuid4 as uuid

db = SqliteDatabase("./user_db", pragmas={
        'cache_size': -1 * 64000,  # 64MB
        'ignore_check_constraints': 1,
    }
)

class User(Model):
    class Meta:
        database = db
    id = AutoField()
    user_id = UUIDField()
    wins = IntegerField(default=0)
    losses = IntegerField(default=0)
    draws = IntegerField(default=0)

api = Flask(__name__)

def init_db():
    with db:
        db.create_tables([User])

init_db()

win = "WIN"
draw = "DRAW"
lose = "LOSE"

def compute_winner(player_one_move: str, player_two_move: str):
    if player_one_move == player_two_move:
        return draw
    if player_one_move == "ROCK":
        if (player_two_move == "PAPER"):
            return lose
        return win
    if player_one_move == "PAPER":
        if (player_two_move == "SCISSORS"):
            return lose
        return win
    if player_one_move == "SCISSORS":
        if (player_two_move == "ROCK"):
            return lose
        return win
    raise Exception("Player one move or player two move in invalid state")

def create_user(user_id=uuid()):
    with db:
        new_user = User(user_id=user_id)
        print(new_user)
        new_user.save(force_insert=True)
        return user_id

def handle_cookie():
    user_id = request.cookies.get("user_id")
    if not user_id:
        user_id = create_user()
    else:
        try:
            User.get(user_id=user_id)
        except User.DoesNotExist:
            create_user(user_id)
    return user_id

@api.route("/test")
def test_response():
    response_body = {
        "resp": "Test response"
    }

    return response_body

@api.route("/wins", methods=["POST"])
def handle_wins():
    user_id = handle_cookie()
    user = User.get(user_id=user_id)
    user.wins = (request.get_json() or {}).get("wins", user.wins)
    user.save()
    return {
        "wins": user.wins,
        "user_id": user_id,
    }
    

@api.route("/losses", methods=["POST"])
def handle_losses():
    user_id = handle_cookie()
    user = User.get(user_id=user_id)
    user.losses = (request.get_json() or {}).get("losses", user.losses)
    user.save()
    return {
        "losses": user.losses,
        "user_id": user_id,
    }

@api.route("/draws", methods=["POST"])
def handle_draws():
    user_id = handle_cookie()
    user = User.get(user_id=user_id)
    user.draws = (request.get_json() or {}).get("draws", user.draws)
    user.save()
    return {
        "draws": user.draws,
        "user_id": user_id,
    }

@api.route("/games", methods=["POST", "GET"])
def handle_games():
    user_id = handle_cookie()
    with db:
        user = User.get(user_id=user_id)
        
        to_return = {
            "wins": user.wins,
            "losses": user.losses,
            "draws": user.draws,
            "user_id": user_id,
        }
        if request.method == "POST":
            data = request.get_json()
            player_one_move = data.get("player_one_move")
            player_two_move = data.get("player_two_move")
            is_win = compute_winner(player_one_move, player_two_move)
            print(type(user.wins))
            if is_win == win:
                user.wins += 1
                to_return["wins"] = user.wins
            elif is_win == draw:
                user.draws += 1
                to_return["draws"] = user.draws
            else:
                user.losses += 1
                to_return["losses"] = user.losses
            user.save()
            to_return["win_state"] = is_win
        return to_return


@api.route("/move", methods=["GET"])
def get_ai_move():
    possible_moves = ["ROCK", "PAPER", "SCISSORS"]
    selected_move = possible_moves[randint(0, 2)]
    return {
        "move": selected_move
    }
