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
var findBottomLeftValue = function(root) {
  if(!root) return null
    const queue=[root]
    const ans=[]
    while(queue.length){
      let size=queue.length
      let arr=[]
      while(size--){
        queue[0].left&&queue.push(queue[0].left)
        queue[0].right&&queue.push(queue[0].right)
        arr.push(queue.shift().val)
      }
      ans.push(arr)
    }
    return ans[ans.length-1][0]
};

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
var findBottomLeftValue = function(root) {
    let maxDeep=0
    let resNode=0
    if(!root) return null
    const dfs=function(root,curDepth){
      if(!root.left&&!root.right){
        if(curDepth>maxDeep){
          maxDeep=curDepth
          resNode=root.val
        }
        return
      }
        root.left&&dfs(root.left,curDepth+1)
        root.right&&dfs(root.right,curDepth+1)
    }
    dfs(root,1)
return resNode
};