function mySetInterval(fn, delay) {
  let timer = null; // 定时器ID
  let isCleared = false; // 是否清除标志

  function loop() {
    if (isCleared) return;
    timer = setTimeout(() => {
      fn();
      loop();
    }, delay);
  }

  loop();
  // 返回一个清楚函数
  return function clear() {
    isCleared = true;
    clearTimeout(timer);
  };
}

const stop = mySetInterval(() => {
  console.log("执行一次");
}, 1000);

setTimeout(() => {
  stop();
}, 3000);
