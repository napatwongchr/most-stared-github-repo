import React from "react";
import {
  render,
  cleanup,
  waitFor,
  screen,
  fireEvent
} from "@testing-library/react";
import RepositoryList from "../RepositoryList";
import * as api from "../../api";

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

test("Repository list should render properly", async () => {
  const apiCall = jest
    .spyOn(api, "searchRepository")
    .mockImplementationOnce(() => {
      return Promise.resolve({
        data: {
          items: [{ id: 1 }, { id: 2 }]
        }
      });
    });

  const { getByTestId } = render(<RepositoryList />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  await waitFor(() => expect(apiCall).toHaveBeenCalledTimes(1));

  expect(getByTestId("repository-list")).toBeInTheDocument();
  expect(getByTestId("repository-list").childNodes.length).toBe(2);
});

test("Repository list should show 'No repository found.' when no repository result", async () => {
  const apiCall = jest
    .spyOn(api, "searchRepository")
    .mockImplementationOnce(() => {
      return Promise.resolve({
        data: null
      });
    });

  render(<RepositoryList />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => expect(apiCall).toHaveBeenCalledTimes(1));

  expect(screen.getByText(/no repositories./i)).toBeInTheDocument();
});

test("Repository list should show 'Error fetching repositories.' when error occured", async () => {
  const apiCall = jest
    .spyOn(api, "searchRepository")
    .mockImplementationOnce(() => {
      return Promise.reject("error");
    });

  render(<RepositoryList />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  await waitFor(() => expect(apiCall).toHaveBeenCalledTimes(1));
  expect(screen.getByText(/error fetching repositories./i)).toBeInTheDocument();
});

test("Repository list should fetch when scroll to the end", async () => {
  const uuidv1 = require("uuid/v1");
  const apiCall = jest.spyOn(api, "searchRepository").mockImplementation(() => {
    return Promise.resolve({
      data: {
        items: [{ id: uuidv1() }, { id: uuidv1() }]
      }
    });
  });
  const { getByTestId } = render(<RepositoryList />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  await waitFor(() => expect(apiCall).toHaveBeenCalledTimes(1));

  fireEvent.scroll(window, {
    target: { scrollingElement: { scrollTop: 1000, offsetHeight: 1768 } }
  });

  expect(screen.getByText(/Loading more repositories.../i)).toBeInTheDocument();
  await waitFor(() => expect(apiCall).toHaveBeenCalledTimes(2));

  expect(getByTestId("repository-list").childNodes.length).toBe(4);
});

test("Repository item should contains information", async () => {
  const apiCall = jest.spyOn(api, "searchRepository").mockImplementation(() => {
    return Promise.resolve({
      data: {
        items: [
          {
            id: "1",
            name: "repo 1",
            description: "This is desc 1",
            stargazers_count: "100",
            forks_count: "10",
            language: "python"
          },
          {
            id: "2",
            name: "repo 2",
            description: "This is desc 2",
            stargazers_count: "50",
            forks_count: "5",
            language: "js"
          }
        ]
      }
    });
  });
  const { asFragment } = render(<RepositoryList />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  await waitFor(() => expect(apiCall).toHaveBeenCalledTimes(1));
  const firstRender = asFragment();
  expect(firstRender).toMatchSnapshot();
});
