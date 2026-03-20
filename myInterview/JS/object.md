## 对象遍历的方法

1. for in 循环:for(const x of obj)...
   这种遍历方法会附带上对象原型链上的属性，要结合hasOwnProperty()

```
for(let key in obj){
  if(obj.hasOwnProperty(key)){
    console.log(key,obj[key])
  }
}
```

2. Object.keys() 返回的是一个数组

```
Object.keys(obj).forEach(key=>{
  console.log(key,obj[key])
})
```

3. Object.values() 返回一个数组

```
Object.values(obj).forEach(value=>{
  console.log(value)
})
```

4. Object.entries() 返回键和值，一个二维数组 [key,value]
```
const obj = { a: 1, b: 2 };
for (const [key, value] of Object.entries(obj)) {
    console.log(`${key}: ${value}`);
}
```

5. Object.getOwnPropertyNames()
   返回一个数组，包含对象自身的所有属性（包括不可枚举属性，但不包括 Symbol 属性）。
   特点：即使属性设置了 enumerable: false，也能遍历到。
   适用场景：需要遍历对象的内部属性或隐藏属性。

6. Reflect.ownKeys()
   返回一个数组，包含对象自身的所有属性，包括可枚举属性、不可枚举属性以及 Symbol 属性。
   特点：这是目前获取对象所有键的最全方法。
   适用场景：当你需要确保遍历到对象的所有内容时。
