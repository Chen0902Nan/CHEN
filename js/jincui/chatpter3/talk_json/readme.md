# 对象字面量 JSON Object

## JS 是最有表现力的脚本语言

- 不需要像 Java、C++ 先定义类 早先的 js class 没有关键字
- js 提供了对象字面量

## JS 数据类型

- 字符串 string
- 数值 number
- 布尔值 boolean
- 数组 array
- 未定义 undefined //声明了一个变量，但未赋值 ->对象声明了，但类型未确定
  - js 是一种弱类型的语言，声明变量时并不会同时指定类型 //变量的类型由值决定
  - 对象属性/数组元素不存在时，JS 自动给 undefined
- 空值 null
  - null 表示一个空值，但不是未定义
- 对象 object

## 面向对象

- 对象由属性和方法构成
- 简单的面向对象
- 复杂的人际关系的面向对象

## 设计模式

- 面相**接口（Interface）**的编程
- zzp -> xm 送花 大概率被拒
- 添加一个 xh 对象字面量 xh 拥有和 xm 一样的 receiveFlower 方法
- zzp -> xh ->xm xh 可以代理 xm 收花
- xm,xh 实现了一样的 receiveFlower 接口
- 这就是代理模式 Proxy
