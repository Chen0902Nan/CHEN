// ts 是js的超集，把ts当作js来写
function getArea(width: number, height: number): number {
  return width * height;
}
const area: number = getArea(20, 5);
console.log(area);
enum Status {
  pending,
  success,
  falied,
}

const res: Status = Status.pending;
console.log(res);
