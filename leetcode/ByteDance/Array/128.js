/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function (nums) {
  const set = new Set(nums);
  let ans = 0;
  for (const x of set) {
    // 不是起始节点
    if (set.has(x - 1)) {
      continue;
    }
    let y = x + 1;
    while (set.has(y)) {
      y++;
    }
    // 循环结束后，y-1 是最后一个在哈希集合中的数
    ans = Math.max(ans, y - x);
    if (ans * 2 >= set.size) {
      break;
    }
  }
  return ans;
};
