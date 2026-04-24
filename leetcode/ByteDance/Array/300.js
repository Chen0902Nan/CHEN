/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    const top=[]
    let piles=0
    for(let i=0;i<nums.length;i++){
      let poker=nums[i]
      // 左闭右开
      let left=0,right=piles
      while(left<right){
        let mid=Math.floor((left+right)/2)
        if(top[mid]<poker){
          left=mid+1
        }else if(top[mid]>poker){
          right=mid
        }else {
          // 一直往左找，找靠近左侧的堆顶
          right=mid
        }
      }
    if (left == piles) piles++;
    top[left] = poker;
    }
    return piles
    
};


var lengthOfLIS=function(nums){

  const dp=new Array(nums.length).fill(1)
  for(let i=0;i<nums.length;i++){
    for(let j=0;j<i;j++){
      if(nums[j]<nums[i]){
        dp[i]=Math.max(dp[i],dp[j]+1)
      }
    }
  }
   return Math.max(...dp);
}