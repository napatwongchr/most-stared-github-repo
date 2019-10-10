import React from "react";
import ReactDOM from "react-dom";
import { css } from "emotion";

function App() {
  return (
    <h1
      className={css`
        background-color: khaki;
      `}
    >
      Hello world
    </h1>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
