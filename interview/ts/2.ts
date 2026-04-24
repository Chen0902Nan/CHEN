// 泛型
// {} 返回的是新的类型
// extends 不是继承，是 受限于，必须是T的子集
type MyPick<T, K extends keyof T> = {
  // K是联合类型  "name"|"age"
  // [p in K] 相当于 for(const P of K)
  // 方括号 [] 告诉 TS：我们要创建一个新的对象类型（或接口）。 映射类型
  [P in K]: T[P];
};

type MyOmit<T, K extends keyof T> = {
  [P in K as P extends K ? never : P]: T[P];
};

