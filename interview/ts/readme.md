# ts的工具类型

面试官心态 ts 进阶+实战考点

- ts pick omit partial 工具类型
  为了避免重复定义相似的类型(不能滥用),让我们能基于一个已有的类型，像搭积木一样快速改造出新的类型。

```TypeScript
interfacr User{
  id:number;
  name:string;
  email:string;
  phone:number;
}

type UserContacInfo=Pick<User,'name'|'eamin'>

```

Pick 从类型里挑选出部分字段
Omit 从类型里选出部分字段
Partial 把所有状态变为可选

## 手写pick

先讲思路与实现的关键
遍历K(我们要的key)
从原始类型T里取出对应的属性
重新构造一个新类型

keyof T 可以得到一个类型里面所有的key
映射类型 
