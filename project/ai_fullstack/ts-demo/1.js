function add(a, b) {
  // js 是弱类型的优势：好学，易上手
  // js是弱类型的 容易出错
  // 大型项目的时候 因为弱类型带来的代码质量问题 要保证99.999%不会出问题
  // js 是动态语言 不是静态语言 运行的时候才会发生bug
  // typescript 是js的超集 是强类型（做类型的限定）、静态语言（如果有bug，编译的时候就报错）
  // 加法、拼接
  return a + b; // 二义性
}

const res = add("1", "2");
console.log(res);
