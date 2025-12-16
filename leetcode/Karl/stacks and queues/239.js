/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function (nums, k) {
  let ans=0
  let stack=[]
  let stack2=[]
 for(let i=0;i<k;i++){
  stack.push(nums[i])
  ans+=nums[i]
 }
  stack2.push(ans)
 for(let i=k;i<nums.length;i++){
  if(ans<stack[stack.length-1]+stack[stack.length-2]+nums[i]){
    ans=stack[stack.length-1]+stack[stack.length-2]+nums[i]
    stack.shift()
    stack.push(nums[i])
    stack2.push(ans)
    continue
  }
  stack.shift()
  stack.push(nums[i])
  stack2.push(ans)
 }
 return stack2
}
maxSlidingWindow([1,3,-1,-3,5,3,6,7],3)