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
