const fs = require("fs");

console.log("start");
//timer阶段
setTimeout(() => {
  console.log("timeout");
}, 0);
//check阶段
setImmediate(() => {
  console.log("immediate");
});
//poil阶段
fs.readFile(__filename, () => {
  console.log("readFile");

  setTimeout(() => {
    console.log("timeout in I/O");
  }, 0);

  setImmediate(() => {
    console.log("immediate in I/O");
  });
});

//microTask 阶段
//then 进入微任务队列 同步代码执行完成
Promise.resolve().then(() => {
  console.log("promise");
});

//mocroTask
process.nextTick(() => {
  console.log("nextTick");
});

console.log("end");
