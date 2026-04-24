// document 整个文档 添加了一个事件监听
// 首要渲染界面，html+css 不需要js参与
// DOMContentLoaded html 文档加载完后再执行
// DOM 文档结构
// script 会阻塞html的下载
document.addEventListener('DOMContentLoaded', function () {
  function playSound (event) {
    // event 事件对象，在事件发生时会给回调函数，包含在这次事件中的一些关键属性
    console.log(event)

    let keyCode = event.keyCode
    let element = document.querySelector('.key[data-key="' + keyCode + '"]')
    console.log(element)
    // DOM动态编程
    element.classList.add('active')
  }

  window.addEventListener('keydown', playSound)
})
