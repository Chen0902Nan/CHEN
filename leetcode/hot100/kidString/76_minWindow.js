/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function (s, t) {
  const sArray = new Array(128).fill(0);
  const tArray = new Array(128).fill(0);
  let res = "";
  let minWindow = Infinity;
  for (let i = 0; i < t.length; i++) {
    tArray[t[i].charCodeAt()]++;
  }
  let left = 0;

  const isValid = () => {
    for (let i = 0; i < 128; i++) {
      if (sArray[i] < tArray[i]) {
        return false;
      }
    }
    return true;
  };

  for (let right = 0; right < s.length; right++) {
    sArray[s[right].charCodeAt()]++;
    while (left <= right && isValid()) {
      if (right - left + 1 < minWindow) {
        minWindow = right - left + 1;
        res = s.slice(left, right + 1);
      }
      sArray[s[left].charCodeAt()]--;
      left++;
    }
  }
  return res;
};
minWindow("ADOBECODEBANC", "ABC");
