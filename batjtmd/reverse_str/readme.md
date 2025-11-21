<!-- 反转字符串 abc -> cba -->

function reversStr(str){
return str.split('').reverse().join('')
}

# 反转字符串

- 面试官的内心
  - api 的熟练度
  - 代码的逻辑能力
    很多种解法
    - 递归
      函数自己调用自己
      - 整个字符的反转 拆解为
        substr(1)+strcharAt(0) 不停地往后
      - 退出条件
      - 爆栈（风险），内存开销比较大
    - 循环
    - JS API .split().reverse.join
    - 字符串展开 [...str].reverse().join('')
