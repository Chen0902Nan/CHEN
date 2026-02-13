/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
  const n = nums.length;
  const s = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    s[i + 1] = nums[i] + s[i];
  }

  const cnt = new Map();
  let ans = 0;
  for (const x of s) {
    ans = ans + (cnt.get(x - k) ?? 0);
    cnt.set(x, (cnt.get(x - k) ?? 0) + 1);
  }
  return ans;
};
