// 谁先settled，就返回谁的结果(不管成功还是失败)，其他promise也还会执行，但是没有意义了
// 首先要返回一个promise
// 传入一个interable点的promise数组或者类数组
// 对每一项做Promise.resolve 包装
// 手写Promise.race
const Promise_myRace = function (promises) {
  return new Promise((resolve, reject) => {
    let promisesArray;
    // 确保这是个可迭代对象
    try {
      promisesArray = Array.from(promises);
    } catch (err) {
      return reject(err);
    }

    // if (promisesArray.length == 0) {
    //   return resolve([]);
    // }

    promisesArray.forEach((value) => {
      // Promise上的静态方法 
      Promise.resolve(value)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};
