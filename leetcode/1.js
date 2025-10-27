var twoSum = function (nums, target) {
  const idx = new Map() // 创建一个空哈希表
  for (let j = 0; ; j++) {
    // 枚举 j
    const x = nums[j]
    // 在左边找 nums[i]，满足 nums[i]+x=target
    if (idx.has(target - x)) {
      // 找到了
      return [idx.get(target - x), j] // 返回两个数的下标
    }
    idx.set(x, j) // 保存 nums[j] 和 j
  }
}
