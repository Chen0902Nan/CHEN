import axios from "./config";
import type { RagResponse } from "@/types";

export const ask = async (question: string) => {
  const data = await axios.post<RagResponse, RagResponse>("/ai/rag", {
    question,
  });
  return data.answer;
};
