class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, fn) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(fn);
  }

  off(event, fn) {
    const fns = this.events[event];
    if (!fns) return;
    this.events[event].fillter((item) => item !== fn);
  }

  emit(event, ...args) {
    const fns = this.events[event];
    if (!fns) return;
    fns.slice().forEach((fn) => fn(...args));
  }

  once(event, fn) {
    const onceFn = (...args) => {
      fn(...args);
      this.off(event, fn);
    };
    this.on(event, onceFn);
  }
}
