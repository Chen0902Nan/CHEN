// es5 构造函数
const MiniStack = function () {
  this.stack = [] // 数组
}
MiniStack.prototype.push = function (x) {
  this.stack.push(x)
}
MiniStack.prototype.pop = function (x) {
  return this.stack.pop()
}
MiniStack.prototype.top = function () {
  if (!this.stack || !this.stack.length) {
    return
  } else {
    return this.stack[this.stack.length - 1]
  }
}
// // O（n)
// MiniStack.prototype.getMin = function () {
//   // 遍历一遍
//   // Math.min Infinity
//   let minVal = Infinity //无穷大
//   const { stack } = this.stack
//   for (let i = 0; i < stack.length; i++) {
//     if (stack[i] < minVal) {
//       minVal = stack[i]
//     }
//   }
//   return minVal
// }
