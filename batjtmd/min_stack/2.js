var MinStack = function () {
  this.stack = []
  this.stack2 = []
}

/**
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function (val) {
  if (this.stack.length == 0 || this.stack2[this.stack2.length - 1] >= val) {
    this.stack2.push(val)
  }
  this.stack.push(val)
}

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
  if (this.stack.pop() == this.stack2[this.stack2.length - 1]) {
    this.stack2.pop()
  }
}

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
  return this.stack[this.stack.length - 1]
}

/**
 * @return {number}
 */
MinStack.prototype.getMin = function () {
  return this.stack2[this.stack2.length - 1]
}

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
