/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let ans = 0
  let left = 0
  let hash = new Map()
  for (let right = 0; right < s.length; right++) {
    const c = s[right]
    //(hash.get(c) ?? 0)  如果左边存在，否则=0
    hash.set(c, (hash.get(c) ?? 0) + 1)
    //判断重复，移动左窗口
    while (hash.get(c) > 1) {
      hash.set(s[left], hash.get(s[left]) - 1)
      left++
    }
    ans = Math.max(ans, right - left + 1)
  }
  return ans
}
