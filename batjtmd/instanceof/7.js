// function foo () {}
// console.log(foo.__proto__ === Function.prototype)
// console.log(foo.__proto__.__proto__ === Object.prototype)
function Person () {}
function Animal () {}

Person.prototype = new Animal()
const p = new Person()
const a = new Animal()
console.log(p instanceof Animal)
console.log(p.__proto__ === new Animal())
console.log(p.__proto__ === Animal)
console.log(p.__proto__ === a)
console.log(p.__proto__ === Person.prototype)
