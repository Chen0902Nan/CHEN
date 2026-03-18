



const tree=function(root){
  if(!root) return 
  const ans=[]
  const queue=[root]
  while(queue.length){
    let size=queue.length
    const arr=[]
    queue[0].left&&queue.push(queue[0].left)
    queue[0].right&&queue.push(queue[0].right)
    while(size--){
      arr.push(queue.shift().val)
    }
    ans.push(arr)
  }
  return ans
}
console.log(tree([1,2,3,4,5,6,7]));
