function insertIntoBst(root, n) {
  if (!root) {
    root = new TreeNode(n);
    return root;
  }
  if (root.val > n) {
    root.left = insertIntoBst(root.left, n);
  } else {
    root.right = insertIntoBst(root.right, n);
  }
  return root;
}
