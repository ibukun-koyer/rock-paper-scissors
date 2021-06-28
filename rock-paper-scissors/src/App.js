import { useState, useEffect } from "react";
import classes from "./css/body.module.css";

import Background from "./components/body";

import CardForm from "./components/username";

import LinkPlayers from "./components/server_option";

import context from "./storage/store";
import { useContext, useRef } from "react";

import firebase from "firebase/app";
import "firebase/database";

import animatePoint from "./css/link.module.css";

import Information from "./components/info_bar";

import Game from "./components/game_play";

import Compete from "./components/compete";

const start_text = (
  <div>
    <div>Hi player.</div>
    <div style={{ fontSize: "1rem", color: "rgb(190, 190, 190)" }}>
      (DO NOT REFRESH THIS PAGE.)
    </div>
  </div>
);

function App() {
  const storage = useContext(context);

  const [isHi, setHiCond] = useState(0);

  const id = useRef();

  useEffect(() => {
    if (isHi < 3) {
      let timeout = setInterval(() => {
        setHiCond((prev) => prev + 1);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isHi]);
  useEffect(() => {
    if (storage.number !== 0) {
      const userRef = firebase.database().ref("users");

      const user = {
        username: storage.username,
        rounds: storage.number,
        connected: false,
        connectedTo: "",
        score: 0,
        selection: "",
      };
      const ref = userRef.push(user);

      id.current = ref.key;
    }
  }, [storage.number, storage.username]);
  useEffect(() => {
    window.onbeforeunload = () => {
      const userRef = firebase.database().ref(`users/${id.current}`);

      userRef.once("value", (snapshot) => {
        firebase
          .database()
          .ref(`meeting/${snapshot.val().connectedTo}`)
          .remove();
        userRef.remove();
      });
    };
    return () => (window.onbeforeunload = () => {});
  });
  useEffect(() => {
    const ref = firebase.database().ref(`meeting`);
    ref.on("child_removed", (snapshot) => {
      firebase
        .database()
        .ref(`users/${id.current}`)
        .on("value", (snap) => {
          if (snap.val().connectedTo === snapshot.key) {
            setHiCond(4);
          }
        });
    });
    return () => ref.off("child_removed");
  });

  useEffect(() => {
    if (storage.player_2_game_id !== "" && storage.player_2_game_id !== true) {
      const userRef = firebase
        .database()
        .ref(`users/${storage.player_2_game_id}`);

      if (
        storage.player_2_game_id === id.current ||
        typeof storage.player_2_game_id === "boolean"
      ) {
        storage.addGameId(false);
      } else {
        userRef.on("value", function (snapshot) {
          if (snapshot.val() === null) {
            storage.addGameId(false);
          } else if (
            Object.values(snapshot.val())[
              Object.keys(snapshot.val()).indexOf("connected")
            ] === true
          ) {
            storage.addGameId(false);
          } else {
            const updates = {};
            updates[`users/${id.current}/connected`] = true;
            updates[`users/${storage.player_2_game_id}/connected`] = true;
            firebase
              .database()
              .ref()
              .update(updates)
              .then(() => {
                const newRef = firebase.database().ref(`meeting`);
                const meetingInfo = {
                  general: {
                    current: 1,
                    total: parseInt(
                      Object.values(snapshot.val())[
                        Object.keys(snapshot.val()).indexOf("rounds")
                      ]
                    ),
                    messages: [],
                  },
                  player_join_id: id.current,
                  player_create_id: storage.player_2_game_id,
                };
                const ref = newRef.push(meetingInfo);
                const new_updates = {};
                new_updates[`users/${id.current}/connectedTo`] = ref.key;
                new_updates[`users/${storage.player_2_game_id}/connectedTo`] =
                  ref.key;
                firebase.database().ref().update(new_updates);

                storage.addGameId(true);
                storage.setType("join");
              })
              .catch((e) => {
                storage.addGameId(false);
              });
          }
        });
      }
      return () => userRef.off("value");
    }
  }, [storage.player_2_game_id, storage]);
  if (isHi < 2) {
    return (
      <Background>
        <div className={isHi === 0 ? classes.fadeIn : classes.fadeOut}>
          {start_text}
        </div>
      </Background>
    );
  }
  if (isHi === 4) {
    return (
      <Background>
        <div className={classes.error}>Player 2 left the session</div>
      </Background>
    );
  }
  if (storage.username === "") {
    const username_params = {
      placeholder: "Username",
      question: "what is your name?",
      type: "text",
      min: "1",
    };
    return (
      <Background>
        <CardForm
          placeholder={username_params.placeholder}
          question={username_params.question}
          type={username_params.type}
          min={username_params.min}
        />
      </Background>
    );
  }
  if (storage.number === 0) {
    const username_params = {
      placeholder: "Rounds",
      question: "How many rounds are you up for?",
      type: "number",
      min: "1",
    };
    return (
      <div>
        <Background>
          <CardForm
            placeholder={username_params.placeholder}
            question={username_params.question}
            type={username_params.type}
            min={username_params.min}
          />
        </Background>
      </div>
    );
  }
  if (storage.player_2_game_id === false) {
    return (
      <Background>
        <div className={classes.error}>Connection failed</div>
        <LinkPlayers className={classes.fadeIn} gameId={id} />
      </Background>
    );
  }
  if (storage.selection !== "") {
    return <Compete image={storage.selection} id={id} type={storage.type} />;
  }
  if (storage.player_2_game_id === true) {
    return (
      <Background>
        <Information
          className={classes.fadeIn}
          id={id}
          myname={storage.username}
        />
        <h2>Select an option</h2>
        <Game id={id} />
      </Background>
    );
  }
  if (storage.player_2_game_id === "") {
    return (
      <Background>
        <LinkPlayers className={classes.fadeIn} gameId={id} />
      </Background>
    );
  }

  return (
    <Background>
      <div style={{ fontSize: "1.5rem" }}>
        Validating connection<span className={animatePoint.animateStops}></span>
      </div>
    </Background>
  );
}

export default App;
