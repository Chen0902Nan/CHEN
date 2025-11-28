function Person (name, age) {
  this.name = name
  this.age = age
}
Person.prototype.species = '人类'
let zhen = new Person('郑总', 18)
console.log(zhen.species)
const kong = {
  name: '孔子',
  hobbies: ['读书', '喝酒']
}
zhen.__proto__ = kong
console.log(zhen.hobbies)
console.log(zhen.__proto__, zhen.species)
