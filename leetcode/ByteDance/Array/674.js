var findLengthOfLCIS = function (nums) {
  let res = 1,
    max = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      res++;
    } else {
      res = 1;
    }
    max = Math.max(max, res);
  }
  return max;
};
