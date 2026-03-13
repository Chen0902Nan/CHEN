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
 * @return {boolean}
 */
var isBalanced = function(root) {
    return getHeight(root)!==-1
};

const getHeight=function(root){
  if(!root) return 0
  // 自底向上
  const lHeight=getHeight(root.left)
  const rHeight=getHeight(root.right)
  if(lHeight==-1||rHeight==-1||Math.abs(lHeight-rHeight)>1){
    return -1
  }
  // 记录最小高度和最大高度
  return Math.max(lHeight,rHeight)+1 

}