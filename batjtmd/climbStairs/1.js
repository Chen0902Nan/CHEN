// 自顶向下

function climbStairs(n) {
  if (n === 1) return 1;
  if (n === 2) return 2;
  return climbStairs(n - 1) + climbStairs(n - 2);
}
// 太多的重复计算 调用栈的内存的爆栈
// 空间换时间

const memo = {};
function climbStairs(n) {
  if (n === 1) return 1;
  if (n === 2) return 2;
  if (memo[n]) return memo[n];
  memo[n] = climbStairs(n - 1) + climbStairs(n - 2);
  return memo[n];
}

// 外层函数创建闭包环境，私有化memo
const climbStairs = (function () {
  // 缓存对象，被闭包持有，多次调用不会重置
  const memo = {};

  // 内层函数实现核心逻辑，访问外层的memo
  return function climb(n) {
    // 边界条件
    if (n === 1) return 1;
    if (n === 2) return 2;

    // 优先读取缓存，避免重复递归计算
    if (memo[n]) return memo[n];

    // 递归计算并缓存结果
    memo[n] = climb(n - 1) + climb(n - 2);
    return memo[n];
  };
})();

// 测试示例
console.log(climbStairs(3)); // 输出 3
console.log(climbStairs(5)); // 输出 8
console.log(climbStairs(10)); // 输出 55

// 自底向上思考;
// f(1)=1
// f(2)=2
// f(3)=f(1)+f(2)
function climbStairs(n) {
  if (n === 1) return 1;
  if (n === 2) return 2;
  let prevPrev = 1;
  let prev = 2;
  let current;
  for (let i = 3; i <= n; i++) {
    current = prev + prevPrev;
    prevPrev = prev;
    prev = current;
  }
  return current;
}
