const arr = [1, 2, 3, 4, 5, 6]
res = arr.reduce((acc, cur, index, arr) => {
  console.log(acc + 1)

  console.log(cur)
})
console.log(res)
