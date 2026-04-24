/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
  if (intervals.length <= 1) return intervals;
  const res = [];
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < intervals.length; i++) {
    if (!res.length) {
      res.push(intervals[i]);
      continue;
    }
    if (intervals[i][0] <= res[res.length - 1][1]) {
      res[res.length - 1][1] = Math.max(intervals[i][1], res[res.length - 1][1])
    } else {
      res.push(intervals[i]);
    }
  }
  return res;
};
