/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  // 确保nums1是较短的数组
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }

  const m = nums1.length;
  const n = nums2.length;
  let low = 0,
    high = m;
  while (low < high) {
    // 先猜一个分割位置
    const i = Math.floor((low + high) / 2);
    // 根据i，推算出nums2的分割位置
    // 目标是让左右两边的元素总数相等，或左边多一个
    // total_left = (m + n + 1) / 2
    const j = Math.floor((m + n + 1) / 2) - i;
    // 定义分割线两侧的四个关键元素
    // 处理边界情况：如果分割线在数组的最左侧，左边值设为负无穷
    // 如果分割线在数组最右侧，右边最小值为正无穷
    const maxLeftA = i == 0 ? -Infinity : nums1[i - 1];
    const minRightB = i === m ? Infinity : nums1[i];
    const maxLeftB = j === 0 ? -Infinity : nums2[j - 1];
    const minRightA = j === n ? Infinity : nums2[j];
    // 证明他是不是合格的切割点就好了
    // if(maxLeftA)
  }
};
