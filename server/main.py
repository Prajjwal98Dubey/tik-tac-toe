from flask import Flask,request,jsonify
from flask_cors import CORS
from collections import defaultdict
from helpers import checkGameWin

app = Flask(__name__)

CORS(app,origins=["http://localhost:5173"])

# track games
games = defaultdict(list)

# game structure
game_struct = {}

@app.post("/add_user")
def addUser():
    data = request.get_json()
    user_name = data["user"]
    user_id = data["userId"]
    game_id = data["gameId"]
    games[game_id].append(user_id)
    if(len(games[game_id]) == 2):
        game_struct[game_id] = [["" for _ in range(3)]for i in range(3)]
        return jsonify({"game_status":True})
    return jsonify({"game_status":False})

@app.get("/check_status")
def check_game_status():
    game_id = request.args.get("gameId")
    # print("game id",game_id)
    if(len(games[game_id]) == 2): return jsonify({"game_status":True})
    return jsonify({"game_status":False})
    

@app.post("/update_game")
def update_game_status():
    req_data = request.get_json()
    print(req_data)
    game_id = req_data["gameId"]
    row = req_data["row"]  # row in the 2D matrix
    col = req_data["col"]  # col in the 2D matrix
    sym = req_data["symbol"]
    for i in range(len(game_struct[game_id])):
        flag = 0
        for j in range(len(game_struct[game_id][i])):
            if i == row and j == col:
                game_struct[game_id][i][j] = sym
                flag = 1
                break
        if flag:
            break
    game_over = False
    game_winner = ''
    [status,winner] = checkGameWin.check_game_win(game_struct[game_id])
    if status:
        game_over = True
        game_winner = winner
    return jsonify({"game_status":game_struct[game_id],"game_over":game_over,"game_winner":game_winner})
    
@app.get("/game_status")
def game_status():
    game_id = request.args.get("gameId")
    game_over = False
    game_winner = ''
    [status,winner] = checkGameWin.check_game_win(game_struct[game_id])
    if status:
        game_over = True
        game_winner = winner
    return jsonify({"game_status":game_struct[game_id],"game_over":game_over,"game_winner":game_winner})
    # return jsonify({"game_status":game_struct[game_id]})
    
    