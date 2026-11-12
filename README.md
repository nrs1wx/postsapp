# Posts App: Server Data Caching and Firebase Authentication

React + Vite + React Router + TanStack Query + Firebase Authentication.

## Features

- Posts list with search and pagination (state stored in the URL: `/posts?search=...&page=2`)
- Post details page with edit and delete (available to logged-in users)
- Create post form (available to logged-in users)
- Firebase Authentication: Email/Password and Google
- `/login`, `/signup`, protected `/profile` (shows email and UID, has logout)
- NavBar changes depending on auth state
- Sessions persist after page refresh

## Setup

1. Create a Firebase project and add a Web app.
2. In Authentication, enable the Email/Password and Google providers.
3. Copy `.env.example` to `.env.local` and fill in the values from the Firebase web app config.
4. Install and run:

```
npm install
npm run dev
```

5. For the deployed site, add its domain to Authentication > Settings > Authorized domains in Firebase, and add the same `VITE_` variables in the hosting dashboard.

## Project structure

- `src/firebase.js` initializes Firebase from `VITE_` environment variables
- `src/services/authService.js` Firebase auth calls and error messages
- `src/context/AuthContext.jsx` `AuthProvider` and `useAuth`, tracks the user with `onAuthStateChanged`
- `src/services/api.js` all HTTP requests
- `src/hooks/usePosts.js` TanStack Query hooks and query keys
- `src/components/ProtectedRoute.jsx` redirects unauthenticated users to `/login`

UI components do not call `fetch` or `localStorage` directly.

## Caching strategy

Server data is cached with TanStack Query.

Query keys:

- `["posts", "list", { page, search }]` for each page and search combination
- `["posts", "detail", id]` for a single post

Expiration and revalidation:

- `staleTime` is 1 minute: cached data is shown instantly and not refetched while it is fresh
- `gcTime` is 5 minutes: unused cache entries are removed after that
- After the data becomes stale it is refetched in the background when a component mounts again or the window regains focus
- `keepPreviousData` keeps the old page visible while the next page loads

Outdated requests:

- Every query has its own key, so a response is always written to the entry of the request that produced it
- TanStack Query passes an `AbortSignal` to `fetch`, so requests that are no longer needed (for example, after quickly changing the page or search) are cancelled and cannot overwrite newer results

Loading, error, and empty states are handled in the posts list and post details pages. The error state has a "Try again" button.

## When cached data is invalidated

- After creating a post: all `["posts"]` queries are invalidated, so the lists are refetched
- After updating a post: all `["posts"]` queries are invalidated, so the list and the detail page are refetched
- After deleting a post: the detail entry of that post is removed and all `["posts"]` queries are invalidated

The API used is JSONPlaceholder. It accepts create, update, and delete requests but does not store them, so after the refetch the server returns the original data.
