/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function(inorder, postorder) {
    const n =postorder.length
    if(n===0) return null
    const leftSize=inorder.indexOf(postorder[n-1])
    const ino1=inorder.slice(0,leftSize)
    const ino2=inorder.slice(leftSize+1,n)
    const pos1=postorder.slice(0,leftSize)
    const pos2=postorder.slice(leftSize,n-1)
    const left=buildTree(ino1,pos1)
    const right=buildTree(ino2,pos2)

    return new TreeNode(postorder[n-1],left,right)
    
};