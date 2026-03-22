import axios from "./config";
import type { Credentail } from "@/types";
import type { AuthLoginResponse } from "@/types";

export const doLogin = (data: Credentail) => {
  return axios.post<AuthLoginResponse, AuthLoginResponse>("/auth/login", data);
};

export const getAiAvatar = (name: string) => {
  return axios.get<string, string>(`/ai/avatar?name=${encodeURIComponent(name)}`);
};
