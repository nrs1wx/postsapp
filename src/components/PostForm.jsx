import { useState } from "react";

export default function PostForm({ initialValues, submitLabel, onSubmit, onCancel, isSubmitting }) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [body, setBody] = useState(initialValues?.body || "");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }
    setError("");
    onSubmit({ title: title.trim(), body: body.trim(), userId: initialValues?.userId || 1 });
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" rows={4} />
      {error && <p className="error">{error}</p>}
      <div className="row">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
