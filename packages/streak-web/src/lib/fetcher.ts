import { apiUrl } from "./api";

export default function fetcher(path: string) {
  console.log("url", apiUrl, path);
  const url = new URL(path, apiUrl);
  return fetch(url).then(async (res) => {
    if (res.ok) return res.json();
    throw await res.json();
  });
}
