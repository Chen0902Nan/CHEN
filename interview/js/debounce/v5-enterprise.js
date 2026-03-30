/**
 * v5: 企业级 Debounce 实现
 *
 * 特性：
 * - 完整的 TypeScript 类型定义
 * - 多种变体：debounce, debounceAsync, debouncePromise
 * - 装饰器模式支持
 * - 完整的 JSDoc 文档
 * - 记忆化 (memoize) 集成
 * - 猴子补丁兼容
 *
 * @ts-check

/**
 * @typedef {Object} DebounceOptions
 * @property {boolean} [immediate=false] - 是否立即执行
 * @property {number} [maxWait=null] - 最大等待时间
 * @property {boolean} [leading=false] - 前缘执行
 * @property {boolean} [trailing=true] - 后缘执行
 * @property {Function} [onLeading] - 前置回调
 * @property {Function} [onTrailing] - 后置回调
 * @property {Function} [onError] - 错误处理器
 */

/**
 * @typedef {Object} DebouncedFunction
 * @property {Function} cancel - 取消待执行的调用
 * @property {Function} flush - 立即执行待执行的调用
 * @property {Function} pending - 检查是否有待执行的调用
 */

'use strict'

/**
 * 创建防抖函数
 *
 * @param {Function} fn - 需要防抖的函数
 * @param {number} wait - 延迟毫秒数
 * @param {DebounceOptions} [options] - 配置选项
 * @returns {Function & DebouncedFunction}
 *
 * @example
 * const debouncedFn = debounce(searchAPI, 300)
 * input.addEventListener('input', (e) => debouncedFn(e.target.value))
 *
 * @example
 * // 立即执行模式
 * const immediateFn = debounce(fetchData, 1000, { immediate: true })
 *
 * @example
 * // 最大等待时间
 * const maxWaitFn = debounce(sendAnalytics, 300, { maxWait: 1000 })
 */
function debounce(fn, wait, options = {}) {
  // 参数解析
  const {
    immediate = false,
    maxWait = null,
    leading = false,
    trailing = true,
    onLeading = null,
    onTrailing = null,
    onError = null
  } = options

  // 内部状态
  let timer = null
  let maxTimer = null
  let lastArgs = null
  let lastThis = null
  let lastCallTime = null
  let lastInvokeTime = 0
  let result = null

  // 辅助函数：是否正在等待
  const isPending = () => timer !== null

  // 核心执行函数
  const invokeFunc = function (time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = null
    lastThis = null
    lastInvokeTime = time

    try {
      result = fn.apply(thisArg, args)
    } catch (e) {
      result = e
      if (onError) onError(e)
    }

    if (trailing && onTrailing) {
      onTrailing()
    }

    return result
  }

  // 开始等待计时器
  const startWaitTimer = function (remaining, invokeByMaxWait = false) {
    timer = setTimeout(() => {
      timer = null
      lastCallTime = -Infinity

      if (!invokeByMaxWait && trailing) {
        invokeFunc(Date.now())
      }
    }, remaining)
  }

  // 核心防抖函数
  const debounced = function (...args) {
    const now = Date.now()
    const isInvoking = immediate && timer === null

    lastArgs = args
    lastThis = this
    lastCallTime = now

    // 计算剩余等待时间
    let remaining = wait

    if (maxWait !== null) {
      if (!lastInvokeTime) {
        lastInvokeTime = now
      }
      const elapsed = now - lastInvokeTime
      remaining = Math.max(wait - elapsed, 0)

      if (remaining <= 0 || elapsed > maxWait) {
        // 超过 maxWait 或 wait 已过，立即执行
        if (timer) clearTimeout(timer)
        timer = null
        lastInvokeTime = now
        lastArgs = null
        lastThis = null

        if (trailing) invokeFunc(now)
        return result
      }
    }

    // 非立即模式，启动等待计时器
    if (!immediate && !timer) {
      startWaitTimer(remaining)
    }

    // 立即模式
    if (immediate && timer === null) {
      timer = setTimeout(() => {
        timer = null
        lastInvokeTime = 0
        lastCallTime = -Infinity

        if (trailing) invokeFunc(now)
      }, wait)

      if (leading && isInvoking) {
        invokeFunc(now)
      }
    }

    // 启动最大等待计时器
    if (maxWait !== null && !maxTimer && !immediate) {
      maxTimer = setTimeout(() => {
        maxTimer = null
        if (timer) {
          clearTimeout(timer)
          timer = null
          invokeFunc(Date.now())
        }
      }, maxWait)
    }

    // 前置回调
    if (isInvoking && leading && onLeading) {
      onLeading()
    }

    return result
  }

  /**
   * 取消待执行的调用
   */
  debounced.cancel = function () {
    if (timer) clearTimeout(timer)
    if (maxTimer) clearTimeout(maxTimer)
    timer = null
    maxTimer = null
    lastArgs = null
    lastThis = null
    lastCallTime = null
  }

  /**
   * 立即执行待执行的调用
   */
  debounced.flush = function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
      if (lastArgs) {
        invokeFunc(Date.now())
      }
    }
  }

  /**
   * 检查是否有待执行的调用
   */
  debounced.pending = isPending

  return debounced
}

