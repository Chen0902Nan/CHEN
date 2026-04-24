function add () {
  // let result = 0
  // // length arguments[i] 数组
  // for (let i = 0; i < arguments.length; i++) {
  //   result += arguments[i]
  // }
  // // console.log(JSON.stringify(arguments))
  // // console.log(JSON.stringify([1, 2, 3]))
  // const arr = [...arguments]
  // console.log(arr instanceof Array)

  // console.log(Object.prototype.toString.call(arr))

  return [...arguments].reduce((pre, cur) => pre + cur, 0)
}

console.log(add(1, 2, 3, 4, 5, 6))

console.log([1, 2, 3, 4, 5, 6].reduce((pre, cur) => pre + cur, 0))
