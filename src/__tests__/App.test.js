import React from "react";
import { cleanup, render } from "@testing-library/react";
import App from "../App";

afterEach(cleanup);

test("App should contains page heading text", () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId("app-heading")).toHaveTextContent(
    /most starred github repositories in 30 days/i
  );
});
