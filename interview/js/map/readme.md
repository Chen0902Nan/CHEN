# map 方法

- ES6 数组新增方法
  遍历数组，回调函数执行，函数执行的结果，返回新数组

- MDN 文档
  map(element,index,arry)
  map 方法创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成

- NaN
  typeof:number
  是一种特殊的数字，表示不是一个数字，用来描述不合法的计算
  无效的数学计算

  - NaN(0/0) Ininity(6/0) -Ininity(-6/0)

  - NaN!===NaN

  - 判断 NaN
    if (Number.isNaN(someValue)) {
    console.log('这是 NaN');
    }

- parseInt(string,radix)

  - parseInt(string, radix) 解析一个字符串并返回指定基数的十进制整数，radix 是 2-36 之间的整数，表示被解析字符串的基数。
    string：要被解析的值。如果参数不是一个字符串，则将其转换为字符串 (使用 ToString 抽象操作)。字符串开头的空白符将会被忽略。
    radix: 2-36 的整数 超出这个范围会判断 NaN，但 0 为特例，会默认推理为 10 进制

- 腾讯面试题
  - console.log([1,2,3].map(parseInt))
    -> parseInt(1,0,[1,2,3])
    -> parseInt(2,1,[1,2,3])
    -> parseInt(3,2,[1,2,3])

# JS 面向对象式编程

- JS 是一门完全面向对象的编程语言
  'hello'.length
  520.1314.toFixed(2)
  传统的面向对象来说是不可理解的

- JS 为了统一代码风格，全面向对象
  'hello'.length
  -> (new String('hello')).length

  - 为了让 JS 简单，傻瓜， JS 的底层帮我们兜底 -> 包装类
    将简单数据类型的'hello'，包装为 String 对象
    const strObj=new String('hello')
    strObj.length
    strObj=null // 释放掉

- str.slice()
  支持传入负数
  但不会逆置大小顺序
- str.substring()
  不支持负数
  但可以逆置大小顺序

- str.indexOf('')
  返回 str 中某个字母的第一个下标
- str.lastIndexOf('')
  返回 str 中某个字母的最后一个下标
