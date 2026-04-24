- 声明一个字符串

  - 坚持一种代码风格，团队开发遵循团队
    - 单引号 ''
    - 双引号 ""
  - 模版字符串 ``
    - 多行操作，编写 html DOM 时，方便可读性
    - 内嵌的${}可以插入变量，避免繁琐的字符串拼接
  - new String
    字符串对象
    typeof -> Object
    具有对象的属性和方法
    具有对象的特性
    但增加了复杂性

- 字符串为什么具有 str.length()方法

  - 自动装箱
    //自动装箱原理
    let str = 'hello' // 字符串原始值

    // 当你访问 str.length 时，JavaScript 内部会：
    // 1. 临时创建一个 String 对象
    let tempStringObject = new String(str)

    // 2. 访问这个临时对象的 length 属性
    let length = tempStringObject.length

    // 3. 丢弃临时对象，返回原始值
    console.log(length) // 5

- map 数组重要 api
  - 遍历数组，对每个元素执行一个操作，并由返回值组成一个新的数组
