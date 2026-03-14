/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var constructMaximumBinaryTree = function(nums) {
  if(!nums.length) return null
    const val=Math.max(...nums)
    const index=nums.indexOf(val)
    if(index===-1){
      return null
    }
    const leftNums=nums.slice(0,index)
    const rightNums=nums.slice(index+1,nums.length)
    const left=constructMaximumBinaryTree(leftNums)
    const right=constructMaximumBinaryTree(rightNums)

    return new TreeNode(val,left,right)
};
