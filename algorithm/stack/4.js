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
  push () {
    this.#stack.push()
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
    return this.#stack
  }
}
