/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
    if (k === 1) return nums;
    const deque = []; // 存储索引，维持单调递减（对应值）
    const res = [];

    for (let i = 0; i < nums.length; i++) {
        // 1. 移除队列中超出窗口范围的索引（队首）
        while (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }

        // 2. 从队尾移除所有对应值 <= nums[i] 的索引（保持单调递减）
        while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
            deque.pop();
        }

        // 3. 将当前索引入队
        deque.push(i);

        // 4. 当窗口形成后（i >= k - 1），记录最大值（队首索引对应的值）
        if (i >= k - 1) {
            res.push(nums[deque[0]]);
        }
    }

    return res;
};