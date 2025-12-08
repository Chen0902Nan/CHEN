/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  let left = 0
  let n = nums.length
  for (let right = 0; right < n; right++) {
    if (nums[right] !== val) {
      nums[left] = nums[right]
      left++
    }
  }
  return left
}
