
import { hydrateRoot } from "react-dom/client";
// 水合 服务器端的html 字符串变成可交互的页面
// 在前端再执行一次 比较一下 如果一样 只需要事件等
import App from "./App";
// 水合渲染
hydrateRoot(document.getElementById("root"), <App />);
