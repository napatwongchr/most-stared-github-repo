import React, { useState, useEffect } from "react";
import { css } from "emotion";
import { keyframes } from "@emotion/core";
import { useAsync } from "react-async";
import * as api from "../api";

function RepositoryList() {
  const [pageCount, setPageCount] = useState(1);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [repositories, setRepositories] = useState(null);

  const { isLoading: isInitializeLoading, error: isInitializeError } = useAsync(
    {
      promiseFn: initRepository,
      setRepositories,
      setPageCount,
      page: pageCount
    }
  );

  const {
    isLoading: isLoadMoreLoading,
    error: isLoadMoreError,
    run: runLoadMoreRepository
  } = useAsync({
    deferFn: loadMoreRepository,
    setPageCount,
    setRepositories,
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

  if (isInitializeLoading) {
    return <div className={styles.spinnerContainer}>Loading ...</div>;
  }

  if (isInitializeError || isLoadMoreError) {
    return (
      <div className={styles.errorContainer}>Error fetching repositories.</div>
    );
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
                <div>
                  <span className={styles.repoName}>{repository.name}</span>
                  {repository.language && (
                    <span className={styles.repoLanguageTag}>
                      {repository.language}
                    </span>
                  )}
                </div>
                <div className={styles.repoStatsContainer}>
                  <div className={styles.starsCountContianer}>
                    <span className={styles.starsCountText}>Stars:</span>{" "}
                    {repository.stargazers_count}
                  </div>
                  <div className={styles.forksCountContainer}>
                    <span className={styles.forksCountText}>Forks: </span>
                    {repository.forks_count}
                  </div>
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
      {isLoadMoreLoading && (
        <div className={styles.loadMoreRepositoryContainer}>
          <span>Loading more repositories...</span>
        </div>
      )}
    </div>
  );
}

const SEARCH_PARAMS = {
  order: "desc",
  page: 1,
  perPage: 10,
  query: "created:>2019-09-12",
  sort: "stars"
};

async function initRepository({ setRepositories, setPageCount, page }) {
  const response = await api.searchRepository(SEARCH_PARAMS);
  setRepositories(response.data);
  setPageCount(page + 1);
}

async function loadMoreRepository(
  [pageCount],
  { setPageCount, setIsLoadMore, setRepositories }
) {
  const response = await api.searchRepository({
    ...SEARCH_PARAMS,
    page: pageCount
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

const animation = {
  aura: keyframes`
    0% {
      box-shadow: -2px 0px 20px -16px rgba(116, 94, 181, 1);
    }
    40% {
      box-shadow: -2px 0px 45px -16px rgba(116, 94, 181, 1);
    }
    70% {
      box-shadow: -2px 0px 56px -16px rgba(116, 94, 181, 1);
    }
    85% {
      box-shadow: -2px 0px 45px -16px rgba(116, 94, 181, 1);
    }
    100% {
      box-shadow: -2px 0px 20px -16px rgba(116, 94, 181, 1);
    }
  `
};

const styles = {
  spinnerContainer: css`
    font-size: 42px;
  `,
  errorContainer: css`
    font-size: 42px;
  `,
  repoListContainer: css`
    label: repoList;
  `,
  repoItemContainer: css`
    label: repoItem;
    background-color: #ffffff;
    margin-bottom: 40px;
    padding: 40px;
    border-top: 3px solid #745eb5;
    border-radius: 3px;
    &:hover {
      animation: ${animation.aura} 1.3s ease infinite;
      cursor: pointer;
    }
  `,
  repoHeadingContainer: css`
    display: flex;
    justify-content: space-between;
  `,
  repoName: css`
    font-weight: bold;
    font-size: 22px;
  `,
  repoLanguageTag: css`
    background-color: #745eb5;
    padding: 3px;
    margin-left: 5px;
    border-radius: 6px;
    color: #ffffff;
  `,
  repoStatsContainer: css`
    label: stats;
    display: flex;
  `,
  starsCountContianer: css`
    label: starCount;
    margin-right: 30px;
  `,
  starsCountText: css`
    color: #f5a70a;
  `,
  forksCountContainer: css`
    label: forkCount;
  `,
  forksCountText: css`
    color: #00818a;
  `,
  repoDescContainer: css`
    label: description;
    margin-top: 30px;
  `,
  loadMoreRepositoryContainer: css`
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
  `
};

export default RepositoryList;
