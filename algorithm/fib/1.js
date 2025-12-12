function fib(n){
  // 退出条件
  if(n<=1) return n
  // 函数调用自己 递归
  // 递归的公式
  return fib(n-1)+fib(n-2)
}
console.log(fib(100));
