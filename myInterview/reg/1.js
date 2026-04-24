function toCamel(str) {
  const reg = /-(\w)/g;
  return str.replace(reg, (_, j) => {
    return j.toUpperCase();
  });
}
console.log(toCamel("background-color"));
