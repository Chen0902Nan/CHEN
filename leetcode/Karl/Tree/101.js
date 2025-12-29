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
var isSymmetric = function (root) {
  function isSameTree(p, q) {
    if (p == null || q == null) {
      return p === q;
    }
    return (
      q.val === p.val &&
      isSameTree(p.left, q.right) &&
      isSameTree(p.right, q.left)
    );
  }
  return isSameTree(root.left, root.right);
};