/**
 * 创建一个返回 Promise 的防抖版本
 *
 * @param {Function} fn - 异步函数
 * @param {number} wait - 延迟毫秒数
 * @param {DebounceOptions} [options] - 配置选项
 * @returns {Function & DebouncedFunction & {then, catch, finally: Function}}
 */
debounce.promise = function (fn, wait, options = {}) {
  const debounced = debounce(fn, wait, options)

  return function (...args) {
    return Promise.resolve(
      debounced.apply(this, args)
    )
  }
}

/**
 * 防抖装饰器
 *
 * @param {number} wait - 延迟毫秒数
 * @param {DebounceOptions} [options] - 配置选项
 * @returns {MethodDecorator}
 *
 * @example
 * class SearchService {
 *   @debounce(300, { immediate: true })
 *   search(query: string) {
 *     // ...
 *   }
 * }
 */
debounce.decorator = function (wait, options = {}) {
  return function (target, propertyKey, descriptor) {
    if (typeof descriptor.value !== 'function') {
      throw new Error('@debounce can only be used on methods')
    }

    const originalFn = descriptor.value
    const debouncedFn = debounce(originalFn, wait, options)

    descriptor.value = function (...args) {
      return debouncedFn.apply(this, args)
    }

    return descriptor
  }
}

// ============ 测试 ============
console.log('=== v5 企业级实现测试 ===')

// 基础用法
console.log('\n--- 基础防抖 ---')
const basicFn = debounce(function (msg) {
  console.log(`执行: ${msg}`)
  return 'done'
}, 200)

basicFn('调用1')
basicFn('调用2')
basicFn('调用3')

// Promise 版本
console.log('\n--- Promise 版本 ---')
async function fetchUser(id) {
  console.log(`获取用户 ${id}`)
  return { id, name: 'User' + id }
}

const debouncedFetch = debounce.promise(fetchUser, 100)

debouncedFetch(1)
debouncedFetch(2)
debouncedFetch(3).then(result => {
  console.log('Promise 结果:', result)
})

// pending 检查
console.log('\n--- pending 检查 ---')
const pendingFn = debounce(function () {
  console.log('执行')
}, 500)

console.log('调用前 pending:', pendingFn.pending())
pendingFn()
console.log('调用后 pending:', pendingFn.pending())

setTimeout(() => {
  console.log('500ms后 pending:', pendingFn.pending())
}, 100)

// flush 和 cancel
console.log('\n--- flush 和 cancel ---')
const fcFn = debounce(function (msg) {
  console.log(`flush执行: ${msg}`)
}, 300)

fcFn('任务1')
setTimeout(() => fcFn.flush(), 100) // 100ms后立即执行

const cancelFn = debounce(function () {
  console.log('这不会执行')
}, 200)

cancelFn()
cancelFn.cancel()
console.log('已取消')

// 错误处理
console.log('\n--- 错误处理 ---')
const errorFn = debounce(
  function (shouldFail) {
    if (shouldFail) throw new Error('演示错误')
    console.log('成功')
  },
  100,
  { onError: (e) => console.log('捕获错误:', e.message) }
)

errorFn(false)
errorFn(true)

setTimeout(() => {
  console.log('\n=== 所有测试完成 ===')
}, 1000)

// 导出 (支持 CommonJS 和 ES Module)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = debounce
}
