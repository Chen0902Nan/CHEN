// /**
//  * @param {string} s
//  * @param {string} t
//  * @return {boolean}
//  */
// var isAnagram = function (s, t) {
//   const mapS = new Map()
//   let sLen = s.length
//   let tLen = t.length
//   if (sLen !== tLen) return false
//   for (let i = 0; i < sLen; i++) {
//     if (mapS.get(s[i])) {
//       mapS.set(s[i], mapS.get(s[i]) + 1)
//     } else {
//       mapS.set(s[i], 1)
//     }
//   }
//   for (const char of t) {
//     if (!mapS.has(char)) {
//       // t 中出现了 s 没有的字符
//       return false
//     }
//     mapS.set(char, mapS.get(char) - 1)
//     if (mapS.get(char) === 0) {
//       mapS.delete(char) // 关键：删除计数为 0 的 key
//     }
//   }
//   return mapS.size === 0
// }
// /**
//  * @param {string} s
//  * @param {string} t
//  * @return {boolean}
//  */
// var isAnagram = function (s, t) {
//   const mapS = new Map()
//   let sLen = s.length
//   let tLen = t.length
//   if (sLen !== tLen) return false
//   for (let i = 0; i < sLen; i++) {
//     if (mapS.get(s[i])) {
//       mapS.set(s[i], mapS.get(s[i]) + 1)
//     } else {
//       mapS.set(s[i], 1)
//     }
//   }
//   for (const char of t) {
//     if (!mapS.has(char)) {
//       // t 中出现了 s 没有的字符
//       return false
//     }
//     mapS.set(char, mapS.get(char) - 1)
//     if (mapS.get(char) === 0) {
//       mapS.delete(char) // 关键：删除计数为 0 的 key
//     }
//   }
//   return mapS.size === 0
// }
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (s, t) {
  const arr = new Array(26).fill(0)
  for (const x of s) {
    arr[x.charCodeAt(0) - 'a'.charCodeAt(0)]++
  }
  for (const x of t) {
    arr[x.charCodeAt(0) - 'a'.charCodeAt(0)]--
  }
  return arr.every(c => c === 0)
}
