const panels = document.querySelectorAll('.panel')
// console.log(
//   panels,
//   panels[0],
//   typeof panels[0],
//   Object.prototype.toString.call(panels[0])
// )
panels.forEach(function (item) {
  // console.log(item)
  //事件监听需要在具体的元素上
  item.addEventListener('click', function () {
    //排他思想
    const cur = document.querySelector('.active')
    if (cur) {
      cur.classList.remove('active')
    }
    item.classList.add('active')
  })
})
