/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  const s0 = strs[0];
  let res = "";
  for (let i = 0; i < s0.length; i++) {
    for (const x of strs) {
      if (i === x.length || s[i] !== s0[i]) {
        return (res = s0.slice(0, i));
      }
    }
  }
  return res;
};
