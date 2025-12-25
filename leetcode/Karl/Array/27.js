/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  let len = nums.length
  let ans = 0
  for (let i = 0; i < len; i++) {
    if (nums[i] == val) {
      nums[i] = undefined
      ans = ans + 1
    }
  }
  nums.sort((a, b) => b - a)
  return len - ans
}
