/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    let left=0,right=height.length-1
    let ans=0
    while(left<right){
      ans=Math.max((right-left)*Math.min(height[left],height[right]),ans)
      if(height[left]<height[right]){
        left++
      }else{
        right--
      }
    }
    return ans
};