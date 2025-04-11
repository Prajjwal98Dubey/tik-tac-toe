

def check_game_win(grid):
    ROWS = len(grid)
    COLS = len(grid[0])
    def check(tmp):
        if tmp == "XXX":
            return [True,"X"]
        elif tmp == "000":
            return [True,"0"]    
        else:
            return []
    # vertical check
    for c1 in range(COLS):
        t = ""
        for r1 in range(ROWS):
            t += grid[r1][c1]
        res = check(t)
        if len(res) == 2:
            return res
    # horizontal check
    for r2 in range(ROWS):
        t = ""
        for c2 in range(COLS):
            t += grid[r2][c2]
        res = check(t)
        if len(res) == 2:
            return res
    
    # Diagonal Check
    r3=0
    c3=0
    t = ""
    while r3 < ROWS and c3 < COLS:
        t += grid[r3][c3]
        r3+=1
        c3+=1
    res = check(t)
    if len(res) == 2:
        return res
    r4 = 0
    c4 = 0
    t = ""
    while r4 < ROWS and c4 < COLS:
        t += grid[r4][c4]
        r4+=1
        c4+=1
    res = check(t)
    if len(res) == 2:
        return res
    return [False,""]
