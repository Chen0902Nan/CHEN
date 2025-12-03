// /**
//  * @param {string} s
//  * @return {string}
//  */
// var reverseWords = function (s) {
//   return s.trim().split(/\s+/).reverse().join('')
// }
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function (s) {
  s = s.trim()
  const len = s.length - 1
  const res = []
  let i = len,
    j = len
  let str = ''
  while (i >= 0) {
    while (i >= 0 && s[i] !== ' ') {
      i--
    }
    while (j !== i) {
      str = s[j] + str
      j--
    }
    res.push(str)
    str = ''
    while (i >= 0 && s[i] == ' ') {
      i--
    }
    j = i
  }
  return res.join(' ')
}
