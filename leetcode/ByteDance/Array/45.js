/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function (nums) {
  // 当前桥右端点
  let cur = 0;
  let next = 0,
    ans = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    // 下一座桥右端点
    next = Math.max(next, nums[i] + i);
    // 无路可走，建桥
    if (cur == i) {
      cur = next;
      ans++;
    }
  }
  return ans
};
