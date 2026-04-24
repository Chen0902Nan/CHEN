// 日志函数
const log = (type) => (message) => {
  console.log(`[${type}]:${message}`);
};
// 柯理化 固定函数参数
// 固定 日志类型 函数的语义
const errorLog = log("error");
const infoLog = log("info");

errorLog("接口异常");
infoLog("页面加载完成");
