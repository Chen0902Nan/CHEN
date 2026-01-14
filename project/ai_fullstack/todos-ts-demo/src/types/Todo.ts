// 数据状态是应用的核心，ts 保护数据状态
// 接口用来约定对象必须实现的属性和方法
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
