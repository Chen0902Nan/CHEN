# 手写 new

- new 实例运算符
- 实例化的过程
  - new 构造函数 原型式的面向对象
  - 从空对象开始
  - this 指向新创建的对象，运行构造函数
  - *proto*指向构造函数的原型对象

## 类数组 Arguments

- 函数运行（调用）时候的参数对象
- js 函数的参数也是动态的
  function add(){
  }
- 类数组
  - 都有长度属性
  - 可以使用索引访问
    for 迭代
  - 不能使用数组的方法
    reduce map join...
  - 可以通过 Array.from()转为真数组

call,apply,bind
