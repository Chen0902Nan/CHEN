export interface User {
  id: number | string;
  name: string;
  avatar?: string; // ?: 可选
}

export interface Post {
  id: number;
  title: string;
  brief: string; // 简介
  publishedAt?: string;
  totalLikes?: number;
  totalComments?: number;
  user: User;
  tags: string[];
  thumbnail?: string; // 缩略图
  pics?: string[];
}
// dry 原则 don't repeat yourself
export interface Credentail {
  name: string;
  password: string;
}

export interface TokensPayload {
  access_token: string;
  refresh_token: string;
}

export interface AuthLoginResponse extends TokensPayload {
  user: User;
}

export type RefreshTokenResponse = TokensPayload;

export interface PostsResponse {
  items: Post[];
  total: number;
}

export interface SearchResponse {
  code: number;
  data: string[];
}

export interface RagResponse {
  code: number;
  answer: string;
}

export interface GitResponse {
  result: string;
}
