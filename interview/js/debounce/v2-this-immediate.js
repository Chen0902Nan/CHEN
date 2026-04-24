/**
 * v2: 处理 this 绑定 + immediate 立即执行
 * 新增功能：
 *  - 正确绑定 this 上下文
 *  - immediate: true 时立即执行，后续调用等待 delay 后才能再次执行
 */

function debounce(fn, delay, immediate = false) {
  let timer = null

  return function (...args) {
    // 判断是否可以立即执行
    const callNow = immediate && timer === null

    // 清除之前的定时器
    if (timer) clearTimeout(timer)

    // 设置新的定时器（用于重置）
    timer = setTimeout(() => {
      timer = null
      // 延迟执行模式下，执行回调
      if (!immediate) fn.apply(this, args)
    }, delay)

    // 立即执行模式
    if (callNow) {
      fn.apply(this, args)
    }
  }
}

// ============ 测试 ============
const user = {
  name: '张三',
  delayedQuery: null
}

user.delayedQuery = debounce(function (keyword) {
  console.log(`${this.name} 搜索: ${keyword}`)
}, 300)

console.log('=== v2 this绑定 + immediate 测试 ===')

// 测试 this 绑定
user.delayedQuery('JavaScript')
user.delayedQuery('Python')
user.delayedQuery('Go')

// 测试 immediate 模式
console.log('\n--- immediate: true 模式 ---')
const immediateSearch = debounce(function (keyword) {
  console.log('立即执行搜索:', keyword)
}, 300, true)

immediateSearch('keyword1')
immediateSearch('keyword2')
immediateSearch('keyword3') // 只有这一次会等待300ms后执行

setTimeout(() => {
  console.log('\n--- 预期: 前3次调用只有第3次在300ms后执行，immediate模式第1次立即执行 ---')
}, 800)
