/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  let left = 0
  let right = height.length - 1
  let s = 0
  while (left < right) {
    s = Math.max((right - left) * Math.min(height[left], height[right]), s)
    //双指针从两头分别找比较有无更大的值，向内比较
    if (height[left] < height[right]) {
      left++
    } else {
      right--
    }
  }
  return s
}
