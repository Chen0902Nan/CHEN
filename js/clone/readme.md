# 深拷贝

- JSON.stringify()
  将数组序列化
- JSON.parse()
  将 json 格式数据返回成数组 反序列化

# 浅拷贝方法

- .slice() 仅限于数组
- ... 展开运算符
- 直接赋值 const arr2=arr
- Array.from() 仅限数组
- Object.asign([]/{},原对象)

# 深拷贝方法

- JSON.parse(JSON.stringify())
- structuredClone()
- Lodash 库
  np.
  const _ = require('lodash');
  const obj2 = _.cloneDeep(obj1);
