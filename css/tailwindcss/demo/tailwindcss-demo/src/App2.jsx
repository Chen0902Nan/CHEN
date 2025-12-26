export default function App2() {
  // Mobile First
  // 兼容 PC
  return (
    <div className=" flex flex-col md:flex-row gap-4">
      <main className="bg-blue-100 p-4 md:w-2/3">主内容</main>
      <aside className="bg-green-100 p-4 md:w-1/3">侧边栏</aside>
    </div>
  );
}
