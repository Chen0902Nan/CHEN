/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function (target, nums) {
  let len = nums.length,
    left = 0,
    sum = 0,
    ans = len + 1
  for (let right = 0; right < len; right++) {
    sum = sum + nums[right]
    // 窗口就是 满足其和 ≥ s 的长度最小的 连续 子数组
    while (sum - nums[left] >= target) {
      sum = sum - nums[left]
      left++
    }
    if (sum >= target) {
      ans = Math.min(ans, right - left + 1)
    }
  }
  return ans <= len ? ans : 0
}
