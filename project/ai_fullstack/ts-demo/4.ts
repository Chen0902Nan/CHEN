let a: number = 1;
// a = "11"
let b: string = "hello";
let c: boolean = true;
let d: null = null;
let e: undefined = undefined;
let arr: number[] = [1, 2, 3];
let user: [number, string] = [1, "Tom"];
// 泛型 -> 类型的传参 T
let arr2: Array<number> = [1, 2, 3];
// ts 借鉴了java 微软
// 枚举类型
enum Status {
  Pending, // 0
  Success, // 1
  Failed, // 2
}
// 枚举类型
let s: Status = Status.Pending;
s = Status.Success;
// 赋值会让变量进行类型的确定
// ts 初学  可以用 any 救命
let aa: any = 1; // 任意类型 救命稻草 跳过类型检查，放弃类型约束 -> JavaScript
aa = "111";
aa = {};

let bb: unknown = 1; // 未知类型 更安全一些
bb = "1"; // 使用前做类型检测
bb.hello(); // 对象 未知类型可以接收任何类型 直接调用方法不可以

let user2: { name: string; age: number; hometown: string } = {
  name: "瞿翔",
  age: 18,
  hometown: "宜春",
};

// 接口
interface User {
  name: string;
  age: number;
  readonly id: number;
  hobby?: string;
}

const u: User = {
  name: "邹佳怡",
  age: 18,
  id: 1,
  hobby: "羊了个羊",
};

u.name = "陈炳南";
u.id = 2;

type ID = string | number; // 自定义类型,是类型不是值
ID = "111";
let num: ID = "111";

type UserType = {
  name: string;
  age: number;
  hobby?: string;
};

const f: UserType = {
  name: "徐行",
  age: 18,
  hobby: "瓦",
};
