function Person (name, age) {
  this.name = name
  this.age = age
}
Person.prototype.species = '人类'
const person1 = new Person('张三', 18)
const person2 = new Person('金总', 19)
console.log(person1.name, person1.species)
console.log(person1.__proto__) //实例原型对象
