# 正则表达式

- 用于字符串匹配的规则

- 基本用法
  a：具体匹配
  \d：表示匹配数字
  \w：表示匹配字面
  {10}：表示匹配的长度
  ^：表示字符的开始
  $：表示字符的结束
  \s；表示匹配空白符(空格、Tab、换行符)
  (\w)：表示捕获分组，不仅为了组合，还方便后续提取数据
  []：表示一个字符组，匹配到里面任意一个字符就算成功

- test方法 true|false 是否匹配正则
- str.match(reg) 表示匹配的结果

## 写一个函数，可以转化下滑线命名到驼峰命名

acb-cdf abcCdf -qwe-try qweTry

```
function toCamel(str) {
  const reg = /-(\w)/g;
  return str.replace(reg, (_, j) => {
    return j.toUpperCase();
  });
}
console.log(toCamel("background-color"));

```
