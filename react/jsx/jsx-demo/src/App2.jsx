//jsx是react 的文件后缀
// UI  用户界面工程师  前后端分离
// vue 三部分 功能分离
// react 一上来就是组件
// js 没有class,react 函数就是组件
//根组件

function JuejinHeader() {
  //React组件最外层只能有一个根组件
  return (
    <div>
      <header>
        <h1>Juejin的首页</h1>
      </header>
    </div>
  );
}

function Articles() {
  return <>Articles</>;
}

function Checkin() {
  return <>Checkin</>;
}

function TopArticles() {
  return <>TopArticles</>;
}
function App() {
  // xml in js -> jsx
  // 返回JSX的函数就是组件
  // 组件是react开发的基本单位
  // html 标签 css rules -> 建筑里的砖头和沙子
  // react 一下让我们成为包工头 先分工 组件化 组件组合起来组成网页
  // facebook
  //子组件们
  return (
    <div>
      {/* <h1>
        Hello<b>React!</b>
      </h1> */}
      {/* 头部组件 */}
      <JuejinHeader />
      <main>
        {/* 组件也和html一样申明 */}
        {/* 组件化能让我们像搭积木一样组合成页面 */}
        <Articles />
        <aside>
          <Checkin />
          <TopArticles />
        </aside>
      </main>
    </div>
  );
}

export default App;
