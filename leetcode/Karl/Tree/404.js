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
 * @return {number}
 */
var sumOfLeftLeaves = function(root) {
   let ans=0
   const def=function(node){
  if(!node) return 0
  if(node.left&&node.left.left==null&&node.left.right==null){
    ans+=node.left.val
  }
  def(node.left)
  def(node.right)
}
      def(root)
      return ans
};

