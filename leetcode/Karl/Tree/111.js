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
var minDepth = function(root) {
    if(!root) return 0
    let ans=Infinity
    const dfs=function(root,depth){
      if(!root) return 
      depth++
      if(root.left==null&&root.right==null){
        ans=Math.min(depth,ans)
        return 
      }
      dfs(root.left,depth)
      dfs(root.right,depth)

    }
    dfs(root,0)
    return ans
};



var minDepth = function(root) {
    let ans = Infinity;
    function dfs(node, cnt) {
        if (node === null || ++cnt >= ans) { // 最优性剪枝
            return;
        }
        if (node.left === null && node.right === null) { // node 是叶子
            ans = cnt;
            return;
        }
        dfs(node.left, cnt);
        dfs(node.right, cnt);
    }
    dfs(root, 0);
    return root ? ans : 0;
};

