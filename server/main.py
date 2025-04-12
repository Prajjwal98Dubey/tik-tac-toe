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
    games[game_id].append([user_name,user_id])
    if(len(games[game_id]) == 2):
        game_struct[game_id] = [["" for _ in range(3)]for i in range(3)]
        return jsonify({"game_status":True,"player_1":games[game_id][0][0],"player_2":games[game_id][1][0]})
    return jsonify({"game_status":False})

@app.get("/check_status")
def check_game_status():
    game_id = request.args.get("gameId")
    # print("game id",game_id)
    if(len(games[game_id]) == 2): 
        return jsonify({"game_status":True,"player_1":games[game_id][0][0],"player_2":games[game_id][1][0],"start":games[game_id][0],"player1_id":games[game_id][0][1],"player2_id":games[game_id][1][1]})
    return jsonify({"game_status":False})
    

@app.post("/update_game")
def update_game_status():
    req_data = request.get_json()
    game_id = req_data["gameId"]
    row = req_data["row"]  # row in the 2D matrix
    col = req_data["col"]  # col in the 2D matrix
    sym = req_data["symbol"]
    user_name = req_data["playerName"]
    user_id = req_data["userId"]
    chance = req_data["chance"]
    if len(chance) == 0:
        # chance = games[game_id][1].join("-")
        chance = "".join(games[game_id][1])
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
    return jsonify({"game_status":game_struct[game_id],"game_over":game_over,"game_winner":game_winner,"next_chance":games[game_id][0] if chance.split("-") == games[game_id][1] else games[game_id][1]})
    
@app.get("/game_status")
def game_status():
    game_id = request.args.get("gameId")
    user_name = request.args.get("playerName")
    user_id = request.args.get("userId")
    chance = request.args.get("chance")

    if len(chance) == 0:
        chance = "".join(games[game_id][1])
    game_over = False
    game_winner = ''
    [status,winner] = checkGameWin.check_game_win(game_struct[game_id])
    if status:
        game_over = True
        game_winner = winner
    return jsonify({"game_status":game_struct[game_id],"game_over":game_over,"game_winner":game_winner,"next_chance":games[game_id][0] if chance.split("-") == games[game_id][1] else games[game_id][1] })
    # return jsonify({"game_status":game_struct[game_id]})
    
    
    
@app.get("/next")
def get_next_chance():
    curr_chance = request.args.get("currChance")
    game_id = request.args.get("gameId")
    if len(curr_chance) == 0:
        return jsonify({"next_chance":"-".join(games[game_id][0])})
    return jsonify({"next_chance":"-".join(games[game_id][0]) if curr_chance.split("-") == games[game_id][1] else "-".join(games[game_id][1])})