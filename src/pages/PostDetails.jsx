import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePost, useUpdatePost, useDeletePost } from "../hooks/usePosts";
import { useAuth } from "../context/AuthContext";
import PostForm from "../components/PostForm";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  const { data: post, isLoading, isError, error, refetch } = usePost(id);
  const updateMutation = useUpdatePost();
  const deleteMutation = useDeletePost();

  function handleUpdate(values) {
    updateMutation.mutate(
      { id, data: values },
      { onSuccess: () => setEditing(false) }
    );
  }

  function handleDelete() {
    deleteMutation.mutate(id, {
      onSuccess: () => navigate("/posts"),
    });
  }

  if (isLoading) {
    return <p>Loading post...</p>;
  }

  if (isError) {
    return (
      <div className="card">
        <p className="error">{error.message}</p>
        <button onClick={() => refetch()}>Try again</button>
        <Link to="/posts">Back to posts</Link>
      </div>
    );
  }

  if (!post || !post.id) {
    return <p>Post not found.</p>;
  }

  return (
    <div>
      <Link to="/posts">Back to posts</Link>

      {editing ? (
        <PostForm
          initialValues={post}
          submitLabel="Save"
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          isSubmitting={updateMutation.isPending}
        />
      ) : (
        <div className="card">
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          {user && (
            <div className="row">
              <button onClick={() => setEditing(true)}>Edit</button>
              <button
                className="danger"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      )}

      {updateMutation.isError && <p className="error">{updateMutation.error.message}</p>}
      {deleteMutation.isError && <p className="error">{deleteMutation.error.message}</p>}
    </div>
  );
}
