// function TreeNode(val) {
//   this.val = val;
//   this.left = null;
//   this.right = null;
// }
function TreeNode(val) {
  this.val = val;
  //  从右到左的
  this.left = this.right = null;
}
const root = new TreeNode(1);
const node2 = new TreeNode(2);
const node3 = new TreeNode(3);
root.left = node2;
root.right = node3;
const node4 = new TreeNode(1);
const node5 = new TreeNode(1);
node2.left = node4;
node2.right = node5;
// 用对象字面量来表达树
// 从字面意义上就可以了解对象的
let tree = {
  val: 1,
  left: {
    val: 2,
  },
};
