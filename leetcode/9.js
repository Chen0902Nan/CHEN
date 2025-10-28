/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
  const ans = []
  const cntP = new Array(26).fill(0)
  const cntS = new Array(26).fill(0)
  // 统计p中每个字符的出现次数
  for (const c of p) {
    cntP[c.charCodeAt() - 'a'.charCodeAt()]++
  }
  for (let right = 0; right < s.length; right++) {
    cntS[s[right].charCodeAt() - 'a'.charCodeAt()]++
    //计算左边界
    left = right - p.length + 1
    //窗口长度不够，进入下次循环
    if (left < 0) {
      continue
    }
    // 检查当前窗口是否是p的字母异位词
    if (_.isEqual(cntS, cntP)) {
      //追加起始索引
      ans.push(left)
    }
    //左边界离开窗口
    cntS[s[left].charCodeAt() - 'a'.charCodeAt()]--
  }
  return ans
}
