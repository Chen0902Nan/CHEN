// 不涉及DOM
// Dom 不可以
// react-dom 提供了server 模块，可以渲染React组件为html字符串
// api json 数据格式
// text/html
import { renderToString } from "react-dom/server";
import App from "./App";

export  function render() {
  return renderToString(<App />);
}
