export default function App2() {
  // Mobile First
  // 兼容 PC
  const ArticleCard = () => {
    return (
      <div className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow">
        <h2 className="text-lg font-bold">Tailwind CSS</h2>
        <p className="text-gray-500 mt-2">用 utility class 快速构建 UI</p>
      </div>
    );
  };
  return (
    // <div className=" flex flex-col md:flex-row gap-4">
    //   <main className="bg-blue-100 p-4 md:w-2/3">主内容</main>
    //   <aside className="bg-green-100 p-4 md:w-1/3">侧边栏</aside>
    // </div>
    <>
      <h1 className="text-4xl font-bold text-center my-8">Hello Tailwind!</h1>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        提交
      </button>
      <button className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 ml-4">
        默认
      </button>
      <ArticleCard></ArticleCard>
    </>
  );
}
