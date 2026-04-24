// map
// 除了跟forEach 遍历数组之外 还会返回新数组
const arr = new Array(6).fill(1)
const newA = arr.map((item, index) => {
  return item + 1
})
console.log(newA)
