/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function (nums, target) {
  const ans = []
  const n = nums.length
  nums.sort((a, b) => a - b)
  // 枚举第一个数
  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && nums[i] == nums[i - 1]) continue // 跳过重复数字
    if (nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target) break // 优化一
    if (nums[i] + nums[n - 3] + nums[n - 2] + nums[n - 1] < target) continue // 优化二
    // 枚举第二个数
    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue // 跳过重复数字
      if (nums[i] + nums[j] + nums[j + 1] + nums[j + 2] > target) break // 优化一
      if (nums[i] + nums[j] + nums[n - 2] + nums[n - 1] < target) continue // 优化二
      let k = j + 1,
        l = n - 1

      while (k < l) {
        const s = target - nums[i] - nums[j] - nums[k] - nums[l]
        if (s < 0) {
          l--
        } else if (s > 0) {
          k++
        } else {
          ans.push([nums[i], nums[j], nums[k], nums[l]])
          for (k++; nums[k] == nums[k - 1]; k++);
          for (l--; nums[l] == nums[l + 1]; l--);
        }
      }
    }
  }
  return ans
}
