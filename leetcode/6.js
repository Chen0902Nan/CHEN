/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  let ans = []
  if (nums == null || nums.length < 3) return ans
  nums.sort((a, b) => a - b) //对数组排序
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) break //此时三数合一定大于零，直接跳出循环
    if (i > 0 && nums[i] == nums[i - 1]) continue //重复判断，直接进入下一次循环
    //定义双指针
    let L = i + 1
    let R = nums.length - 1
    while (L < R) {
      if (nums[i] + nums[L] + nums[R] == 0) {
        ans.push([nums[i], nums[L], nums[R]])
        //重复判断，去重
        while (L < R && nums[L] == nums[L + 1]) L++
        while (L < R && nums[R] == nums[R - 1]) R--
        L++
        R--
      } else if (nums[i] + nums[L] + nums[R] > 0) {
        R-- //数值过大，右指针减小
      } else {
        L++ //数值过小，左指针加大
      }
    }
  }
  return ans
}
