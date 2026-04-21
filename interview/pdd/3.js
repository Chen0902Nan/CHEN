// xxx@xxx.xxx
const reg = /.+@.+\..+/;
// . 表示模糊匹配，什么都能匹配
// + 匹配一次或多次
// @精确匹配
// .精确匹配 本来有工作，任何一个字符，匹配本身的 转义
let str = "754211506@qq.com";
console.log(reg.test(str));
// 不完美
// @@@.qq.com
//{2,}长度至少两位

const reg1 = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 问题 .abc@xxx.com 可以通过，但是邮箱规定不以.开头
const reg2 = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)@[a-zA-Z0-9]+([a-zA-Z0-9-]+)\.[a-zA-Z]{2,}$/;
console.log(reg1.test(".abc@xxx.com"));


