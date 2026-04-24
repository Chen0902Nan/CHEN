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

var isSameTree = function (p, q) {
  if (q == null || p == null) {
    return q == p;
  }
  return (
    p.val == q.val && isSameTree(p.left, q.right) && isSameTree(p.right, q.left)
  );
};

var isSymmetric = function (root) {
  return isSameTree(root.left, root.right);
};
