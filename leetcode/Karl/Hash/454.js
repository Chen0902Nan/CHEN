/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number[]} nums3
 * @param {number[]} nums4
 * @return {number}
 */
var fourSumCount = function (nums1, nums2, nums3, nums4) {
  let ans = 0
  let sum1 = [] //1,2
  let sum6 = [] //3,4
  let map = new Map()
  // 两数和
  for (const x of nums1) {
    for (const y of nums2) {
      sum1.push(x + y)
    }
  }
  for (const x of nums3) {
    for (const y of nums4) {
      sum6.push(x + y)
      if (!map.has(x + y)) {
        map.set(x + y, 1)
      } else {
        map.set(x + y, map.get(x + y) + 1)
      }
    }
  }
  let len = sum1.length
  // 四数和
  for (let i = 0; i < len; i++) {
    if (map.has(-sum1[i])) {
      ans = ans + map.get(-sum1[i])
    }
  }
  return ans
}
