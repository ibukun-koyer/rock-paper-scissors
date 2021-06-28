import classes from "../css/icons.module.css";
import context from "../storage/store";
import { useContext } from "react";
// import firebase from "firebase";
function Game(props) {
  const storage = useContext(context);
  function handlePaper() {
    storage.setSelection("paper");
  }
  function handleRock() {
    storage.setSelection("rock");
  }
  function handleScissors() {
    storage.setSelection("scissors");
  }
  return (
    <div
      style={{
        width: "80%",
        display: "flex",
        justifyContent: "space-evenly",
        flexDirection: "column",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <div className={classes.bkg + " " + classes.red} onClick={handleRock}>
        <img
          src={`${process.env.PUBLIC_URL}/rock.png`}
          alt="logo"
          className={classes.icons}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <div className={classes.bkg + " " + classes.blue} onClick={handlePaper}>
          <img
            src={`${process.env.PUBLIC_URL}/paper.png`}
            alt="logo"
            className={classes.icons}
          />
        </div>
        <div
          className={classes.bkg + " " + classes.green}
          onClick={handleScissors}
        >
          <img
            src={`${process.env.PUBLIC_URL}/scissors.png`}
            alt="logo"
            className={classes.icons}
          />
        </div>
      </div>
    </div>
  );
}
export default Game;
