import fs from 'fs'

// es6 之前
// fs.readFile('./1.html', 'utf-8', (err, data) => {
//   if (err) {
//     console.log(err)
//     return
//   }
//   console.log(data)
// })

const p = new Promise((resolve, reject) => {
  fs.readFile('./1.html', 'utf-8', (err, data) => {
    if (err) {
      reject(err)
    }

    resolve(data)
  })
})

p.then(data => {
  console.log(data)
}).catch(err => {
  console.log(err)
})

const main = async () => {
  const html = await p
  console.log(html)
}
main()
