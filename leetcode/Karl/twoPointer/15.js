function threeSum(nums){
  // 先排序  sort 内置排序 -> 冒泡排序
  // 会修改数组本身
  nums.sort((a,b)=>a-b)
  const res=[]
  for(let i=0;i<nums.length-2;i++){
    //跳过重复的起点
    // i=0 时 是第一个数字 不需要跳过
    // i j k 三个数字不能重复
    if(i>0&&nums[i]==nums[i-1]) continue
    // 双指针
    let left=i+1
    let right=nums.length-1
    while(left<right){
      const sum=nums[i]+nums[left]+nums[right]
      if(sum===0){
        res.push([nums[i],nums[left],nums[right]])
        left++
        right--
        while(left<right&&nums[left]===nums[left-1]) left++
        while(left<right&&nums[right]===nums[right+1]) right--
      }else if(sum<0){
        left++
      }else{
        right--
      }
    }
  }
  return res
}