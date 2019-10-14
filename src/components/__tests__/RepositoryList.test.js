import React from "react";
import { render, cleanup, wait, fireEvent } from "@testing-library/react";
import RepositoryList from "../RepositoryList";
import * as api from "../../api";

afterEach(cleanup);

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
  const { getByTestId, container } = render(<RepositoryList />);
  expect(apiCall).toHaveBeenCalledTimes(1);
  await wait(expect(container).toHaveTextContent(/loading/i));
  expect(getByTestId("repository-list")).toBeInTheDocument();
  expect(getByTestId("repository-list").childNodes.length).toBe(2);
  apiCall.mockClear();
});

test("Repository list should show 'No repository found.' when no repository result", async () => {
  const apiCall = jest
    .spyOn(api, "searchRepository")
    .mockImplementationOnce(() => {
      return Promise.resolve({
        data: null
      });
    });
  const { getByTestId, container } = render(<RepositoryList />);
  expect(apiCall).toHaveBeenCalledTimes(1);
  await wait(expect(container).toHaveTextContent(/loading/i));
  expect(getByTestId("no-repository")).toHaveTextContent("No repositories");
  apiCall.mockClear();
});

test("Repository list should show 'Error fetching repositories.' when error occured", async () => {
  const apiCall = jest
    .spyOn(api, "searchRepository")
    .mockImplementationOnce(() => {
      return Promise.reject("error");
    });
  const { container } = render(<RepositoryList />);
  expect(apiCall).toHaveBeenCalledTimes(1);

  await wait(expect(container).toHaveTextContent(/loading/i));
  expect(container).toHaveTextContent(/error fetching repositories./i);
  apiCall.mockClear();
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
  const { getByTestId, container } = render(<RepositoryList />);
  expect(apiCall).toHaveBeenCalledTimes(1);
  await wait(expect(container).toHaveTextContent(/loading/i));
  fireEvent.scroll(window, {
    target: { scrollingElement: { scrollTop: 1000, offsetHeight: 1768 } }
  });
  await wait(
    expect(container).toHaveTextContent(/Loading more repositories.../i)
  );
  expect(apiCall).toHaveBeenCalledTimes(2);
  expect(getByTestId("repository-list").childNodes.length).toBe(4);
  apiCall.mockClear();
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
  const { container } = render(<RepositoryList />);
  expect(apiCall).toHaveBeenCalledTimes(1);
  await wait(expect(container).toHaveTextContent(/loading/i));
  expect(container).toMatchSnapshot();
  apiCall.mockClear();
});
