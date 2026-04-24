import fs from 'fs'
console.log(1)
// 异步代码
// I/O 操作
// 3.js 在线程执行的时候，从硬盘的文件系统，调入内存
// readFile a.txt 从内存中又去硬盘的文件系统读取a.txt
// a.txt 存的是一本三国演义
const p = new Promise((resolve, reject) => {
  console.log(3)

  // 立即执行的执行函数 executor
  fs.readFile('./b.txt', function (err, data) {
    if (err) {
      reject(err)
      console.log(err)
      return
    }
    // console.log(data.toString())
    resolve(data.toString())
    // resolve() 写在fs.readFile()之外  会先执行resolve()  Promise立即被销毁
  })
})

p.then(data => {
  console.log(data)
}).catch(err => {
  console.log(err)
})
console.log(4)
