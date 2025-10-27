/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  let ans = 0
  let left = 0
  let lMax = 0
  let right = height.length - 1
  let rMax = 0
  //核心思想：每个位置的接水数=两边高度最小值-当前位置的高度
  while (left < right) {
    lMax = Math.max(height[left], lMax)
    rMax = Math.max(height[right], rMax)
    if (lMax > rMax) {
      ans += rMax - height[right--]
    } else {
      ans += lMax - height[left++]
    }
  }
  return ans
}
