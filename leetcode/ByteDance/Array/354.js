/**
 * @param {number[][]} envelopes
 * @return {number}
 */

const binarySearch = function (f, target) {
  let left = 0,
    right = f.length - 1;
  while (left < right) {
    let mid = Math.floor((right - left) / 2) + left;
    if (f[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
};

var maxEnvelopes = function (envelopes) {
  if (envelopes.length === 0) {
    return 0;
  }
  const len = envelopes.length;
  envelopes.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const f = [envelopes[0][1]];
  for (let i = 1; i < len; i++) {
    const num = envelopes[i][1];
    if (num > f[f.length - 1]) {
      f.push(num);
    } else {
      const index = binarySearch(f, num);
      f[index] = num;
    }
  }
  return f.length;
};
