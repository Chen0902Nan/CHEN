const cache={
}
function fib(n){
  if(n in cache){
    return cache[n]
  }
  if(n<=1){
    cache[n]=n
    return n
  }
  const result=fib(n-1)+fib(n-2)
  cache[n]=result
  return result
}
console.log(fib(10));
