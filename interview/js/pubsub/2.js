// node 内置事件模块
const EventEmitter = require("events");

const myEmitter = new EventEmitter();
myEmitter.on("hello", (name) => {
  console.log("hello," + name);
});

myEmitter.emit("hello", "world");
