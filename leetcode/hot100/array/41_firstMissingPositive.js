/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function (nums) {
  let n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] >= 1 && nums[i] <= n && nums[i] !== nums[nums[i] - 1]) {
      // 那么就交换 nums[i] 和 nums[j]，其中 j 是 i 的学号
      // 下标从0开始，所以y要 -1
      const j = nums[i] - 1;
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }

  for (let i = 0; i < n; i++) {
    // 第一个不匹配的就是
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
};
