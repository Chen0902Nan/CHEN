// 手写Promise.all()
const Promise_myAll = function (promises) {
  return new Promise((resolve, reject) => {
    // 对参数进行判断 确保是个可迭代对象
    let promisesArray;
    try {
      promisesArray = Array.from(promises);
    } catch (err) {
      return reject(err);
    }
    let count = 0;
    const result = [];

    if (promisesArray.length == 0) {
      return resolve([]);
    }
    promisesArray.forEach((value, index) => {
      Promise.resolve(value)
        .then((res) => {
          result[index] = res;
          count++;
          if (count == promisesArray.length) {
            resolve(result);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};


