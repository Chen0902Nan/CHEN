// cache 闭包到函数中
const cache={}
const fib=(function(){
//闭包 
// 装载自由变量
// IIFE
// console.log('111');
return function(n){
  if(n in cache){
    return cache[n]
  }
  if(n<=1) {
    cache[n]=n
    return n
  }
  cache[n]=fib(n-1)+fib(n-2)
  return cache[n]
}
})()
console.log(fib(10));
