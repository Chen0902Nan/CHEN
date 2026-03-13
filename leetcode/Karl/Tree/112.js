/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function(root, targetSum) {
   if(!root) return false
   const dfs=function(node,curSum){
    curSum=curSum+node.val
    if(!node.left&&!node.right){
      return curSum===targetSum
    }
    if(node.left&&dfs(node.left,curSum)){
      return true
    }
    if(node.right&&dfs(node.right,curSum)){
      return true
    }
    return false
   }
   return dfs(root,0)
};

/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function(root, targetSum) {
   if(!root) return false
  
  targetSum=targetSum-root.val
   if(!root.left&&!root.right){
    return targetSum===0
   }

  return hasPathSum(root.left, targetSum)||hasPathSum(root.right,targetSum)
};

