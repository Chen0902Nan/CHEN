// 封装git diff 得到llm 给我们的规范的commit message
import { useState, useEffect } from "react";
import { chat } from "../api/index";

// use开头 可以封装响应式业务 副作用等
// 组件单一的UI 只负责渲染 不负责业务逻辑
export const useGitDiff = (diff) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!diff) return;
      setLoading(true);
      const { data } = await chat(diff);
      setContent(data.reply);
      setLoading(false);
    })();
  }, [diff]);

  return {
    loading, // 加载中
    content, // commit message
  };
};
