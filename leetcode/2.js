// 连续子数组的最大和[1,-2,3,10,-4,7,2,-5]

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  if (nums.length == 0) return 0;
  if (nums.length == 1) return nums[0];

  let sum = nums[0];
  let maxSum = sum;
  let left = 0;
  for (let right = 1; right < nums.length; right++) {
    if (sum <= 0) {
      left = right;
      sum = nums[left];
      maxSum = Math.max(sum, maxSum);
      right = left;
    } else {
      sum += nums[right];
      maxSum = Math.max(sum, maxSum);
    }
  }

  return maxSum;
};
// 前缀和写法

var maxSubArray = function (nums) {
  let ans = -Infinity;
  let preSum = 0;
  let minPreSum = 0;
  for (const x of nums) {
    preSum += x;
    ans = Math.max(ans, preSum - minPreSum);
    minPreSum = Math.min(minPreSum, preSum);
  }
  return ans;
};
