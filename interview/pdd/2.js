/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
  const len = nums.length;
  // 从第二张开始，第一张一定有序
  for (let i = 1; i < len; i++) {
    let current = nums[i];
    let j = i - 1;
    // 在已经排序从后端向前扫描，寻找插入位置
    // 如果发现已排序的元素比当前元素大，将其后移一位
    while (j >= 0 && nums[j] > current) {
      nums[j + 1] = nums[i];
      j--;
    }
    nums[j + 1] = current;
  }
  return nums;
};
