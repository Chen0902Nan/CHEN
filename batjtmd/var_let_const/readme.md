# var_let_const

- js 中声明变量
- var 声明变量
  bad 和直觉不符合
  vat a=1 相当于
  var a 在代码一开始就可以访问 **变量提升** 编译阶段 -> 检测语法错误
  a=1 执行阶段

- let 声明变量

## 报错的集合

- ReferenceError: height is not defined // 在作用域外调用
- TypeError: Assignment to constant variable. // 对简单常量||修改对象常量的地址
- ReferenceError: Cannot access 'PI' before initialization // 提前访问暂时性死区（Dead Zone）错误
