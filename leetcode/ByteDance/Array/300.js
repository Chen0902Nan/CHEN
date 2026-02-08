/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var lengthOfLIS = function (nums) {
  const top = [];
  let piles = 0;
  for (let i = 0; i < nums.length; i++) {
    let poke = nums[i];
    let left = 0,
      right = piles;
    while (left < right) {
      // 等价于 Math.floor((left+right)/2)
      let mid = left + ((right - left) >> 1);
      if (top[mid] > poke) {
        right = mid;
      } else if (top[mid] < poke) {
        left = mid + 1;
      } else {
        // 找到相等，也要往左找（保证严格递增 LIS）
        right = mid;
      }
    }
    if (left == piles) piles++;
    top[left] = poke;
  }
  return piles;
};
