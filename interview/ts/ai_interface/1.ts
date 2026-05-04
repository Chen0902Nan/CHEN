function test(res: any) {
  res.sayHello();
}

function test2(res: unknown) {
  // unknown 要先进行类型收敛
  if (typeof res === "string") {
    res.toUpperCase();
  }
}
