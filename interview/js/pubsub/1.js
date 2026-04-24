// 事件中心
// 手写自定义事件
class EventEmitter {
  constructor() {
    // this.listenners=[]
    // key1=[]
    // key2=[]
    // dom addEventListenner click mouseover
    // {} 各种事件的订阅
    this.events = {}; // 事件池子
  }
  // 订阅关系
  on(event, fn) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    // 解耦
    this.events[event].push(fn);
  }

  off(event, fn) {
    const fns = this.events[event];
    if (!fns) return;
    this.events[event] = fns.filter((item) => item !== fn);
  }

  emit(event, ...args) {
    const fns = this.events[event];
    if (!fns) return;
    // 拷贝一份，避免修改原数组
    fns.slice().forEach((fn) => fn(...args));
  }

  once(event, fn) {
    const onceFn = (...args) => {
      fn(...args);
      this.off(event, onceFn);
    };
    this.on(event, onceFn);
  }
}

const bus = new EventEmitter();

const A = (data) => console.log("A收到了:", data);
bus.on("hello", A);
const B = (data) => console.log("B收到了:", data);
bus.on("hello", B);

bus.emit("hello", "Hello World");
bus.once("once", (data) => console.log(data));
console.log(bus);
bus.off("hello", A);
bus.emit("once", "onceFn执行");
console.log(bus);
