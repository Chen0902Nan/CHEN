/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  let n = height.length;
  let ans = 0;
  let left = 0;
  let right = n - 1;
  while (left < right) {
    let area = Math.min(height[right], height[left]) * (right - left);
    ans = Math.max(area, ans);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return ans;
};
