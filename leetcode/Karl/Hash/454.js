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
  let sum2 = [] //1,3
  let sum3 = [] //1,4
  let sum4 = [] //2,3
  let sum5 = [] //2,4
  let sum6 = [] //3,4
  // 两数和
  for (const x of nums1) {
    for (const y of nums2) {
      sum1.push(x + y)
    }
  }
  for (const x of nums1) {
    for (const y of nums3) {
      sum2.push(x + y)
    }
  }
  for (const x of nums1) {
    for (const y of nums4) {
      sum3.push(x + y)
    }
  }
  for (const x of nums2) {
    for (const y of nums3) {
      sum4.push(x + y)
    }
  }
  for (const x of nums2) {
    for (const y of nums4) {
      sum5.push(x + y)
    }
  }
  for (const x of nums3) {
    for (const y of nums4) {
      sum6.push(x + y)
    }
  }
  // 四数和
  for (const x of sum1) {
    for (const y of sum6) {
      if (x + y == 0) ans++
    }
  }

  return ans
}
