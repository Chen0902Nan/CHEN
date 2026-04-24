// 打印结果是？
// parseInt callbackFn
//parseInt(element,index,arry)
// ;[1, 2, 3].map(function (item, index, arr) {
//   console.log(item, index, arr)

//   return item
// })
// console.log([1, 2, 3].map(parseInt)) //[1,NaN,NaN]
console.log(parseInt(9, 0, [1, 2, 3])) // 1 radix=0 是特例，解读为10进制（默认）
console.log(parseInt(2, 1, [1, 2, 3])) // NaN radix<2或者radix>36 则会返回NaN

// console.log(parseInt(2, 1, [1, 2, 3]))
// console.log(parseInt('ff', 16)) //255
// console.log(parseInt(8, 8)) //NaN 8进制没有8
