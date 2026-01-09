// http 请求库
import axios from "axios";
// 模块化
// api 目录下管理所有的请求
const service = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const chat = (message) => service.post("/chat", {message});

