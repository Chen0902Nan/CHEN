# typesctipt的工具类

为了避免重复定义相似的类型(不能滥用),让我们能基于一个已有的类型，像搭积木一样快速改造出新的类型。

## pick

基于一个已有的类型，选取其中部分类型，构建一个新类型

```typescript
interface User {
  nmae: string;
  age: number;
  address: string;
  id: number;
}

type MinUser = Pick<User, "name" | "id">;
```

- 运用场景
  User类型有很多的字段
  但有时候前端展示只需要简单的几个 name avatar

## Omit

基于一个已有类型，从中排除某些字段

- User
  从中剔除一些敏感信息

## Partial

把一个已有类型的属性都变成可选的

- 运用场景
  调用接口进行更新的时候，很少会需要传递所有参数

## 类型断言 as

类型断言本质上是一种欺骗编译器的手段，相当于告诉编译器：“我知道你知道这个是什么类型，但是我比你更懂，按我说的就好”

```ts
// 写法一
const someValue = someObject as string;

// 写法二 React不支持
const someValue = <string>someObject;
```

### 使用场景

编译器在有些时候无法从代码逻辑中推断出具体类型，但是我们知道它一定是一种类型，这时候就需要我们手动介入

1. 从联合类型中指定具体类型
   当我们有一个联合类型，根据业务场景，我们知道此时他一定是一种类型
2. 访问DOM元素
   这是最常见的场景，TS默认将document.getElementById 的返回类型视为 HTMLElement|null
   如果我们知道某个ID一定存在，且他一定是一个HTMLInputElement

```TypeScript
 // TS 只知道它是个 HTMLElement，没有 .value 属性
 const input = document.getElementById('my-input') as HTMLInputElement;
 console.log(input.value);
```

### 底线

类型断言不是强制的类型转换，只能用于A是B的子类，或者B是A的子类的情况，比如any 和 number
两个没有关系的类型不能使用类型断言 number 和 string

### 类型保护

可以通过 if(a intanceof b) 来让编译器自己确认类型

## 联合类型

它让一个变量的类型可以是多种类型

- 使用场景
  - 处理多种可能的输入值
    进行搜索的时候，可以通过id，也可以通过name等属性

  - 让API设计灵活化
    支持返回多种状态，用户状态枚举

  ```ts
  type status = "success" | "error" | "loading";
  let currentStatus: Status = "success";
  ```

  - 避免空指针异常
    string | null 或者 number | undefined？这些都是最简单的联合类型运用，它们有效地帮你在编译阶段就避开了“空指针”异常。
