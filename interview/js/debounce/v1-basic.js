/**
 * v1: 最基础的 debounce 实现
 * 核心原理：每次调用清除上一个定时器，设置新定时器
 */

function debounce(fn, delay) {
  let timer = null

  return function (...args) {
    // 清除之前的定时器
    if (timer) clearTimeout(timer)

    // 设置新的定时器
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// ============ 测试 ============
function fetchData() {
  console.log('发起请求:', Date.now())
}

const debouncedFetch = debounce(fetchData, 300)

console.log('=== v1 基础版本测试 ===')
debouncedFetch() // 被忽略
debouncedFetch() // 被忽略
debouncedFetch() // 被忽略
setTimeout(() => debouncedFetch(), 400) // 触发执行

setTimeout(() => {
  console.log('\n--- 预期输出: 只打印一次 "发起请求" ---')
}, 1000)
