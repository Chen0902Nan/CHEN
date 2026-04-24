function twoSum (nums, target) {
  const diffs = {} //es5没有hashMap 0（1）时间复杂度
  const len = nums.length
  for (let i = 0; i < len; i++) {
    const complement = target - nums[i]
    if (diffs[complement] !== undefined) {
      return [diffs[complement], i]
    }
    diffs[nums[i]] = i
  }
}
