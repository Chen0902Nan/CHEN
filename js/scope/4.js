let name = '刘锦苗'
function showName () {
  console.log(name)
  if (true) {
    //  块级作用域
    let name = '大厂的苗子'
  }
  console.log(name)
}
showName()
