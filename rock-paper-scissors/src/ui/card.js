import classes from "../css/card.module.css";

function Card(props) {
  return (
    <div className={classes.card + " " + classes.fade}>{props.children}</div>
  );
}
export default Card;
