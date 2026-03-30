/**
 * v4: 高级配置版本
 * 新增功能：
 *  - maxWait: 最大等待时间，确保至少执行一次
 *  - onLeading: 前置回调
 *  - onTrailing: 后置回调
 *  - errorHandler: 错误处理
 */

function debounce(fn, delay, options = {}) {
  const {
    immediate = false,
    maxWait = null,
    onLeading = null,
    onTrailing = null,
    onError = null
  } = options

  let timer = null
  let maxTimer = null
  let lastArgs = null
  let lastThis = null
  let lastCallTime = null

  const debounced = function (...args) {
    lastArgs = args
    lastThis = this

    const now = Date.now()
    const callNow = immediate && timer === null

    // 清除所有定时器
    if (timer) clearTimeout(timer)
    if (maxTimer) clearTimeout(maxTimer)

    // maxWait 逻辑：记录首次调用时间
    if (maxWait !== null && !immediate) {
      if (!lastCallTime) lastCallTime = now

      const remaining = maxWait - (now - lastCallTime)

      if (remaining <= 0) {
        // 超过最大等待时间，立即执行
        lastCallTime = now
        try {
          fn.apply(this, args)
        } catch (e) {
          if (onError) onError(e)
        }
        if (onTrailing) onTrailing()
        return
      }
    }

    // 设置延迟执行
    timer = setTimeout(() => {
      lastCallTime = null
      timer = null
      try {
        fn.apply(this, args)
      } catch (e) {
        if (onError) onError(e)
      }
      if (onTrailing) onTrailing()
    }, delay)

    // 设置最大等待定时器
    if (maxWait !== null && !immediate && !callNow) {
      maxTimer = setTimeout(() => {
        if (timer) {
          clearTimeout(timer)
          timer = null
          lastCallTime = null
          try {
            fn.apply(this, args)
          } catch (e) {
            if (onError) onError(e)
          }
          if (onTrailing) onTrailing()
        }
      }, maxWait)
    }

    // 前置回调
    if (callNow && onLeading) {
      onLeading()
    }

    // 非立即模式下，返回执行结果
    if (!immediate) {
      try {
        return fn.apply(this, args)
      } catch (e) {
        if (onError) onError(e)
      }
    }
  }

  debounced.cancel = function () {
    if (timer) clearTimeout(timer)
    if (maxTimer) clearTimeout(maxTimer)
    timer = null
    maxTimer = null
    lastArgs = null
    lastThis = null
    lastCallTime = null
  }

  debounced.flush = function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
      if (lastArgs) {
        try {
          fn.apply(lastThis, lastArgs)
        } catch (e) {
          if (onError) onError(e)
        }
        if (onTrailing) onTrailing()
      }
    }
  }

  return debounced
}

// ============ 测试 ============
console.log('=== v4 高级配置测试 ===')

// 测试 maxWait
console.log('\n--- maxWait 测试 (500ms内必须执行一次) ---')
let maxWaitCount = 0
const maxWaitFn = debounce(
  function () {
    maxWaitCount++
    console.log(`maxWait 执行, 累计: ${maxWaitCount}`)
  },
  300,
  { maxWait: 500 }
)

maxWaitFn() // t=0
setTimeout(() => maxWaitFn(), 100)  // t=100
setTimeout(() => maxWaitFn(), 200)  // t=200 - 不会执行，因为还没到maxWait
setTimeout(() => maxWaitFn(), 400) // t=400 - maxWait触发，强制执行
setTimeout(() => maxWaitFn(), 600) // t=600 - 正常执行
setTimeout(() => maxWaitFn(), 700) // t=700
setTimeout(() => maxWaitFn(), 800) // t=800 - maxWait触发

// 测试 onLeading / onTrailing
console.log('\n--- onLeading / onTrailing 测试 ---')
const leadingTrailingFn = debounce(
  function (msg) {
    console.log(`执行: ${msg}`)
  },
  200,
  {
    immediate: true,
    onLeading: () => console.log('--> leading 回调'),
    onTrailing: () => console.log('trailing 回调 -->')
  }
)

leadingTrailingFn('测试1')

setTimeout(() => {
  console.log('\n--- 预期: leading在前，trailing在后 ---')
}, 600)
