import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import App from "../App";

test("App should contains page heading text", () => {
  const testMessage = "Most starred github repositories in 30 days";
  const { queryByText } = render(<App />);
  expect(queryByText(testMessage)).toBeInTheDocument();
});
