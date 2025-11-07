// js 内部调用 UTF-16编码 存储，常规字符用16位来表示一个单位，
// emoji 和一些 生僻字 占据两个甚至更多的单位

console.log('a'.length)
console.log('中'.length)
// emoji
console.log('𝄞'.length) // 2
// 空格也算一个字符
const str = ' Hello, 世界! 👋 '
console.log(str.length)
console.log(str[15])
console.log(str.charAt(1), str.charAt(1) === str[1])
console.log(str.slice(1, 6)) // 字符串切割 [start,end)
console.log(str.substring(1, 6))
