/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function (nums, k) {
  const queue = [];
  const res = [];
  for (let i = 0; i < k; i++) {
    if (!queue.length) queue.push(i);
    while (nums[queue[0]] < nums[i]) {
      queue.shift();
    }
    if (nums[i] >= nums[queue[queue.length - 1]]) {
      while (nums[i] >= nums[queue[queue.length - 1]]) {
        queue.pop();
      }
    }
    queue.push(i);
  }

  res.push(nums[queue[0]]);

  for (let i = 0; i < nums.length; i++) {
    while (queue[0] <= i - k) {
      queue.shift();
    }

    if (nums[i] < nums[queue[queue.length - 1]]) {
      queue.push(i);
      res.push(nums[queue[0]]);
      continue;
    }
    while (nums[queue[0]] < nums[i]) {
      queue.shift();
    }

    while (nums[i] >= nums[queue[queue.length - 1]]) {
      queue.pop();
    }

    queue.push(i);
    res.push(nums[queue[0]]);
  }
  return res;
};
