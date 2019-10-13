import React, { useState, useEffect, useCallback } from "react";
import { css } from "emotion";
import { useAsync } from "react-async";
import axios from "axios";

function RepositoryList() {
  const [pageCount, setPageCount] = useState(1);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [repositories, setRepositories] = useState(null);

  const { isLoading } = useAsync({
    promiseFn: initRepository,
    setRepositories,
    setPageCount,
    page: pageCount
  });

  const { run: runLoadMoreRepository } = useAsync({
    deferFn: loadMoreRepository,
    setPageCount,
    setIsLoadMore
  });

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoadMore) return;
    runLoadMoreRepository(pageCount);
  }, [isLoadMore, pageCount, runLoadMoreRepository]);

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return;
    }
    setIsLoadMore(true);
  }

  if (isLoading) {
    return (
      <div
        className={css`
          font-size: 46px;
        `}
      >
        Loading ...
      </div>
    );
  }

  return (
    <div data-testid="repository-list">
      {repositories ? (
        repositories.items.map(repository => {
          return (
            <div
              key={repository.id}
              data-testid="repository-item"
              className={css`
                background-color: lightblue;
                margin-bottom: 25px;
                padding: 30px;
                &:hover {
                  cursor: pointer;
                }
              `}
              onClick={() => window.open(repository.html_url)}
            >
              <div
                className={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <span>
                  {repository.name} ({repository.language || "-"})
                </span>
                <div
                  className={css`
                    label: stats;
                  `}
                >
                  <span
                    className={css`
                      label: starCount;
                      margin-right: 30px;
                    `}
                  >
                    Stars: {repository.stargazers_count}
                  </span>
                  <span
                    className={css`
                      label: forkCount;
                    `}
                  >
                    Forks: {repository.forks_count}
                  </span>
                </div>
              </div>
              <div
                className={css`
                  label: description;
                  margin-top: 20px;
                `}
              >
                {repository.description}
              </div>
            </div>
          );
        })
      ) : (
        <div>No repositories</div>
      )}
    </div>
  );
}

async function initRepository({ setRepositories, setPageCount, page }) {
  const response = await searchRepository();
  setRepositories(response.data);
  setPageCount(page + 1);
}

async function loadMoreRepository(
  [pageCount],
  { setPageCount, setIsLoadMore }
) {
  setTimeout(() => {
    setIsLoadMore(false);
    setPageCount(pageCount + 1);
  }, 2000);
}

function searchRepository(
  order = "desc",
  page = 1,
  perPage = 10,
  createdAt,
  sort = "stars"
) {
  return axios.get(
    `https://api.github.com/search/repositories?q=created:>2019-09-12&sort=${sort}&order=${order}&page=${page}&per_page=${perPage}`,
    {
      auth: {
        username: "napatwongchr",
        password: "xJ3a8k8f2810023"
      }
    }
  );
}

export default RepositoryList;
