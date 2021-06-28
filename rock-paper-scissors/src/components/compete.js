import classes from "../css/compete.module.css";
import { useEffect, useState, useMemo, useRef, useContext } from "react";
import context from "../storage/store";
import firebase from "firebase/app";
import Background from "../components/body";
function Compete(props) {
  const storage = useContext(context);
  const [isCompleted, setIsCompleted] = useState(false);
  const seen = useRef();
  const [opp, setOpponent] = useState({});

  useEffect(() => {
    try {
      firebase
        .database()
        .ref("users/" + props.id.current + "/selection")
        .set(props.image);
    } catch (e) {}
  }, [props.image, props.id]);
  useEffect(() => {
    if (seen.current === true) {
      const timeout = setTimeout(() => {
        try {
          firebase
            .database()
            .ref(`meeting/${opp.connectedTo}/general/current`)
            .once("value", (current) => {
              firebase
                .database()
                .ref(`meeting/${opp.connectedTo}/general/total`)
                .once("value", (total) => {
                  if (current.val() > total.val()) {
                    firebase
                      .database()
                      .ref(`users/${opp.id}/score`)
                      .once("value", (opp_score) => {
                        firebase
                          .database()
                          .ref(`users/${props.id.current}/score`)
                          .once("value", (my_score) => {
                            if (my_score.val() === opp_score.val()) {
                              setIsCompleted("THE GAME ENDED AS A TIE");
                            } else if (my_score.val() > opp_score.val()) {
                              setIsCompleted("YOU WON THE GAME");
                            } else {
                              setIsCompleted("YOU LOST THE GAME");
                            }
                          });
                      });
                  } else {
                    storage.setSelection("");
                  }
                });
            });
          return () => clearTimeout(timeout);
        } catch (e) {}
      }, 5000);
    }
  }, [storage.setSelection, storage, opp.connectedTo, opp.id, props.id]);
  const win = useMemo(() => {
    let ret = { invalid: null, win: 1, fail: 0, tie: 2 };
    if (seen.current === true) {
      let my_entry = props.image;
      let opp_entry = opp.selection;

      let ret_val;
      if (my_entry === opp_entry) {
        ret_val = ret.tie;
      } else {
        if (my_entry === "paper") {
          if (opp_entry === "rock") {
            ret_val = ret.win;
          } else {
            ret_val = ret.fail;
          }
        } else if (my_entry === "scissors") {
          if (opp_entry === "rock") {
            ret_val = ret.fail;
          } else {
            ret_val = ret.win;
          }
        } else {
          if (opp_entry === "paper") {
            ret_val = ret.fail;
          } else {
            ret_val = ret.win;
          }
        }
      }
      try {
        if (props.type === "create") {
          if (ret_val !== 2) {
            const ref_1 = firebase
              .database()
              .ref(
                `users/${ret_val === ret.win ? props.id.current : opp.id}/score`
              );
            ref_1.once("value", (snapshot) => {
              firebase
                .database()
                .ref(
                  `users/${
                    ret_val === ret.win ? props.id.current : opp.id
                  }/score`
                )
                .set(snapshot.val() + 1);
            });
            const ref_2 = firebase
              .database()
              .ref(`meeting/${opp.connectedTo}/general/current`);

            ref_2.once("value", (snapshot) => {
              firebase
                .database()
                .ref(`meeting/${opp.connectedTo}/general/current`)
                .set(snapshot.val() + 1);
            });
          }
          firebase
            .database()
            .ref(`users/${props.id.current}/selection`)
            .set("");
          firebase.database().ref(`users/${opp.id}/selection`).set("");
        }
      } catch (e) {}
      return ret_val;
    }
    return ret.invalid;
  }, [opp, props.image, props.id, props.type]);
  // console.log(win);
  useEffect(() => {
    try {
      const ref = firebase.database().ref(`users/${props.id.current}`);
      ref.on("value", (snapshot) => {
        const data = snapshot.val();

        const meetingRef = firebase
          .database()
          .ref(`meeting/${data.connectedTo}`);
        meetingRef.on("value", (snapshot) => {
          try {
            let data = snapshot.val();
            let opponent =
              props.type === "create"
                ? data.player_join_id
                : data.player_create_id;

            const oppRef = firebase.database().ref(`users/${opponent}`);
            oppRef.on("value", (snapshot) => {
              try {
                if (snapshot.val().selection === "") {
                  const opponentInfo = snapshot.val();
                  oppRef.on("child_changed", (snapshot) => {
                    if (seen.current === undefined) {
                      opponentInfo.selection = snapshot.val();
                
                      seen.current = true;
                      setOpponent({
                        ...opponentInfo,
                        id: opponent,
                      });
                    }
                  });
                } else {
                  if (seen.current === undefined) {
                    seen.current = true;
                    setOpponent({
                      ...snapshot.val(),
                      id: opponent,
                    });
                  }
                }
              } catch (e) {}
            });
          } catch (e) {}
        });
      });

      return () => ref.off("value");
    } catch (e) {
      console.log("caught");
    }
  });

  if (isCompleted === false) {
    return (
      <section
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          className={classes.me}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {" "}
          <img
            src={`${process.env.PUBLIC_URL}/${props.image}.png`}
            alt="logo"
            style={{ width: "100%" }}
          />
        </div>
        <div
          className={classes.opp}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {Object.keys(opp).length === 0 ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className={classes.loading}></div>
              <h2
                style={{ width: "80%", fontSize: "3vw", textAlign: "center" }}
              >
                Waiting on player 2
              </h2>
            </div>
          ) : (
            <img
              src={`${process.env.PUBLIC_URL}/${opp.selection}.png`}
              alt="logo"
              style={{ width: "100%", transform: "rotateY(180deg)" }}
            />
          )}
        </div>
        <div className={classes.vs}>
          {win === null ? (
            <div>VS</div>
          ) : win === 1 ? (
            <div>You won the round</div>
          ) : win === 2 ? (
            <div>You tied the round</div>
          ) : (
            <div>You lost the round</div>
          )}
        </div>
      </section>
    );
  } else {
    return (
      <Background>
        <div>{isCompleted}</div>
        <div>You can refresh the page now.</div>
      </Background>
    );
  }
}
export default Compete;
