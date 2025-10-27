/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */

// //解法一：把nums当作栈
// var moveZeroes = function (nums) {
//   let stackSize = 0
//   for (const x of nums) {
//     if (x != 0) {
//       //有多少个非零元素，就有nums.size-stackSize个零
//       nums[stackSize] = x
//       stackSize++
//     }
//   }
//   //从stackSzie开始填充，全重置为0
//   nums.fill(0, stackSize)
// }

//解法二：双指针 -> 即快慢指针
var moveZeroes = function (nums) {
  //慢指针，用于记录零元素的位置
  let j = 0
  for (let i = 0; i < nums.length; i++) {
    //i为快指针，遍历数组找到非零元素
    if (nums[i] != 0) {
      ;[nums[j], nums[i]] = [nums[i], nums[j]]
      j++
    }
  }
}
