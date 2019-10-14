import React from "react";
import { css } from "emotion";
import RepositoryList from "./components/RepositoryList";

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
      <RepositoryList />
    </div>
  );
}

export default App;
