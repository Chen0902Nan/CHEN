// 数组来实现stack
class ArrayStack {
  #stack
  constructor () {
    this.#stack = []
  }
  get size () {
    return this.#stack.length
  }
  isEmpty () {
    return this.size === 0
  }
  push (val) {
    this.#stack.push(val)
  }
  pop () {
    if (this.isEmpty()) throw new Error('栈为空')
    return this.#stack.pop()
  }
  peek () {
    if (this.isEmpty()) throw new Error('栈为空')
    return this.#stack[this.size - 1]
  }
  toArry () {
    return [...this.#stack]
  }
}
const stack1 = new ArrayStack()
stack1.push(1)
stack1.push(2)
stack1.push(3)
stack1.push(4)
stack1.push(5)
// console.log(stack1.toArry())

const res = stack1.toArry()
res.pop()
console.log(res, stack1.toArry())
