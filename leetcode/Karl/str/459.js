/**
 * @param {string} s
 * @return {boolean}
 */
// 暴力
var repeatedSubstringPattern = function (s) {
  if (s.length == 1) return false
  const sLen = s.length
  for (let i = 0; i < sLen / 2; i++) {
    let str = ''
    let t = s.slice(0, i + 1)
    if (sLen % t.length !== 0) continue
    let x = sLen / t.length
    for (let j = 0; j < x; j++) {
      str = str + t
    }
    if (str === s) return true
  }
  return false
}

//KMP
/**
 * @param {string} s
 * @return {boolean}
 */
var repeatedSubstringPattern = function (s) {
  const n = s.length
  const next = new Array(n).fill(0)
  for (let i = 1, j = 0; i < n; i++) {
    while (j > 0 && s[i] !== s[j]) {
      j = next[j - 1]
    }
    if (s[i] == s[j]) {
      j++
    }
    next[i] = j
  }
  const len = next[n - 1]
  return len > 0 && n % (n - len) === 0
}

//API
var repeatedSubstringPattern = function (s) {
  return (s + s).slice(1, -1).includes(s)
}
