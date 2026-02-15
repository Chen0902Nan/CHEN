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
var maxDepth = function (root) {
  if (root == null) return 0;

  let left = maxDepth(root.left);
  let right = maxDepth(root.right);
  return Math.max(left, right) + 1;
};
var maxDepth = function (root) {
  let ans = 0;
  const depF = function (node, cnt) {
    if (node == null) return;
    cnt++;
    ans = Math.max(cnt, ans);
    depF(node.left, cnt);
    depF(node.right, cnt);
  };
  depF(root, ans);
  return ans;
};
