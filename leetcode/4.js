/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  // 确保 nums1 是较短的数组，以保证二分查找的效率 O(log(min(m, n)))
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }
  const m = nums1.length;
  const n = nums2.length;
  let left = 0;
  let right = m;

  // 总长度的一半（如果有奇数个，左半部分多包含一个元素）
  const halfLen = Math.floor((m + n + 1) / 2);

  while (left <= right) {
    // i 是 nums1 的切分位置，j 是 nums2 的切分位置
    const i = Math.floor((left + right) / 2);
    const j = halfLen - i;

    // 处理边界值：如果切分在数组的最左边或最右边
    // 使用无穷大来保证逻辑判断正确
    const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];
    const minRight1 = i === m ? Infinity : nums1[i];

    const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];
    const minRight2 = j === n ? Infinity : nums2[j];

    // 判断切分是否正确
    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      // 找到了，如果是奇数，中位数是左半部分的最大值
      if ((m + n) % 2 === 1) {
        return Math.max(maxLeft1, maxLeft2);
      }
      // 如果是偶数，中位数是 (左半最大 + 右半最小) / 2
      return (
        (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2
      );
    } else if (maxLeft1 > minRight2) {
      // nums1 的切分点太靠右了，向左移动
      right = i - 1;
    } else {
      // nums1 的切分点太靠左了，向右移动
      left = i + 1;
    }
  }
};
