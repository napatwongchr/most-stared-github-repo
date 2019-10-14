import React from "react";
import ReactDOM from "react-dom";
import { injectGlobal } from "emotion";
import App from "./App";

injectGlobal`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-size: 18px;
    background-color: #F1F3F5;
    font-family: Arvo, "serif";
    color: #262626;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
