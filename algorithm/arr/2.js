const arr = new Array(6).fill(0)

const len = arr.length // 对象的属性 有开销 提前申明
//计数循环
// 遍历数组方法千千万，计数循环性能最好
for (let i = 0; i < len; i++) {
  console.log(arr[i])
}
