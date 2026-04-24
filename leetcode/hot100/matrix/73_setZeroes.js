var setZeroes = function (matrix) {
  const m = matrix.length,
    n = matrix[0].length;
  const rowHasZero = Array(m).fill(false); // 行是否包含 0
  const colHasZero = Array(n).fill(false); // 列是否包含 0

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 0) {
        rowHasZero[i] = colHasZero[j] = true;
      }
    }
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rowHasZero[i] || colHasZero[j]) {
        // i 行或 j 列有 0
        matrix[i][j] = 0; // 题目要求原地修改，无返回值
      }
    }
  }
};
