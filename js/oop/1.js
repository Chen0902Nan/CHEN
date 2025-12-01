// Car 大写，开发约定是类
// name 和 color 就是模版 模版是抽象的，封装的特性在显现
var Cat = {
  name: '',
  color: ''
}
var cat1 = {} // 空对象
cat1.name = '肥波'
cat1.color = 'grey'
var cat2 = {}
cat2.name = '加菲猫'
cat2.color = 'orange'
// 比较麻烦 没什么关系 (函数封装实例化的过程)
//  __proto__属性
//  prototype
//  constructor
