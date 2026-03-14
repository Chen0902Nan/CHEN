/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
    const n=preorder.length
    if(n===0) return null
    const leftSize=inorder.indexOf(preorder[0])
    // 防御性检查，以防没找到
        if (leftSize === -1) {
        return null; 
    }
    const pre1=preorder.slice(1,leftSize+1)
    const pre2=preorder.slice(leftSize+1,n)
    const ino1=inorder.slice(0,leftSize)
    const ino2=inorder.slice(leftSize+1,n)
    const left=buildTree(pre1,ino1)
    const right=buildTree(pre2,ino2)

    return new TreeNode(preorder[0],left,right)
};