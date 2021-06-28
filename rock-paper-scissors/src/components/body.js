import classes from "../css/body.module.css";
function Background(props) {
  return <section className={classes.body}>{props.children}</section>;
}
export default Background;
