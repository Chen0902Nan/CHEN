/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
  nums.sort((a,b)=>a-b)
  let ans=[]
    for(let i=0;i<nums.length-2;i++){
       if (i > 0 && nums[i]=== nums[i - 1]) continue // 跳过重复数字
      let j=i+1,k=nums.length-1
      while(j<k){
        if(nums[j]+nums[k]+nums[i]<0){
          j++
        }else if(nums[j]+nums[k]+nums[i]>0){
          k--
        }else if(nums[j]+nums[k]+nums[i]==0){
        ans.push([nums[i], nums[j], nums[k]]);
        for (j++; j < k && nums[j] === nums[j - 1]; j++); // 跳过重复数字
        for (k--; k > j && nums[k] === nums[k + 1]; k--); // 跳过重复数字
      }
    }
  }
    return ans
  }