// /**
//  * @param {number[]} nums1
//  * @param {number[]} nums2
//  * @return {number[]}
//  */
// var intersection = function (nums1, nums2) {
//   const len1 = nums1.length
//   const len2 = nums2.length
//   const res = []
//   const map = new Map()
//   for (let i = 0; i < len1; i++) {
//     if (!map.has(nums1[i])) {
//       map.set(nums1[i], 1)
//     } else {
//       continue
//     }
//   }
//   for (let i = 0; i < len2; i++) {
//     if (map.has(nums2[i])) {
//       res.push(nums2[i])
//     } else {
//       continue
//     }
//   }
//   const arr = new Set(res)
//   return Array.from(arr)
// }
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function (nums1, nums2) {
  const set = new Set(num1)
  const ans = []
  const set2 = new Set(nums2)
  for (const x of set2) {
    if (set.has(x)) {
      ans.push(x)
    }
  }
  return ans
}
