/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function (nums) {
  const narr = nums.map(item => {
    return item * item
  })
  narr.sort((a, b) => a - b)
  return narr
}
