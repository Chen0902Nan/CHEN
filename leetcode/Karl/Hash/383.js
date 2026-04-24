// /**
//  * @param {string} ransomNote
//  * @param {string} magazine
//  * @return {boolean}
//  */
// var canConstruct = function (ransomNote = 'aa', magazine = 'ab') {
//   const map = new Map()
//   for (const x of magazine) {
//     if (!map.has(x)) {
//       map.set(x, 1)
//     } else {
//       map.set(x, map.get(x) + 1)
//     }
//   }
//   for (const x of ransomNote) {
//     if (map.has(x)) {
//       map.set(x, map.get(x) - 1)
//     } else {
//       return false
//     }
//   }
//   for (const x of map.values()) {
//     if (x < 0) {
//       return false
//     }
//   }
//   return true
// }
/**
 * @param {string} ransomNote
 * @param {string} magazine
 * @return {boolean}
 */
var canConstruct = function (ransomNote, magazine) {
  if (magazine.length < ransomNote.length) return false
  const arr = new Array(26).fill(0)
  const a = 'a'.charCodeAt(0)
  for (const x of magazine) {
    arr[x.charCodeAt(0) - a]++
  }
  for (const x of ransomNote) {
    if (--arr[x.charCodeAt(0) - a] < 0) return false
  }
  return true
}
