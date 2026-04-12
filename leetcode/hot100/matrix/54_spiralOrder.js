/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function (matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const res = new Array(m * n);
  let i = 0,
    j = 0,
    di = 0;
  const DIRS = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  for (let k = 0; k < m * n; k++) {
    res[k] = matrix[i][j];
    matrix[i][j] = Infinity;
    let x = i + DIRS[di][0];
    let y = j + DIRS[di][1];
    if (x < 0 || x >= m || y < 0 || y >= n || matrix[x][y] === Infinity) {
      // 越界 右转90°
      di = (di + 1) % 4;
    }
    // 更新实际位置
    i = i + DIRS[di][0];
    j = j + DIRS[di][1];
  }
  return res;
};
