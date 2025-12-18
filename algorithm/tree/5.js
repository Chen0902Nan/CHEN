// 层序遍历 level order traversal 树的层级从上到下
// 每层从左到右，借助队列

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = this.right = null;
  }
}
// 用迭代 借助队列
function levelOrder(root) {
  if (!root) return []; // 空树
  const result = [];
  const queue = [root];
  while (queue.length) {
    // 迭代
    const node = queue.shift(); // FIFO
    result.push(node.val);
    if (node.left) {
      queue.push(node.left);
    }
    if (node.right) {
      queue.push(node.rights);
    }
  }
  return result;
}
