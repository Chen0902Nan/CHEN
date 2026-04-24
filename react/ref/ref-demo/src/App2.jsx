import {
  useRef, // 默默奉献存储能力
  useState, // 响应
} from "react";

export default function App() {
  let intervalId = null;
  const [count, setCount] = useState(0);
  function start() {
    intervalId = setInterval(() => {
      console.log("tick～～～～");
      console.log(intervalId);
    }, 1000);
  }
  function stop() {
    clearInterval(intervalId);
  }
  return (
    <>
      <button onClick={start}>开始</button>
      <button onClick={stop}>停止</button>
      {count}
      <button type="button" onClick={() => setCount(count + 1)}>
        count ++{" "}
      </button>
    </>
  );
}
