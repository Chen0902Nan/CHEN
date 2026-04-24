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
var maxDepth = function(root) {
  if(!root) return 0
  const queue=[root]
  let cnt=0
  while(queue.length){
    let size=queue.length
    while(size--){
    const node=queue.shift()
      node.left&&queue.push(node.left)
      node.right&&queue.push(node.right)
     
    }
    cnt++
  }
  return cnt
};


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
// 自顶向下
var maxDepth = function(root) {
  if(!root) return 0
    let ans=0
    const dfs =function (node,depth){
        if(!node) return
        depth++
         ans=Math.max(ans,depth)
        dfs(node.left,depth)
        dfs(node.right,depth)
    }
    dfs(root,0)
    
    return ans 
  };

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
// 自底向上
var maxDepth = function(root) {
    if(!root) return 0
    let lDepth=maxDepth(root.left)
    let rDepth=maxDepth(root.right)
    return Math.max(lDepth,rDepth)+1
};