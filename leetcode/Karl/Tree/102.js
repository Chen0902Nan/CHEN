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
 * @return {number[][]}
 */
var levelOrder = function (root) {
  const res = [];
  const queue = [];
  if (root) queue.push(root);
  while (queue.length) {
    const arr = [];
    let size = queue.length;
    while (size--) {
      queue[0].left && queue.push(queue[0].left);
      queue[0].right && queue.push(queue[0].right);
      arr.push(queue.shift().val);
    }
    res.push(arr);
  }
  return res;
};
