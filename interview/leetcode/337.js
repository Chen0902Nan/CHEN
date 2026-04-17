function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

var rob = function (root) {
  const dfs = (node) => {
    if (!node) return [0, 0];
    const left = dfs[node.left];
    const right = dfs[node.right];

    // 偷当前节点
    const rob = node.val + left[1] + right[1];
    const notRob = Math.max(left[0] + left[1]) + Math.max(right[0] + right[1]);
    Math.max(right[0], right[1]);

    return [rob, notRob];
  };

  const res = dfs(root);
  return Math.max(res[0], res[1]);
};
