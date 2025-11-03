/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function (nums, k) {
  const n = nums.length
  const q = []
  //初始化队列
  for (let i = 0; i < k; i++) {
    while (q.length && nums[i] >= nums[q[q.length - 1]]) {
      q.pop()
    }
    q.push(i)
  }

  const ans = [nums[q[0]]]

  //窗口移动阶段
  for (let i = k; i < n; i++) {
    //维护队列单调性
    while (q.length && nums[i] >= nums[q[q.length - 1]]) {
      q.pop()
    }
    q.push(i)
    //清除左端不在窗口的数据
    if (q[0] <= i - k) {
      q.shift()
    }
    //将当前最大元素入队
    ans.push(nums[q[0]])
  }
  return ans
}
