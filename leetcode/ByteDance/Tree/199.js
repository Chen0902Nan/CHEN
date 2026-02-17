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
 * @return {number[]}
 */
var rightSideView = function (root) {
  const ans = [];
  const getDeepth = function (node, deep) {
    if (node == null) return;
    if (deep == ans.length) {
      ans.push(node.val);
    }
    // 先递归右子树
    getDeepth(node.right, deep + 1);
    getDeepth(node.left, deep + 1);
  };
  getDeepth(root, 0);
  return ans
};
