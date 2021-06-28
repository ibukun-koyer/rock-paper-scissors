import classes from "../css/link.module.css";
import "font-awesome/css/font-awesome.min.css";
import CardForm from "./username";
import { useContext } from "react";
import context from "../storage/store";
import { useState, useEffect } from "react";
import firebase from "../firebase";
function LinkPlayers(props) {
  const storage = useContext(context);
  const [option, setOption] = useState("");
  function joinSession() {
    setOption("join");
  }
  function createSession() {
    storage.setType("create");
    setOption("create");
  }
  useEffect(() => {
 
    if (storage.type === "create") {
      const ref = firebase.database().ref("/users/" + props.gameId.current);
  
      ref.on("child_changed", (snapshot) => {
        if (
          Object.values(snapshot.val())[
            Object.keys(snapshot.val()).indexOf("connectedTo")
          ] === ""
        ) {
    
          storage.addGameId("STRING");
        } else {
      
          storage.addGameId(true);
        }
      });
      return () => ref.off("child_changed");
    }
  });
  if (option === "") {
    return (
      <div className={classes.bdy + " " + props.className}>
        <header>What would you like to do?</header>
        <div className={classes.opt}>
          <div>Join session</div>
          <button onClick={joinSession}>
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
        <div className={classes.opt}>
          <div>Create a session</div>
          <button onClick={createSession}>
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    );
  }

  if (option === "join") {
    const username_params = {
      placeholder: "GameId",
      question: "Enter session creators game id?",
      type: "text",
      min: "1",
    };
    return (
      <div>
        <CardForm
          placeholder={username_params.placeholder}
          question={username_params.question}
          type={username_params.type}
          min={username_params.min}
        />
        <button
          className={classes.btn}
          style={{ marginTop: "2rem" }}
          onClick={createSession}
        >
          Create a session
        </button>
      </div>
    );
  }
  if (option === "create") {
    return (
      <div
        className={props.className}
        style={{ width: "50%", textAlign: "center", fontSize: "1rem" }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/clip.png`}
          alt="logo"
          className={classes.img}
        />
        <div>
          Your Game id is{" "}
          <span style={{ fontSize: "1.5rem", color: "greenyellow" }}>
            {props.gameId.current}
          </span>
        </div>
        <div>
          Please share this id with player 2 to allow player 2 join your
          session.
        </div>
        <div style={{ marginTop: "1rem", fontSize: "1.5rem" }}>
          Waiting for player 2 to join the session
          <span className={classes.animateStops}></span>
        </div>
        <button className={classes.btn} onClick={joinSession}>
          Join a session
        </button>
      </div>
    );
  }
}
export default LinkPlayers;
