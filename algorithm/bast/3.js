function deleteNode(root, n) {
  if (!root) {
    return root;
  }
  if (root.val === n) {
    if (!root.left && !root.right) {
      root = null;
    } else if (root.left) {
      // 左子树最大的结点，代替这个节点
      const maxLeft = findMax(root.left);
      root.val = maxLeft.val;
      root.left = deleteNode(root.left, maxLeft.val);
    } else {
      const minRight = finMin(root.right);
      root.val = minRight.val;
      root.right = deleteNode(root.right, minRight.val);
    }
  } else if (root.val > n) {
    root.left = deleteNode(root.left, n);
  } else {
    root.right = deleteNode(root.right, n);
  }
  return root;
}
// 寻找左子树最大值
function findMax(root) {
  while (root.right) {
    root = root.right;
  }
  return root;
}

// 寻找右子树的最小值
function findMin(root) {
  while (root.left) {
    root = root.left;
  }
  return root;
}
