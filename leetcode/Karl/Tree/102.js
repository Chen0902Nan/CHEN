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
  if (root === null) {
    return [];
  }
  const res = [];
  let cur = [root];
  while (cur.length) {
    const tn = [];
    const ne = [];
    for (const x of cur) {
      tn.push(x.val);
      x.left && ne.push(x.left);
      x.right && ne.push(x.right);
    }
    cur = ne;
    res.push(tn);
  }
  return res;
};

var levelOrder = function (root) {
  if (!root) return [];
  const res = [];
  const queue = [root];
  while (queue.length) {
    const vals = [];
    let n = queue.length;
    while (n--) {
      const cur = queue.shift();
      vals.push(cur.val);
      if (cur.left) queue.push(cur.left); // 确保只push有效的left节点
      if (cur.right) queue.push(cur.right); // 确保只push有效的right节点
    }
    res.push(vals);
  }
  return res;
};
