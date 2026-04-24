import { useEffect } from "react";
import {
  create, // api
} from "zustand";
// 简单
// create 创建一个store 存储状态
// set 修改状态
const useXxxStore = create((set) => ({
  aaa: "",
  bbb: "",
  updateAaa: (value) => set({ aaa: value }),
  updateBbb: (value) => set({ bbb: value }),
}));

export default function App() {
  const updateAaa = useXxxStore((state) => state.updateAaa);
  // console.log(updateAaa);
  const aaa = useXxxStore((state) => state.aaa);
  useEffect(() => {
    // 添加订阅
    useXxxStore.subscribe((state) => {
      console.log(state.aaa);
    });
  }, []);
  return (
    <div>
      <input
        type="text"
        value={aaa}
        onChange={(e) => updateAaa(e.target.value)}
      />
      <Bbb />
    </div>
  );
}

function Bbb() {
  return (
    <div>
      <Ccc />
    </div>
  );
}

function Ccc() {
  const aaa = useXxxStore((state) => state.aaa);
  return <p>hello, {aaa}</p>;
}
