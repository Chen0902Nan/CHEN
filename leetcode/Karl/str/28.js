// /**
//  * @param {string} haystack
//  * @param {string} needle
//  * @return {number}
//  */
// var strStr = function (haystack, needle) {
//   const len = haystack.length - 1
//   const size = needle.length - 1
//   let left = 0,
//     right = 0
//   if (needle === '') return 0
//   for (let i = 0; i <= len - size; i++) {
//     while (haystack[left] == needle[right]) {
//       left++
//       right++
//     }
//     if (right == size && haystack[left] == needle[right]) {
//       return left - size
//     } else {
//       left = i + 1
//       right = 0
//     }
//   }
//   return -1
// }

// // console.log(strStr('sadbutsad', 'sad'))
// /**
//  * @param {string} haystack
//  * @param {string} needle
//  * @return {number}
//  */
// var strStr = function (haystack, needle) {
//   const hLen = haystack.length - 1
//   const nLen = needle.length - 1
//   if (needle == '' || hLen < nLen) return -1
//   for (let i = 0; i <= hLen - nLen; i++) {
//     let str = haystack.slice(i, i + nLen + 1)
//     if (str === needle) {
//       return i
//     } else {
//       continue
//     }
//   }
//   return -1
// }

/** KMP 算法
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
  let hLen = haystack.length
  let nLen = needle.length
  if (needle == '' || hLen - nLen < 0) return -1
  const pi = new Array(nLen).fill(0)
  for (let i = 1, j = 0; i < nLen; i++) {
    while (j > 0 && needle[i] !== needle[j]) {
      j = pi[j - 1]
    }
    if (needle[i] == needle[j]) {
      j++
    }
    pi[i] = j
  }
  for (let i = 0, j = 0; i < hLen; i++) {
    while (j > 0 && haystack[i] !== needle[j]) {
      j = pi[j - 1]
    }
    if (haystack[i] == needle[j]) {
      j++
    }
    if (j == nLen) {
      return i - nLen + 1
    }
  }
  return -1
}
