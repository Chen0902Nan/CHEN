import {
  useEffect, // 副作用
  useState, // 响应式状态
} from "react";

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
  }, [num]);

  console.log("yyy");

  return (
    <>
      <div onClick={() => setNum((prevNum) => prevNum + 1)}>{num}</div>;
      {/* {num % 2 === 0 && <Demo></Demo> ? "偶数" : "奇数"} */}
    </>
  );
}
