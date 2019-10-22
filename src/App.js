/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import React from "react";
import RepositoryList from "./components/RepositoryList";
import { upToSmall } from "./media-queries";

function App() {
  return (
    <div css={styles.appContainer}>
      <h1 css={styles.appHeading} data-testid="app-heading">
        Most
        <span css={styles.hightlightText}>&nbsp;starred github&nbsp;</span>
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

    ${upToSmall} {
      text-align: center;
      display: inline-block;
    }
  `,
  hightlightText: css`
    color: #745eb5;
  `
};

export default App;
