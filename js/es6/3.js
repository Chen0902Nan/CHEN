// js 不适合做大量的运算
// 精度丢失 最大能表达的位数是 2……53-1 64位
// 第一位符号位 11位指数  52位
// bigint
let num = 21313213241434124122222221313131n
console.log(typeof num)
// 最大的安全值
console.log(Number.MAX_SAFE_INTEGER)
// 幂运算符 es7 2017
console.log(2 ** 10)
