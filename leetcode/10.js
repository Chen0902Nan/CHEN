/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
//暴力解法
var subarraySum = function (nums, k) {
  let ans = 0
  let sum = 0
  for (let i = 0; i < nums.length; i++) {
    sum = 0
    for (let j = i; j < nums.length; j++) {
      sum += nums[j]
      if (sum == k) ans++
    }
  }
  return ans
}
