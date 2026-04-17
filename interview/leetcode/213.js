/**
 * @param {number[]} nums
 * @return {number}
 */
var robRange = function (nums, start, end) {
  const len = end - start + 1;
  if (len === 1) return nums[start];
  const dp = new Array(len);
  dp[0] = nums[start];
  dp[1] = Math.max(nums[start], nums[start + 1]);

  for (let i = 2; i < len; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
  }
  return dp[len - 1];
};

function rob(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];
  const res1 = robRange(nums, 1, n - 1);
  const res2 = robRange(nums, 0, n - 2);
  return Math.max(res1, res2);
}
