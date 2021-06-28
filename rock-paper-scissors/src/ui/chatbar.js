import classes from "../css/chat.module.css";
import { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
function Chat(props) {
  const [isHidden, setHidden] = useState(true);
  const [currMsg, setCurrMsg] = useState({});
  const [listMessages, storeNewMessage] = useState({});
  const [connectedTo, setConnectedTo] = useState("");
  const message = useRef();
  function unHide() {
    setHidden(false);
  }
  function hide() {
    setHidden(true);
  }
  useEffect(() => {
    const ref = firebase.database().ref(`users/${props.myid.current}`);
    ref.once("value", (snapshot) => {
      const data = snapshot.val();
      setConnectedTo(data.connectedTo);
    });
    return () => {
      ref.off("value");
    };
  }, [props, props.myid]);
  useEffect(() => {
    const ref = firebase
      .database()
      .ref(`meeting/${connectedTo}/general/messages`);
    ref.on("child_added", (snapshot) => {
      if (Object.keys(listMessages).indexOf(snapshot.key) === -1)
        storeNewMessage((prev) => {
          return { ...prev, [snapshot.key]: snapshot.val() };
        });
    });
    return () => {
      ref.off("child_added");
    };
  }, [connectedTo, listMessages]);
  useEffect(() => {
    const ref = firebase.database().ref(`users/${props.myid.current}`);
    ref.on("value", (snapshot) => {
      const data = snapshot.val();
      const meetingRef = firebase
        .database()
        .ref(`meeting/${data.connectedTo}/general/messages`);

      meetingRef.push(currMsg);
    });
    return () => ref.off("value");
  }, [currMsg, props.myid]);

  function sendMessage(e) {
    e.preventDefault();
    const newMessage = {
      username: props.myname,
      message: message.current.value,
    };

    setCurrMsg(newMessage);

    message.current.value = "";
  }

  if (isHidden) {
    return (
      <div
        className={classes.minimized + " " + classes.position}
        onClick={unHide}
      >
        <div>Chat with {props.opponent} </div>
        <i className="fa fa-caret-up" aria-hidden="true"></i>
      </div>
    );
  } else {
    return (
      <div className={classes.maximized + " " + classes.position}>
        <div style={{ width: "100%" }}>
          <div className={classes.minimized} onClick={hide}>
            {props.opponent}{" "}
            <i className="fa fa-caret-down" aria-hidden="true"></i>
          </div>
          <div className={classes.messages}>
            {Object.keys(listMessages).length === 0 ? (
              <div
                style={{
                  color: "grey",
                  textAlign: "center",
                  fontSize: "1rem",
                }}
              >
                You have no messages
                <hr style={{ width: "3rem" }} />
              </div>
            ) : (
              Object.values(listMessages).map((i, index) => {
                if (i.username === props.myname) {
                  return (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                      key={index}
                    >
                      <div className={classes.myText}>{i.message}</div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                      key={index}
                    >
                      <div className={classes.yourText}>{i.message}</div>
                    </div>
                  );
                }
              })
            )}
          </div>
          <form className={classes.form}>
            <input
              type="text"
              placeholder="message"
              className={classes.input}
              autoFocus
              ref={message}
            />
            <button className={classes.btn} onClick={sendMessage}>
              <i className="fa fa-send red-color "></i>
            </button>
          </form>
        </div>
      </div>
    );
  }
}
export default Chat;
