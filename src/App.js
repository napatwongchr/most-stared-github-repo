import React from "react";
import { css } from "emotion";

function App() {
  return (
    <div>
      <h1
        className={css`
          background-color: khaki;
        `}
      >
        Most starred github repositories in 30 days
      </h1>
    </div>
  );
}

export default App;
