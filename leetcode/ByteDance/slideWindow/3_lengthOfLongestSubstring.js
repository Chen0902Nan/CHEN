/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  if (!s.length) return 0;
  const map = new Map();
  let left = 0;
  let res = 1;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    map.set(c, (map.get(c) ?? 0) + 1);
    while (map.get(c) > 1) {
      map.set(s[left], map.get(s[left]) - 1);
      left++;
    }
    res = Math.max(res, right - left + 1);
  }
  return res;
};
