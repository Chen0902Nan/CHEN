/**
 * @param {number} n
 * @return {number[][]}
 */
var generateMatrix = function (n) {
  let res = new Array(n).fill(0).map(() => new Array(n).fill(0))
  let loop = Math.floor(n / 2)
  let count = 1
  let offset = 1
  let mid = Math.floor(n / 2)
  let startX = 0,
    startY = 0

  while (loop--) {
    for (let val = 1; val < n * n; val++) {
      let x = startX,
        y = startY
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
      startX++
      startY++
      offset = offset + 2
    }
  }
  if (n % 2 == 1) {
    res[mid][mid] = count
  }
  return res
}
