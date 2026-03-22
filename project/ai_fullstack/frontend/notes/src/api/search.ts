import axios from "./config";
import type { SearchResponse } from "@/types";

export const doSearch = async (keyword: string) => {
  const data = await axios.get<SearchResponse, SearchResponse>(
    `/ai/search?keyword=${keyword}`,
  );
  return data.data;
};
