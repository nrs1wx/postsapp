import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { fetchPosts, fetchPost, createPost, updatePost, deletePost } from "../services/api";

export const postKeys = {
  all: ["posts"],
  list: (page, search) => ["posts", "list", { page, search }],
  detail: (id) => ["posts", "detail", String(id)],
};

const STALE_TIME = 60 * 1000;
const GC_TIME = 5 * 60 * 1000;

export function usePosts(page, search) {
  return useQuery({
    queryKey: postKeys.list(page, search),
    queryFn: ({ signal }) => fetchPosts({ page, search, signal }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    placeholderData: keepPreviousData,
  });
}

export function usePost(id) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: ({ signal }) => fetchPost(id, signal),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
