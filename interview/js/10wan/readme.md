# 大量数据的渲染

## 虚拟列表

是一种性能优化方案，用于处理大量的数据渲染问题

### 计算规则

你有10000条数据，每一条高度固定50px

屏幕的(可视区)高度 300px

总列表（很长）
│
│ ↑ scrollTop（滚动距离）
│
├───────────────
│ 可视区域（300px）
│ [第 ? 条]
│ [第 ? 条]
│ [第 ? 条]
│ [第 ? 条]
│ [第 ? 条]
│ [第 ? 条]
├───────────────

- 当前从第几条开始显示？
  startIndex=Math.floor(scrollTop/itemHeight)

- 可视区能放多少条？
  visibleCount=Math.ceil(containerHeight/itemHeight)
  屏幕能装几条

- 结束位置
  endIndex=startIndex + visibleCount

scrollTop=120px

itemHeight=50px
containerHeight=300px

startIndex=120/50=2
visibleCount=300/30=6
endIndex=2+6=8

## 优化

加缓冲区
如果只是渲染 刚好可视区域的元素，一滚动就出现白屏/闪烁

滚动是连续的，
但渲染是有延迟的(JS计算 + DOM更新)

总列表
│
│ ↑ scrollTop
│
├────────────────────
│ ↑ 上缓冲区（提前渲染）
│ [第0条]
│ [第1条]
│
│ 可视区域
│ [第2条]
│ [第3条]
│ [第4条]
│ [第5条]
│ [第6条]
│ [第7条]
│
│ ↓ 下缓冲区（提前渲染）
│ [第8条]
│ [第9条]
├────────────────────

实际渲染范围变成：

buffer + 可视区域 + buffer

怎么加缓冲区（核心规则）
✅ 1️⃣ 定义缓冲区数量（比如上下各 2 条）
buffer = 2

修改起点（重点🔥）
startIndex = Math.floor(scrollTop / itemHeight) - buffer

防止越界：

startIndex = Math.max(0, startIndex)

修改结束位置
endIndex = startIndex + visibleCount + buffer \* 2

同样防止越界：

endIndex = Math.min(total, endIndex)

scrollTop = 120
itemHeight = 50
containerHeight = 300
buffer = 2

计算：

startIndex = 2 - 2 = 0
visibleCount = 6
endIndex = 0 + 6 + 4 = 10

一句话总结（面试用）

缓冲区的本质是“提前渲染上下元素”，避免滚动过程中出现白屏，让体验更流畅。

## 滚动性能的优化

节流

```js
function throttle(fn, delay) {
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();

    // 时间间隔到了才执行
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}
// 在虚拟列表中使用

const handleScroll = throttle(function (e) {
  const scrollTop = e.target.scrollTop;

  // 计算 startIndex / endIndex
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = startIndex + visibleCount;

  // 更新渲染数据
  updateVisibleData(startIndex, endIndex);
}, 16); // 16ms ≈ 60fps

container.addEventListener("scroll", handleScroll);
```

```js
// 进阶写法;

let ticking = false;

function handleScroll(e) {
  const scrollTop = e.target.scrollTop;

  if (!ticking) {
    requestAnimationFrame(() => {
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = startIndex + visibleCount;

      updateVisibleData(startIndex, endIndex);
      ticking = false;
    });

    ticking = true;
  }
}
```


