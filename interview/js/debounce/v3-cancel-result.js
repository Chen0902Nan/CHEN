/**
 * v3: 取消功能 + 返回值处理
 * 新增功能：
 *  - cancel() 主动取消
 *  - flush() 立即执行
 *  - 返回 Promise 支持（可选）
 */

function debounce(fn, delay, immediate = false) {
  let timer = null
  let lastArgs = null
  let lastThis = null
  let result = null

  const debounced = function (...args) {
    lastArgs = args
    lastThis = this

    const callNow = immediate && timer === null

    if (timer) clearTimeout(timer)

    if (immediate) {
      timer = setTimeout(() => {
        timer = null
      }, delay)

      if (callNow) {
        result = fn.apply(this, args)
      }
    } else {
      timer = setTimeout(() => {
        result = fn.apply(lastThis, lastArgs)
        timer = null
      }, delay)
    }

    return result
  }

  // 取消调用
  debounced.cancel = function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    lastArgs = null
    lastThis = null
  }

  // 立即执行（仅适用于非 immediate 模式）
  debounced.flush = function () {
    if (timer && !immediate) {
      clearTimeout(timer)
      timer = null
      if (lastArgs) {
        result = fn.apply(lastThis, lastArgs)
      }
    }
  }

  return debounced
}

// ============ 测试 ============
console.log('=== v3 取消 + flush 测试 ===')

const apiCall = debounce(function (data) {
  console.log('API 调用:', data)
  return 'success'
}, 500)

const promiseId = apiCall('请求1')
apiCall('请求2')
apiCall('请求3')

// 500ms后执行请求3

setTimeout(() => {
  console.log('\n--- 测试 cancel ---')
  const cancelableFn = debounce(function (msg) {
    console.log('执行:', msg)
  }, 200)

  cancelableFn('任务A')
  cancelableFn('任务B')
  cancelableFn.cancel() // 取消任务B

  setTimeout(() => {
    console.log('\n--- 测试 flush ---')
    const flusableFn = debounce(function (msg) {
      console.log('flush执行:', msg)
    }, 300)

    flusableFn('延迟任务')
    setTimeout(() => {
      flusableFn.flush() // 立即执行
      console.log('已flush')
    }, 100)
  }, 400)
}, 700)
