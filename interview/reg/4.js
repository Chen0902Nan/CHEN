// 字符串匹配规则表达式;
function toCamel(str) {
  // g 全部匹配
  const reg = /-(\w)/g;
  return str.replace(reg, (_, j) => {
    return j.toUpperCase();
  });
}
console.log(toCamel("background-color"));
console.log(toCamel("-webkit-animation-name"));
