const arr = [1, 2, 3, 3, 4]
const set = new Set(arr)
const arr1 = Array.from(set, item => item ** 2)
// console.log(arr1)
const obj = {
  name: '柯基',
  age: 18
}
// const arr3 = Array.from(obj)
// console.log(arr3)
// const _ = require('lodash')
// const obj2 = structuredClone(obj)
// console.log(obj2)
// const arr3 = arr.slice(arr)
// console.log(arr3)
// const obj2 = structuredClone(obj)
// obj2.name = '华高俊'
// console.log(obj, obj2)
const arr2 = structuredClone(arr)
arr2.pop()
console.log(arr, arr2)
