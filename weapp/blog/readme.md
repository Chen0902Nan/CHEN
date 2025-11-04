# blog 小程序

- pages

  - page
    - wxml
    - wxss
    - js
    - json

- weapp

  - onclick
  - bindtap
  - js 文件是一个 Page 实例
    data 页面可以用到的数据
    事件处理函数在 Page({配置就好})
  - wx 对象
    weixin 的能力

  block 是一个可以接收指令的标签
  wx:for data.menus 循环输出
  wx:key 唯一的 ID

- rpx
  小程序独有的响应式单位
  不管是什么手机，都能适配
  不要用 px（绝对单位）
  rpx 宽度是 750rpx iphone 标准设备的单位
  如何等比例，由小程序自己去做
  设计师出的移动端设计稿就是 750

- 数据驱动界面
  - js Page({})
    data 绑定了数据
    wxml 模板 使用了{{}} 来绑定数据
    block wx:for 循环指令 -> 循环输出 默认每一项为 item
