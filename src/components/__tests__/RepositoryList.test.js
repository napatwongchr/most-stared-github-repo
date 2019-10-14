import React from "react";
import { render, cleanup } from "@testing-library/react";
import RepositoryList from "../RepositoryList";

afterEach(cleanup);

test("Repository list should contains repository item", () => {
  const { getByTestId } = render(<RepositoryList />);
  expect(getByTestId("repository-item")).toBeInTheDocument();
});

test("Repository list should show 'No repository found.' when no repository result", () => {
  const testMessage = "No repository found";
  const { queryByText } = render(<RepositoryList />);
  expect(queryByText(testMessage)).toBeInTheDocument();
});

test("Repository list should show list of repository when repository exists", () => {});

test("Repository list should fetch when scroll to the end", () => {});
