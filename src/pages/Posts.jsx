import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePosts, useCreatePost } from "../hooks/usePosts";
import { PAGE_SIZE } from "../services/api";
import { useAuth } from "../context/AuthContext";
import PostForm from "../components/PostForm";

export default function Posts() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const search = params.get("search") || "";
  const [searchText, setSearchText] = useState(search);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, error, isFetching, refetch } = usePosts(page, search);
  const createMutation = useCreatePost();

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  function handleSearch(event) {
    event.preventDefault();
    const next = {};
    if (searchText.trim()) {
      next.search = searchText.trim();
    }
    setParams(next);
  }

  function goToPage(newPage) {
    const next = {};
    if (search) {
      next.search = search;
    }
    next.page = String(newPage);
    setParams(next);
  }

  function handleCreate(values) {
    createMutation.mutate(values, {
      onSuccess: () => setShowForm(false),
    });
  }

  return (
    <div>
      <div className="row space">
        <h1>Posts</h1>
        {user && !showForm && <button onClick={() => setShowForm(true)}>New post</button>}
      </div>

      {showForm && (
        <PostForm
          submitLabel="Create"
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isSubmitting={createMutation.isPending}
        />
      )}
      {createMutation.isError && <p className="error">{createMutation.error.message}</p>}
      {createMutation.isSuccess && (
        <p className="success">Post created. The list was refreshed from the server.</p>
      )}

      <form className="row" onSubmit={handleSearch}>
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search posts"
        />
        <button type="submit">Search</button>
      </form>

      {isLoading && <p>Loading posts...</p>}

      {isError && (
        <div className="card">
          <p className="error">{error.message}</p>
          <button onClick={() => refetch()}>Try again</button>
        </div>
      )}

      {data && data.items.length === 0 && <p>No posts found.</p>}

      {data && data.items.length > 0 && (
        <ul className="list">
          {data.items.map((post) => (
            <li key={post.id} className="card">
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}

      {data && (
        <div className="row space">
          <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages} {isFetching && "(updating...)"}
          </span>
          <button disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
