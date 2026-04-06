/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function (nums, k) {
  let n = (i = nums.length);
  if ((k %= n) === 0) return;
  while (i--) {
    nums[i + k] = nums[i];
    if (i <= k) nums[i] = nums[n + i];
  }
  nums.length = n;
};
