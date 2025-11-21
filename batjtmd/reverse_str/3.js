// 递归
// 函数内自己调用自己
// 大的问题交给小（类似）的问题
function reversStr (str) {
  // 退出条件
  if (str === '') {
    return ''
  } else {
    // 第二个字符到最后
    return reversStr(str.substr(1)) + str.charAt(0)
  }
}
str = 'Hello'
console.log(reversStr('Hello'))
console.log(str.substr(1))
