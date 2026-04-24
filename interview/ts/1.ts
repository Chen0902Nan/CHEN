interface User {
  id: number;
  name: string;
  age: number;
}

type UserName = Pick<User, "name">;

type UserWioutAge = Omit<User, "age">;
// 更优
type PartialUser = Partial<User>;

// type PartialUser = {
//   id?: number;
//   name: string;
//   age?: number;
// };
