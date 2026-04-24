/**
 * @param {string} s
 * @return {number}
 */
// var lengthOfLongestSubstring = function (s) {
//   let left = 0;
//   let ans = 0;
//   const cnt = new Map();
//   for (let right = 0; right < s.length; right++) {
//     const c = s[right];
//     cnt.set(c, (cnt.get(c) ?? 0) + 1);
//     while (cnt.get(c) > 1) {
//       cnt.set(s[left], cnt.get(s[left]) - 1);
//       left++;
//     }
//     ans = Math.max(ans, right - left + 1);
//   }
//   return ans;
// };
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let left = 0;
  let res = 0;
  const window = new Set();
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    while (window.has(c)) {
      window.delete(s[left]);
      left++;
    }
    window.add(c);
    res = Math.max(res, right - left + 1);
  }
  return res;
};
