/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
  const map = new Map();
  let sum = 0;
  let res = 0;
  map.set(sum, 1);
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (map.has(sum - k)) {
      res += map.get(sum - k);
    }
    map.set(sum, (map.get(sum) ?? 0) + 1);
  }
  return res;
};

subarraySum([1, 1, 1]);
