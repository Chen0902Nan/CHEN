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

  - call/apply
  - 缺点：只能继承属性，继承不了方法，得不到 Parent.prototype 上的东西

- prototype 模式

  - 父类的实例作为子类的原型
    Son.prototype=new Parent()
  - 子类的原型的 constructor 再指回子类
    Son.prototype.constructor=Son
  - 缺点
    引用篡改：所有子类实例共用同一个原型对象，修改一个实例的引用类型属性，其他实例全受影响。
    无法传参：实例化子类时，没法给父类传参。

- 利用空对象作为中介

  - 编写继承函数  
    function inherit(child,parent){
    const F=new function(){}
    F.prototype=parent.prototype
    child.prototype=new F()
    child.prototype.constructor=child
    child.prototype.uber = parent.prototype;
    }
  - function child(){
    parent.apply(this)
    }
  - inherit(child,parent)

  - 优点：它完美解决了“既要继承原型方法，又不要父类实例属性干扰”的难题，同时没有引入多余的内存开销。

- 直接继承 Prototype

  - Son.prototype=Parent.prototype
  - Son.prototype.constructor=Son //对象是引用数据类型 同时也修改了 Parent.prototype 的 constructor 属性

- 寄生组合式继承（ES5 终极方案）

  - 属性用 apply/call 绑定
  - 原型用 Object.create 连接
    Son.prototype=Object.create(Parent.prototype)
    Son.prototype.constructor=Son
  - 优点：
    它避免了 new Pnimal() 的调用，因此不会在 Son.prototype 上产生多余的、无用的父类属性，只保留了纯净的原型链关系。

- ES6 class
