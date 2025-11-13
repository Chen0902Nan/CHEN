/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function (nums) {
  //将数组转为Set集合，去重
  const set = new Set(nums)
  let res = 0
  for (const x of set) {
    //，判断x-1是否存在集合中，找出起始序列
    if (set.has(x - 1)) {
      continue
    }
    let y = x + 1
    while (set.has(y)) {
      y = ++y
    }
    // 比较每一次循环得到的res和以前得到的res，保存较大的一个
    res = Math.max(res, y - x)
  }
  return res
}
