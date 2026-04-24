import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router, // html5 支持的 和后端路由是一样的 纯 现代 低端的浏览器不支持
  // HashRouter as Router, // 前端路由形式之一 as 别名 Hash路由带上# 不太美观
  Link, // a 不能用了 用Link组件代替，内部消化
} from "react-router-dom";
import AppRoutes from "./router"; // 引入 router 中的组件

function App() {
  const [count, setCount] = useState(0);
  console.log(count);

  return (
    //路由接管一切
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <AppRoutes></AppRoutes>
    </Router>
  );
}

export default App;
