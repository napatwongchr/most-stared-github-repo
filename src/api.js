import axios from "axios";

export function searchRepository({ order, page, perPage, query, sort }) {
  return axios.get(
    `https://api.github.com/search/repositories?q=${query}&sort=${sort}&order=${order}&page=${page}&per_page=${perPage}`
  );
}
