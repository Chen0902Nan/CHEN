/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  const res = [];
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    let left = i + 1,
      right = nums.length - 1;

    while (left < right) {
      let sum = nums[left] + nums[i] + nums[right];
      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else if (sum == 0) {
        res.push([nums[left], nums[i], nums[right]]);
        left++;
        right--;

        while (left < right && nums[left] == nums[left - 1]) left++;
        while (left < right && nums[right] == nums[right + 1]) right--;
      }
    }
  }
  return res;
};
