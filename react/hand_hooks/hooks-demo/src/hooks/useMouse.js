import { useState, useEffect } from "react";
// 封装响应式mouse业务
// UI组件更简单 HTML + CSS 好维护
// 复用 和组件一样，是前端团队的核心资产
export const useMouse = function () {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const update = (event) => {
      console.log("在移动");

      setX(event.pageX);
      setY(event.pageY);
    };
    window.addEventListener("mousemove", update);
    console.log("||||||");
    return () => {
      console.log("|||||| 清除");
      window.removeEventListener("mousemove", update);
    };
  }, []);
  // 把要向外部暴露的状态和方法返回
  return {
    x,
    y,
  };
};
