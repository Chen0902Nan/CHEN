function add(a, b) {
  return a + b;
}

console.log(add.length);

function curry(fn) {
  // closure curry fn
  // curried args 收集参数  不那么严谨的柯理化函数
  return function curried(...args) {
    // curried 闭包
    if (args.length >= fn.length) {
      return fn(...args); // 退出
    }
    return (...rest) => curried(...args, ...rest);
  };
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2));
