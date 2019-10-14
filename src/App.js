import React from "react";
import { css } from "emotion";
import RepositoryList from "./components/RepositoryList";

function App() {
  return (
    <div className={styles.appContainer}>
      <h1 className={styles.appHeading} data-testid="app-heading">
        Most
        <span className={styles.hightlightText}>
          &nbsp;starred github&nbsp;
        </span>
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
    @media (max-width: 576px) {
      text-align: center;
      display: inline-block;
    }
  `,
  hightlightText: css`
    color: #745eb5;
  `
};

export default App;
