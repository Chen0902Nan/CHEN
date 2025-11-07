let str = 'hello'
// slice 支持负数 从后往前数
console.log(str.slice(-3, -1)) // ll
// substring 不支持负数索引 -3当作0
console.log(str.substring(-3, -1)) // 不支持负数

// slice 不支持大小逆置
console.log(str.slice(3, 1))
// substring 支持大小逆置
console.log(str.substring(3, 1))

// 返回某个字符的第一个下标
console.log(str.indexOf('o')) // 4
console.log(str.indexOf('l'))
// 返回某个字符的最后一个下表
console.log(str.lastIndexOf('l'))
