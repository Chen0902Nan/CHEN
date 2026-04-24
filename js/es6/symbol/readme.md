# Symbol 何为？

- 独一无二的值
- 数据类型

  - 简单数据类型
    - 传统
      - 数值 number
      - 布尔 boolean
      - 字符串 string
      - 空值 null
      - 未定义 undefined
    - es6+
      - bigint 大数
      - symbol 符号
  - 复杂数据类型
    object 对象

- js 总共有 8 种数据类型
  七上八下
  number 和 bigint -> numeric

## Symbol

- 申明方式
  Symbol('label') 函数申明，但是简单数据类型
  参数 label 可选,即使 label 一样，再次添加也不会覆盖

- 作用 用于多于协作之中
  - 作为对象的唯一 Key,常用于多人协作，避免命名冲突
  - Symbol 的 Key 是不会被覆盖的
  - for key in 不可以枚举 Symbol
    Object.getOwnPropertySymbols()可以枚举
