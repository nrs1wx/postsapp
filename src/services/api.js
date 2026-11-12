const BASE_URL = "https://jsonplaceholder.typicode.com";

export const PAGE_SIZE = 10;

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response;
}

export async function fetchPosts({ page, search, signal }) {
  const params = new URLSearchParams({ _page: page, _limit: PAGE_SIZE });
  if (search) {
    params.set("q", search);
  }
  const response = await request(`/posts?${params.toString()}`, { signal });
  const items = await response.json();
  const total = Number(response.headers.get("x-total-count")) || items.length;
  return { items, total };
}

export async function fetchPost(id, signal) {
  const response = await request(`/posts/${id}`, { signal });
  return response.json();
}

export async function createPost(data) {
  const response = await request("/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updatePost({ id, data }) {
  const response = await request(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deletePost(id) {
  await request(`/posts/${id}`, { method: "DELETE" });
  return id;
}
