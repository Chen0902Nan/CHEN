import {
  useState,
  // 性能优化
  useMemo,
} from "react";
// 昂贵的计算
function slowSum(n) {
  console.log("计算中...");
  let sum = 0;
  for (let i = 0; i < n * 1000000; i++) {
    sum += i;
  }
  return sum;
}
export default function App() {
  // count 和 keyword 没什么联系
  // 状态的改变 会带来组件函数的重新运行
  // useEffect、useMemo、useCallback 标记一下不用运行
  const [count, setCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const list = ["apple", "banana", "orange", "pear"];
  // 缓存计算结果
  // const filterList = list.filter((item) => {
  //   console.log("filter 执行");
  //   return item.includes(keyword);
  // });
  const filterList = useMemo(() => {
    // computed
    return list.filter((item) => item.includes(keyword));
  }, [keyword]);
  const [num, setNum] = useState(0);
  // 缓存昂贵的计算
  const result = useMemo(() => {
    return slowSum(num);
  }, [num]);

  return (
    <>
      <p>结果：{result}</p>
      <button onClick={() => setNum(num + 1)}>num++</button>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      {count}
      <button onClick={() => setCount(count + 1)}>count++</button>
      {filterList.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </>
  );
}
