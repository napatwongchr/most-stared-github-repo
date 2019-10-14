import React, { useState, useEffect } from "react";
import { css, keyframes } from "emotion";
import { useAsync } from "react-async";
import * as api from "../api";

export default function RepositoryList() {
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

  function handleScroll(event) {
    if (
      window.innerHeight + event.target.scrollingElement.scrollTop !==
      event.target.scrollingElement.offsetHeight
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
    <div className={styles.repoListContainer} data-testid="repository-list">
      {repositories ? (
        repositories.items.map(repository => {
          return (
            <div
              key={repository.id}
              className={styles.repoItemContainer}
              data-testid="repository-item"
              onClick={() => window.open(repository.html_url)}
            >
              <div className={styles.repoHeadingContainer}>
                <div className={styles.repoHeadingContent}>
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
                    <span>{repository.stargazers_count}</span>
                  </div>
                  <div className={styles.forksCountContainer}>
                    <span className={styles.forksCountText}>Forks: </span>
                    <span>{repository.forks_count}</span>
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
        <div
          className={styles.noRepositoryContainer}
          data-testid="no-repository"
        >
          No repositories.
        </div>
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
  query: `created:>${
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0]
  }`,
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
    display: flex;
    justify-content: center;
    font-size: 36px;
  `,
  errorContainer: css`
    display: flex;
    justify-content: center;
    font-size: 36px;
  `,
  noRepositoryContainer: css`
    display: flex;
    justify-content: center;
    font-size: 36px;
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
    @media (max-width: 576px) {
      display: flex;
      flex-direction: column;
    }
  `,
  repoHeadingContent: css`
    @media (max-width: 576px) {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `,
  repoName: css`
    font-weight: bold;
    font-size: 22px;
    @media (max-width: 576px) {
      text-align: center;
    }
  `,
  repoLanguageTag: css`
    background-color: #745eb5;
    padding: 3px;
    margin-left: 5px;
    border-radius: 6px;
    color: #ffffff;
    @media (max-width: 576px) {
      margin-top: 20px;
    }
  `,
  repoStatsContainer: css`
    label: stats;
    display: flex;
    @media (max-width: 576px) {
      justify-content: center;
      margin-top: 30px;
    }
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
    @media (max-width: 576px) {
      text-align: center;
    }
  `,
  loadMoreRepositoryContainer: css`
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
  `
};
