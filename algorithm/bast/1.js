function search(root, n) {
  if (!root) {
    return;
  }
  if (root.val === n) {
    console.log("目标节点就是：", root);
  } else if (root.val > n) {
    search(root.left, n);
  } else {
    search(root.right, n);
  }
}
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

const root = new TreeNode(6);
root.left = new TreeNode(3);
root.right = new TreeNode(8);
root.left.left = new TreeNode(1);
root.left.right = new TreeNode(4);
root.right.left = new TreeNode(7);
root.right.right = new TreeNode(9);
console.log(search(root, 7));
