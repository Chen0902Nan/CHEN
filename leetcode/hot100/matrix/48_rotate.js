/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      const temp = matrix[i][j];
      matrix[i][i] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }

  for (const x of matrix) {
    x.reverse();
  }
};
