// function Animal () {}
// function Person () {}
// const p = new Person()
// // OOP instanceof 关键字
// // 基于血缘关系的
// console.log(p.__proto__)

// Person.prototype = new Animal()
// // console.log(p instanceof Animal)
// console.log(p.__proto__ == Person.prototype)
function Animal () {
  this.species = '动物'
}
function Person (name, age) {
  this.name = name
  this.age = age
}
Person.prototype.sayHello = function () {
  console.log('你好')
}
const p = new Person('keji', 18)
console.log(Person.constructor)

// Person.prototype = new Animal() // const Person.prototype=new Animal()
// // console.log(p.__proto__, p.__proto__ == Person.prototype)
// const p2 = new Person('华高俊', 19)
// console.log(p2.__proto__, p2.__proto__.__proto__ == Animal.prototype)
// console.log(p2.__proto__.constructor.constructor)
