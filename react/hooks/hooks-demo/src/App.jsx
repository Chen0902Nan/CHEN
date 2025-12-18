import {
  useEffect, // 副作用
  useState, // 响应式状态
} from "react";
import Demo from "./components/Demo";
async function queryData() {
  const data = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(666);
    }, 2000);
  });
  return data;
}

export default function App() {
  const [num, setNum] = useState(0);

  useEffect(() => {
    // 挂载后执行一次
    // 更新时执行 onUpdated [num]
    // 如果不传依赖项，渲染后和状态更新时都会执行
    console.log(num, "zzz");
  }, [num]);

  useEffect(() => {
    console.log("xxx");
    // 挂载后执行一次 vue生命周期onMounted
    queryData().then((data) => {
      setNum(data);
    });
  }, [1, 2, 3, new Date()]);

  useEffect(() => {
    console.log("ddd");
  });
  console.log("yyy");

  useEffect(() => {
    const timer = setInterval(() => {
      // 每次都在新建定时器
      //  如何取消定时器
      // 定时器副作用

      console.log(num);
    }, 1000);
    return () => {
      // 重新执行effect 之前,会先清除上一次的定时器
      // 不清除 会导致内存泄漏
      // userEffect return 函数
      console.log("remove");
      clearInterval(timer);
    };
  }, [num]);

  return (
    <>
      <div onClick={() => setNum((prevNum) => prevNum + 1)}>{num}</div>;
      {num % 2 === 0 && <Demo></Demo> ? "偶数" : "奇数"}
    </>
  );
}
