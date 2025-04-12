import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
const Diagram = ({ player, gameId, symbol, userId, chance, setChance }) => {
  const [spaces, setSpaces] = useState(
    new Array(3).fill(new Array(3).fill(""))
  );
  const [opponent, setOpponent] = useState("");
  const [opponentId, setOpponentId] = useState("");
  // const [chance, setChance] = useState("");
  const intervalRef = useRef(null);
  const currGameRef = useRef(null);
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      let status = await fetch(
        `http://127.0.0.1:5000/check_status?gameId=${gameId}`
      );
      status = await status.json();
      if (status["game_status"]) {
        setOpponent(
          status["player_1"] !== player
            ? status["player_1"]
            : status["player_2"]
        );
        setOpponentId(
          status["player_1"] !== player
            ? status["player1_id"]
            : status["player2_id"]
        );
        clearInterval(intervalRef.current);
        currGameRef.current = setInterval(async () => {
          let res = await fetch(
            `http://127.0.0.1:5000/game_status?gameId=${gameId}&playerName=${player}&userId=${userId}&chance=${chance}`,
            {
              method: "GET",
            }
          );
          res = await res.json();
          setSpaces((prev) => {
            let updatedSpaces = [];
            for (let i = 0; i < prev.length; i++) {
              let tmp = [];
              for (let j = 0; j < prev[i].length; j++) {
                if (
                  res["game_status"][i][j] !== "" &&
                  res["game_status"][i][j] !== symbol &&
                  prev[i][j] == ""
                ) {
                  if (symbol == "X") tmp.push("0");
                  else tmp.push("X");
                } else {
                  tmp.push(prev[i][j]);
                }
              }
              updatedSpaces.push(tmp);
            }
            return updatedSpaces;
          });
          if (res["game_over"]) {
            clearInterval(currGameRef.current);
            // {
            //   symbol === res["game_winner"]
            //     ? toast.success("You won the Game 😁😁😁", {
            //         position: "top-center",
            //         duration: 2500,
            //       })
            //     : toast.error("You lost the Game 😭😭😭", {
            //         position: "top-center",
            //         duration: 2500,
            //       });
            // }
          }
        }, 800);
      }
    }, 2000);
  }, [chance, gameId, player, symbol, userId]);

  const handleCellClick = async (r, c) => {
    let updatedSpaces = [];
    for (let i = 0; i < spaces.length; i++) {
      let tmp = [];
      for (let j = 0; j < spaces[i].length; j++) {
        if (i == r && j == c) {
          tmp.push(symbol);
        } else tmp.push(spaces[i][j]);
      }
      updatedSpaces.push(tmp);
    }
    setSpaces(updatedSpaces);
    let updatedStatus = await fetch("http://127.0.0.1:5000/update_game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId,
        row: r,
        col: c,
        symbol,
        playerName: player,
        userId: userId,
        chance,
      }),
    });
    updatedStatus = await updatedStatus.json();
    if(updatedStatus["game_over"])
    {
      symbol === updatedStatus["game_winner"]
        ? toast.success("You won the Game 😁😁😁", {
            position: "top-center",
            duration: 2500,
          })
        : toast.error("You lost the Game 😭😭😭", {
            position: "top-center",
            duration: 2500,
          });
    }
    let nextChanceRes = await fetch(
      `http://127.0.0.1:5000/next?currChance=${chance}&gameId=${gameId}`
    );
    nextChanceRes = await nextChanceRes.json();
    setChance(nextChanceRes["next_chance"]);
  };
  return (
    <>
      <div className="flex justify-center py-2">
        <p
          className={`text-center font-bold text-green-400 px-2 py-2 ${
            [player, userId].join("-") == chance && "border border-green-500"
          }`}
        >
          {player}
        </p>
        <p
          className={`text-center font-bold text-red-400 px-2 py-2  ${
            [opponent, opponentId].join("-") == chance &&
            "border border-green-500"
          }`}
        >
          {opponent}
        </p>
      </div>
      <div className="flex justify-center py-4">
        <div className="w-fit">
          <div className="grid grid-rows-3">
            {spaces.map((sub, index) => (
              <div key={index} className="grid grid-cols-3">
                {sub.map((s, i) => (
                  <div
                    onClick={() => handleCellClick(index, i)}
                    key={i + index}
                    className={`w-[70px] h-[70px] border border-black py-2 px-2 hover:bg-red-400 cursor-pointer flex justify-center items-center font-bold  ${
                      spaces[index][i] !== "" && "bg-red-600"
                    } text-white`}
                  >
                    {spaces[index][i]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Diagram;
