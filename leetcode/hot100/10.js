/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
//暴力解法
// var subarraySum = function (nums, k) {
//   let ans = 0
//   let sum = 0
//   for (let i = 0; i < nums.length; i++) {
//     sum = 0
//     for (let j = i; j < nums.length; j++) {
//       sum += nums[j]
//       if (sum == k) ans++
//     }
//   }
//   return ans
// }

//  前缀和+哈希
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
  let ans = 0
  let sum = 0
  let hash = new Map()
  //处理 nums[0]=k -> s-k=0
  hash.set(0, 1)
  for (const x of nums) {
    sum = sum + x
    //每个相同的前缀和值，都代表不同的起始位置
    ans = ans + (hash.get(sum - k) ?? 0)
    //记录前缀和出现的次数
    hash.set(sum, (hash.get(sum) ?? 0) + 1)
  }
  return ans
}
