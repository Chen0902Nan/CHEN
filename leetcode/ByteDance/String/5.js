/**
 * @param {string} s
 * @return {string}
 */

var longestPalindrome = function (s) {
  if (s.length < 2) return s;
  let res = "";
  let len = s.length;
  var hlper = function (m, n) {
    while (n < len && s[m] === s[n]) {
      m--;
      n++;
    }
    if (n - m - 1 > res.length) {
      res = s.slice(m + 1, n);
    }
  };

  for (let i = 0; i < len; i++) {
    // 奇数回文
    hlper(i, i);
    // 偶数回文
    hlper(i, i + 1);
  }

  return res;
};
