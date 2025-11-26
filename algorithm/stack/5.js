// 用一个map | json 来维护左括号和右括号的对应关系
// 用一个栈 维护左括号，遇到右括号时，弹出栈顶元素，查看是否匹配
// 若不匹配或栈不为空，无效，若遍历完后栈为空，有效
const leftToright = {
  '(': ')',
  '{': '}',
  '[': ']'
}
const isValid = function (str) {
  if (!str) return true
  const stack = []
  const len = str.len
  for (let i = 0; i < len; i++) {
    const ch = str[i]
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(leftToright.ch)
    } else {
      if (!stack.length || stack.pop() !== ch) {
        return false
      }
    }
  }
  return !stack.length
}
