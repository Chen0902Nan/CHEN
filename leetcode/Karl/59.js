/**
 * @param {number} n
 * @return {number[][]}
 */
var generateMatrix = function (n) {
  let res = new Array(n).fill(0).map(() => new Array(n).fill(0))
  let startX = 0,
    startY = 0
  let loop = Math.floor(n / 2)
  let mid = Math.floor(n / 2)
  let count = 1
  let offset = 1
  while (loop--) {
    let x = startX
    let y = startY
    for (; y < startY + n - offset; y++) {
      res[x][y] = count++
    }
    for (; x < startX + n - offset; x++) {
      res[x][y] = count++
    }
    for (; y > startY; y--) {
      res[x][y] = count++
    }
    for (; x > startX; x--) {
      res[x][y] = count++
    }
    offset = offset + 2
    startX++
    startY++
  }
  if (n % 2 === 1) {
    res[mid][mid] = count
  }
  return res
}
