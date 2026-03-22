import axios from "./config";
import type { GitResponse } from "@/types";

export const fetchCommit = async (diff: string) => {
  const data = await axios.post<GitResponse, GitResponse>("/ai/git", { diff });
  return data.result;
};
