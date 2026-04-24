# 什么是泛型

- 泛型是为了解决TS灵活性与安全性之间的矛盾而设计的。本质上就是类型的变量
  在定义函数，接口，类时，我们不预先指定具体的类型，而是设置一个占位符T(Type)，这个具体类型直到真正使用时才由调用者传递过来

- 泛型是 TypeScript 逻辑复用的核心工具。它将类型参数化，让我们在编写代码时能够编写抽象的逻辑，而在执行时保持精确的类型检查。它避免了 any 带来的类型断层，通过泛型约束（使用extends）和工具类型（partial,omit,pick），我们可以构建出既灵活又高度健壮的类型系统。

# any、unknow、never

- any会关闭类型检查，接受所有类型，相当于JS，只在运行时检查报错
- unknow相当于更安全的any,也是所有类型的超集，可以把所有类型都给他。但是在使用unknow类型的值的时候，需要先对他进行类型收窄(类型判断),不然编译会报错
  使用场景：在处理不可预知的外界输入时。比如：封装一个通用的 JSON 解析函数，或者处理来自 API 的原始响应。我先把它标为 unknown，这会强制我在代码里进行类型判断（如 typeof 或 instanceof），从而保证了程序在运行时的健壮性，避免了 any 导致的‘白屏’风险。
- never
  用集合论的思想说，string代表字符串集，number代表数字集,never就表示空集，不包含任何值。我们不能把任何值赋值给never，除了nerver本身。
  - 使用场景
  1. 如果一个函数抛出异常或者是死循环，它会没有返回值,我们就使用never
  2. 保证代码的完整性：配合类型收敛进行全面性检查，利用它不能接收任何赋值的特性，确保我们在处理联合类型的时候没有遗漏任何分支

# type和interface

在项目开发中，type(类型别名)和interface(接口)都能定义类型。
其中interface是面向对象的，用来定义对象/类的类型，如果重复定义的话，会自动合并，支持extends继承和implements实现类。
type可以定义类型别名(通用类型)

```ts
type Name = string;
type Status = "success" | "error" | "loading"; // 联合类型
type Data = [number, string]; // 元组
```

如果重复定义会报错
type可以采用交叉类型合并

```ts
type Name = { name: string };
type Age = { age: number };
type student = Nmae & Age;
// 使用时必须同时包含name和age
```

Type：可以利用 in 关键字生成映射类型（比如根据已有的 key 生成新类型）。
Interface：无法使用映射类型。

```ts
type Keys = "firstname" | "surname";
type Flags = { [K in Keys]: boolean };
```

- 性能差异:
  在大型项目中，Interface 的编译性能通常优于 Type。
  原因：Interface 在编译器内部有缓存机制，且在进行类型检查时，对比两个命名接口的速度比对比两个复杂的匿名类型别名要快。

- 总结：
  interface 和 type 的主要区别在于扩展机制和应用范围。interface支持声明合并，且在编译器内部有更好的性能优化，更适合定义公共 API 和对象形状；而type更加灵活，支持联合类型、元组以及映射类型，是处理复杂逻辑运算的首选。在工程实践中，我倾向于‘优先接口，必要时才用类型别名’。”
