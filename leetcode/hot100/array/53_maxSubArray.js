/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  let sum = 0;
  let res = -Infinity;
  let minSum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    res = Math.max(sum - minSum, res);
    minSum = Math.min(minSum, sum);
  }
  return res;
};
