/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  let res = 0;
  let left = 0,
    right = height.length - 1;
  while (left < right) {
    res = Math.max(Math.min(height[left], height[right]) * (right - left), res);
    if (height[left] <= height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return res;
};


