// 手写Promise.allSettled
const Promise_allSettled = function (promises) {
  return new Promise((resolve, reject) => {
    // 验证是可迭代对象
    let promisesArray;
    try {
      promisesArray = Array.from(promises);
    } catch (err) {
      return reject(err);
    }

    const result = [];
    let count = 0;
    // 处理空数组
    if (promisesArray.length == 0) {
      return resolve([]);
    }

    promisesArray.forEach((value, index) => {
      Promise.resolve(value)
        .then((res) => {
          result[index] = { status: "fulfilled", value: res };
        })
        .catch((err) => {
          result[index] = { status: "rejected", value: err };
        })
        // 无论是否成功都计数++
        .finally(() => {
          count++;
          if (count == promisesArray.length) {
            resolve(result);
          }
        });
    });
  });
};
