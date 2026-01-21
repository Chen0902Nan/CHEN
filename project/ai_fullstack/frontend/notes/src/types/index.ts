export interface User {
  id: number;
  name: string;
  avatar?: string; // ?: 可选
}

export interface Post {
  id: number;
  title: string;
  brief: string; // 简介
  publishedAt: string;
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
