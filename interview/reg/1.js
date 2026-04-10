// 11位
// 1开头 + 10位数字
// 用户输入的字符串
// 字符串 一定的模式
const phone = 15145865889;
// \d 表示数字 ^1以1开头
const reg = /^1\d{10}/;
console.log(reg.test(phone));
