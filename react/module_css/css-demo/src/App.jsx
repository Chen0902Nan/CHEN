import Button from "./components/Button";
import AnotherButton from "./components/AnotherButton";
export default function App() {
  return (
    <>
      {/* 组件是 html css js 集合，解决某个需求
      组件化思想 是一种将复杂的问题分解为多个简单的
      */}
      <Button />
      {/* 多人协作的时候 bug 冲突 
        我们怎么才能不影响别人
        也不受别人的影响
      */}
      <AnotherButton />
    </>
  );
}
