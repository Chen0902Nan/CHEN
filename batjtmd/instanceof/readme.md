# 手写 instanceof

- 原型和原型链
- 实例判断运算符 (instanceof typeof) 其他 OOP 语言
- 原型关系判断运算符

  - A instanceof B
    A 的原型链上，是否有 B 的原型

- 需求
  - 大型项目，多人协作，
    搞不清楚对象上有哪些属性和方法
    instanceof 有必要

## 继承的方式

本质就是父类的属性和方法，子类也能拿到

- 构造函数绑定继承
  call/apply
- prototype 模式
  - 父类的实例作为子类的原型
  - 子类的原型的 constructor 再指回子类
- 利用空对象作为中介

- Object Function
