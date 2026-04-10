const str = "价格是100元";
// + 表示匹配一次或多次 贪婪匹配
const price = /\d+/;
const result = str.match(price)[0];
console.log(result[0]);
