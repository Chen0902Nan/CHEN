self.onmessage = async function (message) {
  console.log(message.data);

  self.postMessage("你好啊，worker线程");
};
