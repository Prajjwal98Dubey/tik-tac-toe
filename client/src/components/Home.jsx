import { useState } from "react";
import Diagram from "./Diagram";
import { nanoid } from "nanoid";

const Home = () => {
  const [user, setUser] = useState("");
  const [gameId, setGameId] = useState("");
  const [isJoin, setIsJoin] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [userId, setUserId] = useState("");
  const [chance, setChance] = useState("");

  const handleJoinGame = async () => {
    setIsJoin(true);
    setSymbol("0");
    let user_id = nanoid();
    setUserId(user_id);
    let res = await fetch("http://127.0.0.1:5000/add_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        userId: user_id,
        gameId: gameId,
      }),
    });
    res = await res.json();
    if (res["game_status"]) {
      let nextChanceRes = await fetch(
        `http://127.0.0.1:5000/next?currChance=${chance}&gameId=${gameId}`
      );
      nextChanceRes = await nextChanceRes.json();
      setChance(nextChanceRes["next_chance"]);
    }
  };

  const handleCreateGame = async () => {
    setSymbol("X");
    setGameId(gameId != "" ? gameId : nanoid());
    setIsJoin(true);
    let user_id = nanoid();
    setUserId(user_id);
    await fetch("http://127.0.0.1:5000/add_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        userId: user_id,
        gameId: gameId != "" ? gameId : nanoid(),
      }),
    });
    setChance([user, user_id].join("-"));
  };

  return (
    <div className="font-sans">
      <p className="flex justify-center text-3xl font-bold text-red-600">
        Tic-Tac-Toe
      </p>
      {!isJoin && (
        <>
          <div className="flex justify-center py-2">
            <div>
              <div className="py-1">
                <input
                  type="text"
                  value={user}
                  placeholder="enter your name"
                  onChange={(e) => setUser(e.target.value)}
                  className="w-[400px] h-[40px] px-2 py-2 border border-gray-400"
                />
              </div>
              <div className="py-1">
                <input
                  type="text"
                  value={gameId}
                  placeholder="enter game id"
                  onChange={(e) => setGameId(e.target.value)}
                  className="w-[400px] h-[40px] px-2 py-2 border border-gray-400"
                />
              </div>
              <div className="flex justify-center px-2">
                <button
                  onClick={handleCreateGame}
                  className="w-fit h-[40px] py-2 px-2 bg-red-500 hover:bg-red-600 cursor-pointer text-white font-bold m-1 "
                >
                  Create Game
                </button>
                <button
                  onClick={handleJoinGame}
                  className="w-fit h-[40px] py-2 px-2 bg-red-500 hover:bg-red-600 cursor-pointer text-white font-bold m-1 "
                >
                  Join Game
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {isJoin && (
        <Diagram
          player={user}
          gameId={gameId}
          symbol={symbol}
          userId={userId}
          chance={chance}
          setChance={setChance}
        />
      )}
    </div>
  );
};

export default Home;
