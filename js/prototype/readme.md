# 原型

- 如何拿到小米 su7
  - 类 构造函数 Car
  - new Car 实例
  - **prototype** 对象上方法或属性

## 什么是构造函数

- constructor
  new 的方式运行这个函数，this 指向新创建的对象，构造新对象的过程
  每个实例自己的
- prototype 对象：原型
  设置的属性和方法 让这个类的所有实例，都可以共享这些属性和方法(否则开销很大)

  - 孔子是韩国的
    JS 面相对象是原型式的面相对象 哲学性
  - 虽然原型对象上的属性和方法，不是直接设置在实例上，但是可以通过实例访问到
  - 何为 prototype?
    - JS 为了完成原型式的面相对象构建，实例的属性用 constructor,
      用 prototype 属性来设置共有的方法和属性
      每个函数都有一个 prototype 属性
    - prototype 属性的值是一个对象
      prototype 属性指向原型对象
      它上面的属性和方法会被所有的实例共享
    - 传统的 class 面相对象是血缘关系的，class 定义属性和方法的模板(抽象)
      实例是具体的
      JS 原型式的面向对象 不是血缘关系的 prototype
    - 所有的对象都有一个 '_proto_' 私有属性
    - 原型对象上有一个 constructor 属性，指向构造函数 -> .constructor
      由这个构造函数创建的实例，可以享用原型对象 -> ._proto_

- 任何对象都有一个 _proto_ 属性
- 任何对象都默认指向 Object.prototype, 除非，new 一个其他的构造函数
- Object.prototype._proto_ -> null 停止查找
