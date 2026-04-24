// let a = 1,
//   b = 2,
//   c = 3
// 如何一次性声明多个变量？
// 数组的结构赋值
// es6 为了优雅而来
// let [a, b, c] = [1, 2, 3]
// console.log(a, b, c)

// 非一维数组 -> 嵌套数组
// const arr = [1, [2, 3, [4], 5]]
// const [a, [b, c, [d], e]] = arr

// console.log(a, b, c, d, e)

// const arr = [1, 2, 3, 4, 5]
// //arr[0] a
// // 余下的 数组 b
// // reset 运算符
// const [a, ...b] = arr
// console.log(a, b)

// const users = ['Darvin Ham', 'James', 'Luka', 'Davis', 'Ayton', '天天']
// // 左右一致
// const [captain, ...players] = users

// console.log(captain, players)

// const sex = 'boy'
// const obj = {
//   name: '刘翔平',
//   age: 18,
//   // es6中的对象属性简写语法(Shorthand Property)
//   sex, // sex:sex
//   like: {
//     n: '唱跳'
//   }
// }
// // console.log(obj)
// // let name = obj.name
// // 一次性的解构一个对象
// // 只要左右一致即可，[],{} 都能解开
// let {
//   name,
//   age,
//   like: { n }
// } = obj
// console.log(name, age, n)
const [a, b, ...c] = 'hello'
console.log(a, b, c)
// 要的是length
const { length } = 'hello'
console.log(length)
