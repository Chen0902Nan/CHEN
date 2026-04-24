/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */

const isCovered = function (cntS, cntT) {
  for (let i = "A".charCodeAt(0); i <= "Z".charCodeAt(0); i++) {
    if (cntS[i] < cntT[i]) return false;
  }
  for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
    if (cntS[i] < cntT[i]) return false;
  }
  return true;
};
var minWindow = function (s, t) {
  const cntS = new Array(128).fill(0);
  const cntT = new Array(128).fill(0);
  const m = s.length;
  for (const x of t) {
    cntT[x.charCodeAt(0)]++;
  }
  let left = 0,
    ansLeft = -1,
    ansRight = m;

  for (let right = 0; right < m; right++) {
    cntS[s[right].charCodeAt(0)]++;
    while (isCovered(cntS, cntT)) {
      if (right - left < ansRight - ansLeft) {
        ansLeft = left;
        ansRight = right;
      }
      cntS[s[left].charCodeAt(0)]--;
      left++;
    }
  }
  return ansLeft < 0 ? "" : s.slice(ansLeft, ansRight + 1);
};
