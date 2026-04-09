/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
  let n = nums.length;
  const pre = new Array(n);

  pre[0] = 1;

  for (let i = 1; i < n; i++) {
    pre[i] = pre[i - 1] * nums[i - 1];
  }
  const suf = new Array(n);

  suf[n - 1] = 1;

  for (let i = n - 2; i >= 0; i--) {
    suf[i] = suf[i + 1] * nums[i + 1];
  }
  const answer = new Array(n);
  for (let i = 0; i < n; i++) {
    answer[i] = pre[i] * suf[i];
  }
  return answer;
};
