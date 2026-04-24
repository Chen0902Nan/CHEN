// 强类型可以杜绝90%的问题
function addTs(a: number, b: number): number {
  return a + b;
}
const result = addTs(1, 2);
console.log(result);

