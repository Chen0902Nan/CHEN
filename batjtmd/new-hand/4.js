// function Person(name){
//   this.name=name
// }
// Person.prototype.species='人类'
// function create(){
//   const Constructor=[].shift.apply(arguments)
//    const obj=Object.create(Constructor.prototype)
//    const result=Constructor.apply(obj,arguments)
//    return result!==null&&(typeof result=='object'||typeof result=='function')? result:obj
// }
const p=create(Person,'小红')
console.log(p.species);
function Person(name){
  this.name=name
}
Person.prototype.species='人类'
function create(Constructor,...args){
   const obj=Object.create(Constructor.prototype)
   const result=Constructor.apply(obj,args)
   return result!==null&&(typeof result=='object'||typeof result=='function')? result:obj
}
const p=create(Person,'小红')
console.log(p.species);
