// 分组捕获
const reg = /-(\w)/;
const str = "hello-world";
// console.log(reg.test("-1"));
// console.log(Object.prototype.toString.call(reg));
// console.log(str.match(reg));
// console.log(str.replace(reg, str.match(reg)[1].toUpperCase()));
console.log(
  str.replace(reg, (i, j) => {
    // console.log(i, j);
    return j.toUpperCase();
  }),
);
