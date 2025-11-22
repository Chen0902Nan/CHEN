/**
 * @param {number} A
 * @param {number} B
 * @return {number}
 */
// 递增乘法
var multiply = function (A, B) {
  if (B == 1) {
    return A
  }
  return multiply(A, B - 1) + A
}
