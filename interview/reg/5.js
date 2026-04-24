const str = "apple,banana orange  strawberry";
// 正则中[]表示字符组合的任意一个
console.log(str.split(/[,\s]+/));
