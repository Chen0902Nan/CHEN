const users = [
  {
    id: 1,
    username: '张三'
  },
  {
    id: 2,
    username: '李四'
  },
  {
    id: 3,
    username: '王五'
  }
]

console.log(users.find(user => user.id === 2))
