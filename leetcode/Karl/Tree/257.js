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
 * @return {string[]}
 */
var binaryTreePaths = function(root) {
    const ans=[]
    const def=function (root,path){
      if(!root) return
      path+=root.val
      if(root.left==null&&root.right==null){
        ans.push(path)
        return
      }
      path+='->'
      def(root.left,path)
      def(root.right,path)
    }
    def(root,'')
    return ans
};