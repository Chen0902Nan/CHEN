// 手写 Pick
// extends 表示受限于T中的属性
// [] 告诉ts，我要创建一个新的对象类型 映射类型
// [P in K] 相当于 for(const P of K)
type My_Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// keyof 相当于 js 中的 Object.keys()
type My_Omit<T, K extends keyof T> = {
  [P in K as P extends K ? never : P]: T[P];
};

// 这个版本只能处理第一层
type MyPartial<T, K extends keyof T> = {
  [P in K]?: T[P];
};

type DeepPartial<T> = {
  // 1. 遍历所有 key
  [P in keyof T]?: // 2. 如果属性值还是一个对象，且不是函数/数组，就递归处理
  T[P] extends object
    ? T[P] extends Function | any[]
      ? T[P] // 函数或数组保持原样
      : DeepPartial<T[P]> // 递归
    : T[P]; // 基本类型直接返回
};
