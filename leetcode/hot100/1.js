// /**
//  * @param {number[]} nums
//  * @param {number} target
//  * @return {number[]}
//  */
// var twoSum = function (nums, target) {
//   let len = nums.length
//   let hash = new Map()
//   for (let i = 0; i < len; i++) {
//     let content = target - nums[i]
//     if (hash.has(content)) {
//       return [hash.get(content), i]
//     } else {
//       hash.set(nums[i], i)
//     }
//   }
// }
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  let len = nums.length
  let diffs = {}
  for (let i = 0; i < len; i++) {
    const complement = target - nums[i]
    // 杜绝 索引为0 带来的 if（0）
    if (diffs[complement] !== undefined) {
      return [diff[complement], i]
    } else {
      diffs[nums[i]] = i
    }
  }
}
