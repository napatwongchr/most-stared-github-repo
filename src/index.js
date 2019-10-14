import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Global } from "@emotion/core";
import App from "./App";

ReactDOM.render(
  <Fragment>
    <Global
      styles={{
        body: {
          margin: 0,
          padding: 0,
          fontSize: "18px",
          backgroundColor: "#F1F3F5",
          fontFamily: "Arvo, serif"
        }
      }}
    />
    <App />
  </Fragment>,
  document.getElementById("root")
);
