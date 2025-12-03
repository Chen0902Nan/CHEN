# JS 中 this 的设计

## 自由变量的查找

- 编译阶段
- 作用域链
- Lexical Scope

## 如何拿到'time.geekbang.com'

- log bar.myName
- this
  在面向对象的方法内，**应该**可以通过 this 拿到对象的属性
  但是早期没有 class，函数里面需要 this 来完成 OOP
- js 做了一个不好的设计

  - this 由函数的调用方式决定

    - js 执行机制跟编译环境挂钩
    - this 是个例外 由调用方式（执行阶段）决定
      this 是指针，指向调用它的对象
      谁调用这个方法，this 就指向谁

  - 作为普通函数运行时 this 指向全局对象 window
    this 是没有必要的，js 函数特别灵活，js 作者忘了处理情况
    this 总有指向的地方，本身没有必要，js 作者偷懒，直接让 this 指向全局
    var 声明的变量，会挂载到全局 window 对象上
    不好，容易造成全局变量的污染，污染了 window
    let/const 声明的变量 不会
    严格模式 'use strict' 也规避了没有必要的 this 指向， 直接报错

## 执行上下文 来看待 this

## this 指向的各种情况

- 作为对象的方法被调用
  this 指向调用对象
- 作为普通函数被调用
  this 指向 window/global
  严格模式下 undefinded
- call/apply 绑定 this
  指向绑定的对象
- 构造函数(new)
  this 指向实例
- 事件处理函数 this 指向事件绑定的元素
