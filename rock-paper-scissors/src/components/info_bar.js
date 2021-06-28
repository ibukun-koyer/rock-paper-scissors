import classes from "../css/info.module.css";
import { useState, useEffect, useContext } from "react";
import context from "../storage/store";
import firebase from "firebase/app";
import Chat from "../ui/chatbar";
function Information(props) {
  const storage = useContext(context);
  const [pageInfo, setPageInfo] = useState({
    my_score: 0,
    opponent_score: 0,
    opponent_name: "",
    current: 1,
    total: 1,
  });
  useEffect(() => {
    const ref = firebase.database().ref(`users/${props.id.current}`);
    const updated_obj = {
      my_score: 0,
      opponent_score: 0,
      opponent_name: "",
      current: 0,
      total: 0,
    };
    try {
      ref.once("value", (snapshot) => {
        const data = snapshot.val();
        updated_obj.my_score = data.score;
        const meetingRef = firebase
          .database()
          .ref(`meeting/${data.connectedTo}`);
        console.log(meetingRef);
        meetingRef
          .once("value", (snapshot_2) => {
            const data_2 = snapshot_2.val();
            updated_obj.current = data_2.general.current;
            updated_obj.total = data_2.general.total;

            let opponent =
              storage.type === "create"
                ? data_2.player_join_id
                : data_2.player_create_id;
            const oppRef = firebase.database().ref(`users/${opponent}`);
            oppRef.once("value", (snapshot_3) => {
              const data_3 = snapshot_3.val();
              updated_obj.opponent_score = data_3.score;
              updated_obj.opponent_name = data_3.username;

              setPageInfo(updated_obj);
            });
          })
          .catch((e) => {});
      });
    } catch (e) {}
  }, [props.id, storage.type]);
  useEffect(() => {});
  return (
    <section className={classes.style + " " + props.className}>
      <div className={classes.title} style={{ textAlign: "left" }}>
        <div style={{ marginBottom: "0.5rem" }}>Rock, paper, scissors</div>
        <div
          style={{
            fontSize: "1.2rem",
            color: "rgb(190, 190, 190)",
            lineHeight: "20px",
          }}
        >
          <div>My score : {pageInfo.my_score}</div>
          <div>
            {pageInfo.opponent_name}'s score: {pageInfo.opponent_score}
          </div>
        </div>
      </div>
      <div className={classes.info}>
        {pageInfo.current}/{pageInfo.total}
      </div>

      <Chat
        opponent={pageInfo.opponent_name}
        myname={props.myname}
        myid={props.id}
      />
    </section>
  );
}
export default Information;
