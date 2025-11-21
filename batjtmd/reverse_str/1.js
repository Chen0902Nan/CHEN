function reversStr (str) {
  // 字符串 split 拼接成字符串
  // 数组join 拼接成字符串
  return str.split('').reverse().join('')
}
console.log(reversStr('abc'))
