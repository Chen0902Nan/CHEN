/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  const map = new Map()
  const stack = []
  map.set('(', ')')
  map.set('{', '}')
  map.set('[', ']')

  let len = s.length
  if (!s) return true
  for (let i = 0; i < len; i++) {
    if (s[i] === '(' || s[i] === '{' || s[i] === '[') {
      stack.push(map.get(s[i]))
    } else {
      if (!stack.length || s[i] !== stack.pop()) {
        return false
      }
    }
  }
  return !stack.length
}
