/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
  let ans = []
  let left = 0
  let P = new Array(26).fill(0)
  let S = new Array(26).fill(0)
  //统计p中字母出现次数
  for (const x of p) {
    P[x.charCodeAt() - 'a'.charCodeAt()]++
  }
  for (let right = 0; right < s.length; right++) {
    //右边界进入窗口
    S[s[right].charCodeAt() - 'a'.charCodeAt()]++
    //计算左边界
    left = right - p.length + 1
    //窗口太小，直接进入下一次循环
    if (left < 0) {
      continue
    }
    //如果窗口===P，追加左边界
    if (_.isEqual(P, S)) {
      ans.push(left)
    }
    //左边界移除窗口，进入下一次循环
    S[s[left].charCodeAt() - 'a'.charCodeAt()]--
  }
  return ans
}
