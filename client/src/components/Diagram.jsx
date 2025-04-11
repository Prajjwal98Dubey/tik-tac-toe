/// https://www.linkedin.com/in/prajjwal-dubey-8a1938182/

import { useEffect, useRef, useState } from "react";

const Diagram = ({ player, gameId, symbol }) => {
  const [spaces, setSpaces] = useState(
    new Array(3).fill(new Array(3).fill(""))
  );
  const intervalRef = useRef(null);
  const currGameRef = useRef(null);
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      let status = await fetch(
        `http://127.0.0.1:5000/check_status?gameId=${gameId}`
      );
      status = await status.json();
      // console.log("HERE => ", status["game_status"]);
      if (status["game_status"]) {
        clearInterval(intervalRef.current);
        currGameRef.current = setInterval(async () => {
          let res = await fetch(
            `http://127.0.0.1:5000/game_status?gameId=${gameId}`,
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
            alert(`Winner of the Game is ${res["game_winner"]}`);
          }
        }, 800);
      }
    }, 3500);
  }, [gameId, symbol]);
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

    await fetch("http://127.0.0.1:5000/update_game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId,
        row: r,
        col: c,
        symbol,
      }),
    });
  };
  return (
    <>
      {/* {console.log(spaces)} */}
      <div className="flex justify-center py-2">
        <p className="text-center font-bold text-green-400">{player}</p>
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
                    className="w-[70px] h-[70px] border border-black py-2 px-2 hover:bg-red-400 cursor-pointer"
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
