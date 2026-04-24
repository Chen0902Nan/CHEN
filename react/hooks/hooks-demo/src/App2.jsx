import { useState } from "react";
export default function App() {
  // 数据 -> setNum 变成另一个数据值  值不是固定的了 -> 状态 state
  // hook useState 为程序带来了关键的响应状态
  // 状态是变化的数据 组件的核心是状态
  // 1 数据 也是状态的初始值

  const [num, setNum] = useState(() => {
    // 初始值比较复杂的时候 用函数来计算
    // 同步函数,不支持异步 异步的可能不确定 状态一定要是确定的
    // 纯函数是指相同输入始终返回相同输出，且无副作用的函数
    const num1 = 1 + 2;
    const num2 = 2 + 3;
    return num1 + num2;
  });
  //<div onClick={() => setNum(() => {})}
  // 修改函数中可以直接传新的值 也可以传入一个函数
  // 这个函数的参数是上一次的state
  return (
    <div
      onClick={() =>
        setNum((prevNum) => {
          console.log(prevNum);
          return prevNum + 1;
        })
      }
    >
      {num}
    </div>
  );
}
