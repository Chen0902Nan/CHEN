class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 订阅
  on(event, fn) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(fn);
  }

  // 取消订阅
  off(event, fn) {
    const fns = this.events[event];
    if (!fns) return;
    this.events[event].fillter((item) => item !== fn);
  }

  // 发布
  emit(event, ...args) {
    const fns = this.events[event];
    if (!fns) return;
    fns.forEach((fn) => fn(...args));
  }

  // 执行一次就销毁
  once(event, fn) {
    const onceFn = (...args) => {
      fn(...args);
      this.off(event, fn);
    };
    this.on(event, onceFn);
  }
}
