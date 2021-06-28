import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { GameContext } from "./storage/store";
ReactDOM.render(
  <GameContext>
    <App />
  </GameContext>,
  document.getElementById("root")
);
