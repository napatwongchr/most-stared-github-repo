import React from "react";
import { css } from "emotion";
import RepositoryList from "./components/RepositoryList";

function App() {
  return (
    <div className={styles.appContainer}>
      <h1 className={styles.appHeading}>
        Most <span className={styles.hightlightText}>starred github</span>
        repositories in 30 days
      </h1>
      <RepositoryList />
    </div>
  );
}

const styles = {
  appContainer: css`
    label: app;
    padding: 0 30px;
  `,
  appHeading: css`
    display: flex;
    justify-content: center;
    font-family: "Lobster", cursive;
    margin: 45px 0;
    color: #262626;
  `,
  hightlightText: css`
    color: #745eb5;
    margin: 0 10px;
  `
};

export default App;
