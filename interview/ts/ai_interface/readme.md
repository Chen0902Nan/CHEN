## 在定义AI接口返回的嵌套数据结构(如多轮对话)，如何用泛型与条件类型实现灵活的类型推导？

### 条件类型

Ts类型版本的三元运算符

T extends U ? X : Y
类型别名
type IsString<T>=T extends string ? true : false

### 多轮会话

聊天、工具调用记录、连贯理解

Record<string, unknown> 是 TypeScript 的一个内置工具类型，表示一个键为字符串、值为未知类型的对象，常用于灵活但类型安全的字典结构。

```ts
type MessageType = "system" | "human" | "ai" | "tool";
type ToolCall = {
  id: string;
  name: string;
  args: Record<string, unknown>;
};

type MessageContent<T extends MessageTyep>=T extends 'system'?{prompt:string}: T extends 'tool' ?{tool:string;result:unknown}: T extends 'ai' ? {content:string; toolCalls?;ToolCall[]}:{content:string
}

interface Message<T extends MessageType>{
  type:T;
  data:MessageContent<T>
}

type Message=Message<MessageType>[]

type ChatResponse={
  message:Message;
  hasToolCall:boolean;
}
```
