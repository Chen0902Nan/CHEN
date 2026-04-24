/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
  // 保存每个元素出现的次数
  const map = new Map();
  const res = [];
  for (const x of nums) {
    if (!map.has(x)) {
      map.set(x, 1);
    } else {
      map.set(x, map.get(x) + 1);
    }
  }
  // 把相同次数的值放在一起
  const Maxmap = Math.max(...map.values());
  const buckets = Array.from({ length: Maxmap + 1 }, () => []);
  for (const [x, c] of map.entries()) {
    buckets[c].push(x);
  }
  // 倒序遍历buckets，排序输出
  for (let i = Maxmap; i >= 0 && res.length < k; i--) {
    res.push(...buckets[i]);
  }
  return res;
};
