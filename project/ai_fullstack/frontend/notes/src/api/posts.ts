import axios from "./config";
import type { PostsResponse } from "@/types";

export const fetchPosts = async (page: number = 1, limit: number = 10) => {
  return axios.get<PostsResponse, PostsResponse>("/posts", {
    params: {
      page,
      limit,
    },
  });
};

// 发表文章
export const createPosts = async () => {
  return axios.post<{ id: number }, { id: number }>("/posts", {
    title: "121212121212",
    content: "22ssdffccccc",
  });
};
