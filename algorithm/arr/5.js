// for(let item of arr) es6提供的新方法
// 性能好可读性好 如果不需要下标
// 计数循环 缺点是可读性差
const arr = [1, 2, 3, 4, 5, 6, 7]
for (let item of arr) {
  console.log(item + 1)
}
