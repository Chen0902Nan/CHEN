/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
  const map = new Map();
  const res = [];
  for (const x of nums) {
    if (!map.has(x)) {
      map.set(x, 1);
    } else {
      map.set(x, map.get(x) + 1);
    }
  }
  let len = 0;
  for (const key of map.keys()) {
    key;
    len++;
  }

  for (const [key, value] of map.entries()) {
    let max;
    for (const [key, value] of map.entries()) {
      max = Math.max();
    }
  }
};
// topKFrequent([1, 1, 1, 2, 2, 3]);
