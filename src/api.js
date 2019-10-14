import axios from "axios";

export function searchRepository({ order, page, perPage, createdAt, sort }) {
  return axios.get(
    `https://api.github.com/search/repositories?q=created:>${createdAt}&sort=${sort}&order=${order}&page=${page}&per_page=${perPage}`,
    {
      auth: {
        username: "napatwongchr",
        password: "xJ3a8k8f2810023"
      }
    }
  );
}
