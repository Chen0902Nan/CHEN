/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  let n = height.length;
  let ans = 0;
  // 前缀最大值
  const preMax = new Array(n);
  // 后缀最大值
  const sufMax = new Array(n);
  preMax[0] = height[0];
  for (let i = 1; i < n; i++) {
    preMax[i] = Math.max(preMax[i - 1], height[i]);
  }
  sufMax[n - 1] = height[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    sufMax[i] = Math.max(sufMax[i + 1], height[i]);
  }
  for (let i = 0; i < n; i++) {
    // 当前位置接水量=前后缀最小值-实际高度
    ans = ans + Math.min(sufMax[i], preMax[i]) - height[i];
  }
  return ans;
};

var trap = function (height) {
  let preMax = 0,
    sufMax = 0,
    n = height.length,
    ans = 0;
  let left = 0,
    right = n - 1;
  while (left < right) {
    preMax = Math.max(height[left], preMax);
    sufMax = Math.max(height[right], sufMax);
    if (preMax > sufMax) {
      ans = ans + sufMax - height[right];
      right--;
    } else {
      ans = ans + preMax - height[left];
      left++;
    }
  }
  return ans;
};
