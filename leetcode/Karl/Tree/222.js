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
var countNodes = function(root) {
  if(!root) return 0
    const queue=[root]
    let count=0
    while(queue.length){
      count++
       queue[0].left && queue.push(queue[0].left);
      queue[0].right && queue.push(queue[0].right); 
      queue.shift()
      
    }
    return  count
};