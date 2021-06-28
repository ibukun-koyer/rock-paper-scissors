import Card from "../ui/card";
import classes from "../css/username.module.css";
import "font-awesome/css/font-awesome.min.css";
import { useState } from "react";
import context from "../storage/store";
import { useContext, useRef } from "react";

function CardForm(props) {
  const inputValue = useRef();
  const storage = useContext(context);
  const [jmpPlaceholder, setJmpPlaceholder] = useState(false);
  const [val, setVal] = useState("");

  function focusHandler() {
    setJmpPlaceholder(true);
  }
  function blurHandler() {
    setJmpPlaceholder(false);
  }
  function submitHandler(e) {
    e.preventDefault();
    if (props.question.indexOf("name") !== -1) {

      storage.addUsername(val);
    } else if (props.question.indexOf("round") !== -1) {
      if (val === "") {
        storage.addNumber(1);
      } else {
        storage.addNumber(val);
      }
    } else {
      storage.addGameId(val.trim());
    }
  }
  function store() {
    setVal(inputValue.current.value);
  }

  return (
    <div>
      <Card>
        <form onSubmit={submitHandler}>
          <h1>{props.question}</h1>
          {jmpPlaceholder === false ? (
            <input
              type={props.type}
              required
              placeholder={props.placeholder}
              className={classes.input}
              onFocus={focusHandler}
              value={val}
              readOnly
            />
          ) : (
            <div style={{ position: "relative" }}>
              <input
                type={props.type}
                required
                min={props.type === "text" ? "" : props.min}
                minLength={props.type === "text" ? props.min : ""}
                className={classes.input + " " + classes.updatedInput}
           
                onFocus={focusHandler}
                autoFocus
                name={props.placeholder}
                ref={inputValue}
                onBlur={blurHandler}
                value={val}
                onChange={store}
              />
              <div className={classes.newPlaceholder}>{props.placeholder}</div>
            </div>
          )}
          <div className={classes.center}>
            <button className={classes.btn}>
              Next <i className="fa fa-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
export default CardForm;
