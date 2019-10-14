import React, { useState, useEffect } from "react";
import { css } from "emotion";
import { useAsync } from "react-async";
import * as api from "../api";

function RepositoryList() {
  const [pageCount, setPageCount] = useState(1);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [repositories, setRepositories] = useState(null);

  const { isLoading: isInitialLoading } = useAsync({
    promiseFn: initRepository,
    setRepositories,
    setPageCount,
    page: pageCount
  });

  const { isLoading: isLoadMoreLoading, run: runLoadMoreRepository } = useAsync(
    {
      deferFn: loadMoreRepository,
      setPageCount,
      setRepositories,
      setIsLoadMore
    }
  );

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

  if (isInitialLoading) {
    return <div className={styles.spinnerContainer}>Loading ...</div>;
  }

  return (
    <div data-testid="repository-list" className={styles.repoListContainer}>
      {repositories ? (
        repositories.items.map(repository => {
          return (
            <div
              key={repository.id}
              data-testid="repository-item"
              className={styles.repoItemContainer}
              onClick={() => window.open(repository.html_url)}
            >
              <div className={styles.repoHeadingContainer}>
                <span>
                  {repository.name} ({repository.language || "-"})
                </span>
                <div className={styles.repoStatsContainer}>
                  <span className={styles.starsCount}>
                    Stars: {repository.stargazers_count}
                  </span>
                  <span className={styles.forksCount}>
                    Forks: {repository.forks_count}
                  </span>
                </div>
              </div>
              <div className={styles.repoDescContainer}>
                {repository.description}
              </div>
            </div>
          );
        })
      ) : (
        <div>No repositories</div>
      )}
      {isLoadMoreLoading && <span>Loading more repositories...</span>}
    </div>
  );
}

async function initRepository({ setRepositories, setPageCount, page }) {
  const response = await api.searchRepository({
    order: "desc",
    page: 1,
    perPage: 10,
    createdAt: "2019-09-12",
    sort: "stars"
  });
  setRepositories(response.data);
  setPageCount(page + 1);
}

async function loadMoreRepository(
  [pageCount],
  { setPageCount, setIsLoadMore, setRepositories }
) {
  const response = await api.searchRepository({
    order: "desc",
    page: pageCount,
    perPage: 10,
    createdAt: "2019-09-12",
    sort: "stars"
  });
  setIsLoadMore(false);
  setPageCount(pageCount + 1);
  setRepositories(prevRepositories => {
    return {
      ...prevRepositories,
      items: [...prevRepositories.items, ...response.data.items]
    };
  });
}

const styles = {
  spinnerContainer: css`
    font-size: 42px;
  `,
  repoListContainer: css`
    label: repoList;
  `,
  repoItemContainer: css`
    label: repoItem;
    background-color: lightblue;
    margin-bottom: 25px;
    padding: 30px;
    &:hover {
      cursor: pointer;
    }
  `,
  repoHeadingContainer: css`
    display: flex;
    justify-content: space-between;
  `,
  repoStatsContainer: css`
    label: stats;
  `,
  starsCount: css`
    label: starCount;
    margin-right: 30px;
  `,
  forksCount: css`
    label: forkCount;
  `,
  repoDescContainer: css`
    label: description;
    margin-top: 20px;
  `
};

export default RepositoryList;
