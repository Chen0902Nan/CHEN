// es5 没有类 class
// JS函数是一等对象
// 首字母大写的 构造函数
function Car (color) {
  // this 指向新创建的对象
  this.color = color
  // 车的参数
  // this.name = 'Su7'
  // this.height = 1.4
  // this.weight = 1.5
  // this.long = 4800
}

Car.prototype = {
  name: 'Su7',
  height: 1.4,
  weight: 1.5,
  long: 4800,
  drive () {
    console.log('drive', '下赛道')
  }
}
const car1 = new Car('霞光紫')
console.log(car1, car1.prototype, car1.long)
car1.drive()

const car2 = new Car('海湾蓝')
console.log(car2, car2.prototype, car2.weight)

const car3 = new Car('璀璨杨红')
console.log(car3)
