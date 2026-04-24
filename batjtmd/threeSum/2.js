const nums=[1,32,23,123,53,555,2213,532]
// b在前面 a在后面 a-b<0 交换 从小到大
nums.sort((a,b)=>{
  console.log(a,b);
  return a-b
  
})
console.log(nums);
