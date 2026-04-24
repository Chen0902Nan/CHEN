import "./App.css";
const ArticleCard = () => {
  // JSX + TaildwindCss(UI的一部分) = UI
  return (
    <div className="p-4 bg-white rounded-xl shadow hover:shadow-lg">
      <h2 className="text-lg font-bold">TailwindCss</h2>
      <p className="text-gray-500 mt-2">用utility class 快速构建UI</p>
    </div>
  );
};
function App() {
  return (
    // <div className="flex jutify-center items-center bg-blue-500">guang</div>
    // Fragment 文档碎片节点
    <>
      <h1>111</h1>
      <h1>222</h1>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        提交
      </button>
      <button className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">
        默认
      </button>
      <ArticleCard></ArticleCard>
    </>
  );
}

export default App;
