const arr = [1, 2, 3, 4, 5, 6]
// 编写代码，返回这个数组的平方
// const res = arr.map(item => {
//   return item * item
// })

const res = arr.map(function (item, index, arr) {
  console.log(index, arr)
  return item * item
})

// console.log(res)

// console.log(parseInt('108'))
// console.log(parseInt('八百108')) //NaN
// console.log(parseInt('108八百'))
// console.log(parseInt('1314.520'))
// console.log(8 / 0) //Infinity
