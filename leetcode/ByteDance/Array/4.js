/**
 * @param {number[]} a
 * @param {number[]} b
 * @return {number}
 */
var findMedianSortedArrays = function (a, b) {
  if (a.length > b.length) {
    [a, b] = [b, a];
  }

  const m = a.length,
    n = b.length;
  // 循环不变量：a[left] <= b[j+1]
  // 循环不变量：a[right] > b[j+1]
  let left = -1,
    right = m;
  while (left + 1 < right) {
    // 开区间 (left, right) 不为空
    const i = Math.floor((left + right) / 2);
    const j = Math.floor((m + n - 3) / 2) - i;
    if (a[i] <= b[j + 1]) {
      left = i; // 缩小二分区间为 (i, right)
    } else {
      right = i; // 缩小二分区间为 (left, i)
    }
  }

  // 此时 left 等于 right-1
  // a[left] <= b[j+1] 且 a[right] > b[j'+1] = b[j]，所以答案是 i=left
  const i = left;
  const j = Math.floor((m + n - 3) / 2) - i;
  const ai = i >= 0 ? a[i] : -Infinity;
  const bj = j >= 0 ? b[j] : -Infinity;
  const ai1 = i + 1 < m ? a[i + 1] : Infinity;
  const bj1 = j + 1 < n ? b[j + 1] : Infinity;
  const max1 = Math.max(ai, bj);
  const min2 = Math.min(ai1, bj1);
  return (m + n) % 2 ? max1 : (max1 + min2) / 2;
};
