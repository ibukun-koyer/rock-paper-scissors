import { createContext, useState } from "react";
const context = createContext({
  username: "",
  number_of_rounds: 0,
  player_2_game_id: "",
  type: "",
  selection: "",
  addUsername: () => {},
  addNumber: () => {},
  addGameId: () => {},
  setType: () => {},
  setSelection: () => {},
});
export function GameContext(props) {
  const [name, addName] = useState("");
  const [number, addNumber] = useState(0);
  const [gameId, setGameId] = useState("");
  const [type, settype] = useState("");
  const [select, setSelect] = useState("");
  // ref.current = "";
  function addUsername(name) {
    addName(name);
  }
  function addNum(number) {
    addNumber(number);
  }
  function setID(gameId) {
    setGameId(gameId);
  }
  function setType(type) {
    settype(type);
  }
  function setSelection(selection) {
    setSelect(selection);
  }
  const values = {
    type: type,
    username: name,
    number: number,
    selection: select,
    player_2_game_id: gameId,
    addUsername: addUsername,
    addNumber: addNum,
    addGameId: setID,
    setType: setType,
    setSelection: setSelection,
  };
  return <context.Provider value={values}>{props.children}</context.Provider>;
}

export default context;
