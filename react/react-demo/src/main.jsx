// 严格模式会执行两次 一次执行 一次测试  review
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// vite 帮我们编译stylus 为css
import "./index.styl"; // 全局样式 stylus
// 将App 组件挂载到 root 元素上 渲染render
import App from "./App.jsx"; //引入了组件

createRoot(document.getElementById("root")).render(
  // 函数组件的名字 类html 标签 自定义组件
  <App /> //jsx
  // <StrictMode></StrictMode>
);
