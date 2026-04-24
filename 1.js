/**
 * @param {number[]} nums
 * @return {number}
 */
var findLengthOfLCIS = function (nums) {
  if (nums.length <= 0) return 0;
  let left = 0;
  let ans = 1;
  for (let right = 1; right < nums.length; right++) {
    if (nums[right] > nums[right - 1]) {
      ans = Math.max(ans, right - left + 1);
    } else {
      left = right;
    }
  }
  return ans;
};
