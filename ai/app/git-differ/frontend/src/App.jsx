import { useEffect } from "react";
import { chat } from "./api/index";
import { useGitDiff } from "./hooks/useGit";
export default function App() {
  // 3. hooks函数写法
  const { loading, content } = useGitDiff("hello");

  // useEffect(() => {
  //1.新手
  //   // fetch("http://localhost:3000/chat", {
  //   //   method: "POST",
  //   //   headers: {
  //   //     "Content-Type": "application/json",
  //   //   },
  //   //   body: JSON.stringify({
  //   //     message: "你好",
  //   //   }),
  //   // })

  // 2. 一般写法
  //   const run = async () => {
  //     try {
  //       const result = await chat("你好啊");
  //       console.log(result); // 直接就是 { reply: "..." }
  //     } catch (err) {
  //       console.error("出错了:", err);
  //     }
  //   };
  //   run();
  // }, []);

  return <div className="flex">{loading ? "loading....." : content}</div>;
}
