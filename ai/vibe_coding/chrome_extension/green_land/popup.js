// 等待DOM加载完成
 document.addEventListener('DOMContentLoaded', function() {
  const changeColorButton = document.getElementById('changeColor');
  
  // 添加按钮点击事件监听器
  changeColorButton.addEventListener('click', function() {
    // 获取当前激活的标签页
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      // 在当前标签页中执行脚本，修改背景颜色
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: setPageBackgroundColor
      });
    });
  });
  
  // 定义在页面中执行的函数
  function setPageBackgroundColor() {
    // 修改页面背景颜色为绿色
    document.body.style.backgroundColor = 'green';
    
    // 为了确保整个页面都能正确改变颜色，也修改html元素的背景色
    document.documentElement.style.backgroundColor = 'green';
  }
});