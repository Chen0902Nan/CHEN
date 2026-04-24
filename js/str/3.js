const todos = [
  {
    id: 1,
    text: '学习es6'
  },
  {
    id: 2,
    text: '通读你不知道的javascript'
  }
]

const arr = todos.map(function (item) {
  return `<li>${item.text}</li>`
})
console.log(arr, todos)
//es6箭头函数，function 可以省略，
//如果只有一个参数，()也可以省略
//如若返回值只有一行，可以省略{}
console.log(todos.map(item => `<li>${item.text}</li>`))
